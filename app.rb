require "sinatra"
require "sinatra/cookies"
require "sinatra/namespace"
require "json"
require_relative "models/application_record"

# heroku 環境と、ローカル環境で設定を変える
if development?
  require "sinatra/reloader"
  require "pry"
else
  unless ENV["PORT"].nil?
    set :port, ENV["PORT"]
  end
  unless ENV['DATABASE_URL'].nil?
    ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')
  end
end

db_booter = DatabaseBooter.new
if Pokemon.all.count == 0 && Ability.all.count == 0 && Type.all.count == 0 && Move.all.count == 0
  db_booter.migrate
end

POKEMON_NO_LIMIT = 809 unless POKEMON_NO_LIMIT

before do
  session[:my_pokemons] = [] unless session[:my_pokemons]
end

get "/" do
  @page_title = "ポケモンずかん"
  # Eager loadgin が必要
  @pokemons = Pokemon.where("pokemon_no < ?", POKEMON_NO_LIMIT).order("random()").take(30)
  erb :home
end

get "/detail/:pokemon_no" do
  erb :detail
end

get "/quiz" do
  @page_title = "クイズ"
  erb :quiz
end

get "/my_pokemon" do
  @page_title = "てもちポケモン"
  @pokemon_count = POKEMON_NO_LIMIT
  erb :my_pokemon
end

namespace "/api/v1" do
  before do
    content_type "application/json"
  end

  helpers do
    def shuffle(n)
      (rand()*n).floor
    end

    def json_params
      begin
        JSON.parse request.body.read
      rescue
        halt 400, { message: "Invalid JSON" }.to_json
      end
    end
  end

  get "/quiz_json" do
    headers \
      "Access-Control-Allow-Origin" => "http://localhost:4567"
    options_limit = 4
    turn_limit = 3
    quiz_hash = {
      pokemons: [],
      quiz_results: []
    }

    pokemon_options = Pokemon.where("pokemon_no < ?", POKEMON_NO_LIMIT).order("random()").take(options_limit*turn_limit).as_json

    pokemon_options.each_slice(options_limit) do |options|
      options.map {|option| option["isAnswer"] = false}
      options[shuffle(options_limit)]["isAnswer"] = true
      quiz_hash[:pokemons].push options
    end

    turn_limit.times {quiz_hash[:quiz_results].push nil}
    quiz_hash.to_json
  end

  get "/pokemons" do
    headers \
      "Access-Control-Allow-Origin" => "http://localhost:4567"

    if params["nos"]
      pokemon_nos = params["nos"].split("-")
      pokemons = Pokemon.includes(:abilities, :moves, :types).where(pokemon_no: pokemon_nos)
    else
      pokemons = Pokemon.includes(:abilities, :moves, :types).all
    end

    response = []
    pokemons.each do |pokemon|
      pokemon_record = {
        pokemon: {},
        abilities: [],
        moves: [],
        types: []
      }

      pokemon_record[:pokemon] = pokemon

      pokemon.abilities.each do |ability|
        pokemon_record[:abilities].push ability.ability_name
      end

      pokemon.moves.each do |move|
        pokemon_record[:moves].push move.move_name
      end

      pokemon.types.each do |type|
        pokemon_record[:types].push type.type_name
      end

      response.push pokemon_record
    end

    response.to_json
  end
end