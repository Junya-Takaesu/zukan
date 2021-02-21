require "json"
require_relative "database/pokemons"
require_relative "database/moves"

pokemon_json_1 = File.read "./jsons/gen1-jp.json"

parsed_pokemon_list_1 = JSON.parse pokemon_json_1

pokemons = Pokemons.new
moves = Moves.new

move_types = ["level_up_moves", "tms", "trs"]

count = 0
parsed_pokemon_list_1.each do |pokemon|

  pp "Processing #{count}/#{parsed_pokemon_list_1.length}"
  count += 1

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
      pp move_name
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

pp "Processing #{count}/#{parsed_pokemon_list_1.length}"
puts "ぽけもんげっとだぜ！"


#検証用 SQL
# select pokemons.name, pokemons.pokemon_no, count(moves.name) from pokemons inner join moves on pokemons.pokemon_no = moves.pokemon_no group by pokemons.name, pokemons.pokemon_no;
