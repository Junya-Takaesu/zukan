require "json"
require_relative "../models/application_record"

class DatabaseBooter
  JSONS_GLOB = "db/jsons/*.json"

  def initialize
    schema = Schema.new
    schema.up
    @json_files = Dir[JSONS_GLOB]
  end

  def migrate
    ActiveRecord::Base.transaction do
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

      abilities = distinct_by_key(abilities, :ability_name)
      types = distinct_by_key(types, :type_name)
      moves = distinct_by_key(moves, :move_name)

      buffers = { Pokemon: pokemons, Ability: abilities, Type: types, Move: moves }
      insert_buffers buffers
      migrate_join_tables
    end
  end

  private

  def migrate_join_tables
    pokemons_abilities = []
    pokemons_types = []
    pokemons_moves = []

    abilities = Ability.all.pluck(:ability_name, :id).to_h
    types = Type.all.pluck(:type_name, :id).to_h
    moves = Move.all.pluck(:move_name, :id).to_h

    @json_files.each do |json_file|
      json = File.read json_file
      parsed_json = JSON.parse json

      parsed_json.each do |pokemon|
        pokemon_no = pokemon["no"]

        pokemon["abilities"].each do |ability|
          pokemons_abilities.push({
                                    pokemon_no: pokemon_no,
                                    ability_id: abilities[ability]
                                  })
        end

        pokemon["types"].each do |type|
          pokemons_types.push({
                                pokemon_no: pokemon_no,
                                type_id: types[type]
                              })
        end

        Move::TYPES.each do |move_type|
          pokemon[move_type].each do |move|
            (index, move_name) = move
            pokemons_moves.push({
                                  pokemon_no: pokemon_no,
                                  move_type: "'#{move_type}'",
                                  move_id: moves[move_name]
                                })
          end
        end
      end
    end

    insert_raw_sql(table = "pokemons_abilities", pokemons_abilities)
    insert_raw_sql(table = "pokemons_types", pokemons_types)
    insert_raw_sql(table = "pokemons_moves", pokemons_moves)
  end

  def insert_buffers(buffers = {})
    buffers.each do |class_name, buffer|
      model = Module.const_get class_name
      model.insert_all(buffer)
    end
  end

  def insert_raw_sql(table, rows = [])
    columns = get_keys(rows)
    values = []
    sql = "INSERT INTO #{table} (#{columns.join(',')}) VALUES "

    rows.each do |row|
      values.push "(#{row.values.join(',')})"
    end

    ActiveRecord::Base.connection.execute(sql + values.join(","))
  end

  def get_keys(rows)
    rows.index_by { |r| r.keys }.values[0].keys
  end

  def distinct_by_key(hash, key)
    hash.index_by { |row| row[key] }.values
  end
end

if $0 == __FILE__
  db_booter = DatabaseBooter.new
  db_booter.migrate
end
