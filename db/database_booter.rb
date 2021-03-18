require "json"
require_relative "../models/application_record.rb"

class DatabaseBooter

  JSONS_GLOB = "db/jsons/*.json"
  BULK_INSERT_MAX = 100;

  def initialize
    schema = Schema.new
    schema.up
    @json_files = Dir[JSONS_GLOB]
  end

  def migrate
    pokemons = []
    abilities = []
    types = []
    moves = []

    @json_files.each do |json_file|
      json = File.read json_file
      parsed_json = JSON.parse json

      parsed_json.each do |pokemon|
        pokemons.push({
          pokemon_no: pokemon["no"],
          name: pokemon["name"],
          stage: pokemon["stage"]
        })

        pokemon["abilities"].each do |ability|
          abilities.push({
            ability_name: ability
          })
        end

        pokemon["types"].each do |type|
          types.push({
            type_name: type
          })
        end

        Move::TYPES.each do |move_type|
          pokemon[move_type].each do |move|
            (index, move_name) = move
            moves.push({
              move_name: move_name
            })
          end
        end
      end
    end

    abilities = abilities.index_by {|row| row[:ability_name]}.values
    types = types.index_by {|row| row[:type_name]}.values
    moves = moves.index_by {|row| row[:move_name]}.values

    buffers = {Pokemon: pokemons, Ability: abilities, Type: types,  Move: moves}
    insert_buffers buffers
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