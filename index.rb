require "sinatra"
require "sinatra/reloader"
require_relative "database/pokemons"
require_relative "database/moves"

get "/" do
  pokemons = Pokemons.new
  @pokemons = pokemons.select.to_a.shuffle
  erb :index
end

post "/" do
  erb :detail
end