require "json"
require_relative "database/pokemons"
require_relative "database/moves"

def migrate_jsons(dir)
  pokemons = Pokemons.new
  moves = Moves.new
  json_files = Dir[dir]
  processed_file_count = 0

  json_files.each do |json_file|
    processed_file_count += 1

    json = File.read json_file
    parsed_json = JSON.parse json
    move_types = ["level_up_moves", "tms", "trs"]

    processed_pokemon_count = 0
    parsed_json.each do |pokemon|

      pp "Processing json: #{processed_file_count}/#{json_files.length}(#{json_file}), pokemon: #{processed_pokemon_count}/#{parsed_json.length}"
      processed_pokemon_count += 1

      pokemons.insert(
        params: [
          pokemon["no"],
          pokemon["name"],
          pokemon["stage"],
          pokemon["abilities"],
          pokemon["types"],
        ]
      )

      move_types.each do |type|
        pokemon[type].each do |move_name|
          (index, move_name) = move_name
          if !move_name.nil?
            moves.insert(
              params: [
                pokemon["no"],
                type,
                move_name
              ]
            )
          end
        end
      end
    end
    pp "Processing json: #{processed_file_count}/#{json_files.length}(#{json_file}), pokemon: #{processed_pokemon_count}/#{parsed_json.length}"

  end
end

migrate_jsons("jsons/*")