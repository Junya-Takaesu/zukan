require "sinatra"
require "sinatra/cookies"
require "sinatra/namespace"
require "json"
require_relative "models/application_record"
require 'benchmark'

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

POKEMON_NO_LIMIT = 809

before do
  session[:my_pokemons] = [] unless session[:my_pokemons]
end

get "/" do
  @page_title = "ポケモンずかん"
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
    headers "Access-Control-Allow-Origin" => "http://localhost:4567"
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
    sort_column = (params["sort_column"] && Pokemon.column_names.include?(params["sort_column"])) ? params["sort_column"] : "pokemon_no"
    order = (params["order"] && ["desc", "asc"].include?(params["order"])) ? params["order"] : "asc"

    if params["nos"]
      pokemon_nos = params["nos"].split("-")
      pokemons = Pokemon.includes(:abilities, :moves, :types).where(pokemon_no: pokemon_nos).order(sort_column.to_sym => order.to_sym)
    else
      if params["types"]
        types = params["types"].split("-")
        pokemons = Pokemon.includes(:abilities, :moves, :types).where("types.type_name" => types).order(sort_column.to_sym => order.to_sym)
      else
        pokemons = Pokemon.includes(:abilities, :moves, :types).all.order(sort_column.to_sym => order.to_sym)
      end

      if params["limit"]
        pokemons = pokemons.limit(params["limit"].to_i)
      end
    end

    pokemons = pokemons.where("pokemons.pokemon_no < ?", POKEMON_NO_LIMIT);

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

  get "/types" do
    response = []
    Type.select(:type_name).distinct.each do |type|
      response.push type.type_name
    end

    response.to_json
  end
end