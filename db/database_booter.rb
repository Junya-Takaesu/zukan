require "json"
require_relative "schema"
require_relative "../models/pokemon"
require_relative "../models/ability"
require_relative "../models/type"
require_relative "../models/move"

class DatabaseBooter

  JSONS_GLOB = "db/jsons/*.json"
  BULK_INSERT_MAX = 100;

  def initialize
    schema = Schema.new
    schema.up
    @json_files = Dir[JSONS_GLOB]
  end

  def migrate
    @json_files.each do |json_file|
      json = File.read json_file
      parsed_json = JSON.parse json

      pokemons = []
      abilities = []
      types = []
      moves = []

      parsed_json.each do |pokemon|
        pokemons.push({
          pokemon_no: pokemon["no"],
          name: pokemon["name"],
          stage: pokemon["stage"]
        })

        pokemon["abilities"].each do |ability|
          abilities.push({
            pokemon_no: pokemon["no"],
            ability_name: ability
          })
        end

        pokemon["types"].each do |type|
          types.push({
            pokemon_no: pokemon["no"],
            type_name: type
          })
        end

        Move::TYPES.each do |type|
          pokemon[type].each do |move|
            (index, move_name) = move
            moves.push({
              pokemon_no: pokemon["no"],
              move_type: type,
              move_name: move_name
            })
          end
        end

        if BULK_INSERT_MAX <= pokemons.length
          announce_bulk_insert("pokemons", pokemons.length, json_file)
          announce_bulk_insert("abilities", abilities.length, json_file)
          announce_bulk_insert("types", types.length, json_file)
          announce_bulk_insert("moves", moves.length, json_file)
          buffers = {Pokemon: pokemons, Ability: abilities, Type: types,  Move: moves}
          insert_buffers buffers

          pokemons = []
          abilities = []
          types = []
          moves = []
        end
      end

      if 0 < pokemons.length
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

  def announce_bulk_insert(table_name, records_count, file_name)
    puts "[#{__FILE__}] Inserting into #{table_name}: #{records_count} records from #{file_name}"
  end
end

if $0 == __FILE__
  db_booter = DatabaseBooter.new
  db_booter.migrate
end