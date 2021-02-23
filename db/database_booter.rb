require "json"
require_relative "schema"
require_relative "../models/pokemon.rb"
require_relative "../models/move.rb"

class DatabaseBooter

  JSONS_GLOB = "db/jsons/*.json"
  BULK_INSERT_MAX = 100;

  def initialize
    Schema.create_tables
    @json_files = Dir[JSONS_GLOB]
  end

  def migrate
    @json_files.each do |json_file|
      json = File.read json_file
      parsed_json = JSON.parse json

      pokemons = []
      moves = []

      parsed_json.each do |pokemon|
        pokemons.push({
          pokemon_no: pokemon["no"],
          name: pokemon["name"],
          stage: pokemon["stage"],
          abilities: pokemon["abilities"],
          types: pokemon["types"]
        })

        Move::TYPES.each do |type|
          pokemon[type].each do |move|
            (index, move_name) = move
            moves.push({
              no: pokemon["no"],
              move_type: type,
              name: move_name
            })
          end
        end

        if BULK_INSERT_MAX <= pokemons.length
          pp "[#{__FILE__}] Inserting #{pokemons.length} records from #{json_file}"
          buffers = {Pokemon: pokemons, Move: moves}
          insert_buffers buffers

          pokemons = []
          moves = []
        end
      end

      if 0 < pokemons.length
        pp "[#{__FILE__}] Inserting #{pokemons.length} records from #{json_file}"
        Pokemon.insert_all(pokemons)
        Move.insert_all(moves)
      end
    end
  end

  def insert_buffers(buffers = {})
    buffers.each do |class_name, buffer|
      model = Module.const_get class_name
      model.insert_all(buffer)
    end
  end
end

if $0 == __FILE__
  db_booter = DatabaseBooter.new
  db_booter.migrate
end