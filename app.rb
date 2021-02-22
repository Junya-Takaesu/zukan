require "sinatra"
require "sinatra/reloader"
require_relative "database/pokemons"
require_relative "database/moves"

set :static_cache_control, [:public, :max_age => 31536000]

get "/" do
  pokemons = Pokemons.new
  @pokemons = pokemons.select.to_a
  erb :index
end

post "/" do
  erb :detail
end