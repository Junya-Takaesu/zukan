require "sinatra"
require_relative "models/pokemon"
require_relative "models/ability"
require_relative "models/type"
require_relative "models/move"
require_relative "db/database_booter.rb"

if development?
  require "sinatra/reloader"
end

unless ENV["PORT"].nil?
  set :port, ENV["PORT"]
end

db_booter = DatabaseBooter.new
if Pokemon.all.count == 0 && Ability.all.count == 0 && Type.all.count == 0 && Move.all.count == 0
  db_booter.migrate
end

set :static_cache_control, [:public, :max_age => 31536000]

get "/" do
  @pokemons = Pokemon.all
  erb :index
end

get "/:pokemon_no" do
  erb :detail
end