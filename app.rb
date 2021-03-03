require "sinatra"
require "sinatra/cookies"
require "sinatra/namespace"
require "json"
require_relative "models/pokemon"
require_relative "models/ability"
require_relative "models/type"
require_relative "models/move"
require_relative "db/database_booter.rb"

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

set :static_cache_control, [:public, :max_age => 31536000]
enable :sessions

POKEMON_NO_LIMIT = 809;

get "/" do
  @page_title = "ポケモンずかん"
  @pokemons = Pokemon.where("pokemon_no < #{POKEMON_NO_LIMIT}").order("random()").take(30)
  erb :index
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
  end

  get "/quiz_json" do
    options_limit = 4
    turn_limit = 3
    quiz_hash = {
      pokemons: [],
      quiz_results: []
    }

    pokemon_options = Pokemon.where("pokemon_no < 809").order("random()").take(options_limit*turn_limit).as_json

    pokemon_options.each_slice(options_limit) do |options|
      options.map {|option| option["isAnswer"] = false}
      options[shuffle(options_limit)]["isAnswer"] = true
      quiz_hash[:pokemons].push options
    end

    turn_limit.times {quiz_hash[:quiz_results].push nil}
    quiz_hash.to_json
  end
end