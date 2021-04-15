require "sinatra"
require "sinatra/namespace"
require "json"
require_relative "models/application_record"

# heroku 環境と、ローカル環境で設定を変える
if development?
  require "sinatra/reloader"
  set :bind, '0.0.0.0'
else
  unless ENV["PORT"].nil?
    set :port, ENV["PORT"]
  end
end

db_booter = DatabaseBooter.new
if Pokemon.all.count == 0 && Ability.all.count == 0 && Type.all.count == 0 && Move.all.count == 0
  db_booter.migrate
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
  @pokemon_count = PokemonApi::POKEMON_NO_LIMIT
  erb :my_pokemon
end

namespace "/api/v1" do
  pokemon_api = PokemonApi.new

  before do
    content_type "application/json"
  end

  get "/quiz_json" do
    pokemon_api.get_quiz_json
  end

  get "/pokemons" do
    pokemon_api.get_pokemons(params)
  end

  get "/types" do
    pokemon_api.get_types
  end
end