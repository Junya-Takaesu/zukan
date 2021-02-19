require_relative "database"

class Moves < Database
  attr_accessor :params, :error

  TABLE_NAME = "moves"

  COLUMNS = {
    ID: "serial not null",
    POKEMON_ID: "integer REFERENCES pokemons (id)",
    MOVE_TYPE: "text not null",
    NAME: "text not null"
  }

  def initialize(params: {})
    @params = params
    @error_messages = []
    super(table: TABLE_NAME)
  end
end

if $0 == __FILE__
  def exec(args)
    moves = Moves.new
    results = {}
    args.each do | arg |
      case arg
      when "count"
        results[:count] = moves.select(columns: ["count(*)"]).to_a.first
      when "select"
        results[:select] = moves.select.to_a
      when "insert"
        results[:insert] = moves.insert(params: ["32767", "hoge type", "hoge attack"])
      when "drop"
        results[:drop] = moves.drop
      when "create"
        results[:create] = moves.migrate
      end
    end
    results
  end

  pp exec(ARGV)

end