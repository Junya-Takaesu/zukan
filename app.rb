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

unless ENV['DATABASE_URL'].nil?
  ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')
end

db_booter = DatabaseBooter.new
if Pokemon.all.count == 0 && Ability.all.count == 0 && Type.all.count == 0 && Move.all.count == 0
  db_booter.migrate
end

set :static_cache_control, [:public, :max_age => 31536000]

get "/" do
  @page_title = "ポケモンずかん"
  # @pokemons = [Pokemon.first]
  # @pokemons = Pokemon.all
  @pokemons = Pokemon.take(10)
  erb :index
end

get "/quiz" do
  @page_title = "クイズ"
  erb :quiz
end

get "/:pokemon_no" do
  erb :detail
end