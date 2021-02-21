require_relative "database"

class Pokemons < Database
  attr_accessor :params, :error

  TABLE_NAME = "pokemons"

  COLUMNS = {
    ID: "serial not null unique",
    POKEMON_NO: "smallserial unique not null",
    NAME: "text not null",
    STAGE: "smallint",
    ABILITIES: "text",
    TYPES: "text",
  }

  def initialize(params: {})
    @params = params
    @error_messages = []
    super(table: TABLE_NAME)
  end
end

# 使用例:
# レコードの検索
#   ruby database/moves.rb select
# テーブルの作り直し
#   ruby database/moves.rb drop create
if $0 == __FILE__
  def exec(args)
    pokemons = Pokemons.new
    results = {}
    args.each do | arg |
      case arg
      when "count"
        results[:count] = pokemons.select(columns: ["count(*)"]).to_a.first
      when "select"
        results[:select] = pokemons.select.to_a
      when "insert"
        results[:insert] = pokemons.insert(params: ["32767", "hoge type", "hoge attack"])
      when "drop"
        results[:drop] = pokemons.drop
      when "create"
        results[:create] = pokemons.migrate
      end
    end
    results
  end

  pp exec(ARGV)
end