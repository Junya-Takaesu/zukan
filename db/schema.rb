require_relative "../models/application_record"

class Schema < ActiveRecord::Migration[6.0]
  def up
    unless table_exists?(:pokemons)
      create_table :pokemons, force: :cascade do |t|
        t.integer :pokemon_no, null: false
        t.string  :name,       null: false
        t.integer :stage
      end
      add_index :pokemons, :pokemon_no, unique: true
    end

    unless table_exists?(:moves)
      create_table :moves, force: :cascade do |t|
        t.string  :move_name
      end
    end

    unless table_exists?(:pokemons_moves)
      create_table :pokemons_moves, id: false do |t|
        t.integer :pokemon_no
        t.string  :move_type
        t.integer :move_id
      end
    end

    unless table_exists?(:abilities)
      create_table :abilities, force: :cascade do |t|
        t.string  :ability_name
      end
    end

    unless table_exists?(:pokemons_abilities)
      create_table :pokemons_abilities, id: false do |t|
        t.integer :pokemon_no
        t.integer :ability_id
      end
    end

    unless table_exists?(:types)
      create_table :types, force: :cascade do |t|
        t.string  :type_name
      end
    end

    unless table_exists?(:pokemons_types)
      create_table :pokemons_types, id: false do |t|
        t.integer :pokemon_no
        t.integer :type_id
      end
    end

    unless foreign_key_exists?(:pokemons_moves, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_moves
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end

    unless foreign_key_exists?(:pokemons_moves, name: "fk_move_id")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_moves
        ADD CONSTRAINT fk_move_id
        FOREIGN KEY (move_id)
        REFERENCES moves(id)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end

    unless foreign_key_exists?(:pokemons_abilities, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_abilities
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end

    unless foreign_key_exists?(:pokemons_abilities, name: "fk_ability_id")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_abilities
        ADD CONSTRAINT fk_ability_id
        FOREIGN KEY (ability_id)
        REFERENCES abilities(id)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end

    unless foreign_key_exists?(:pokemons_types, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_types
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end

    unless foreign_key_exists?(:pokemons_types, name: "fk_type_id")
      alter_table_add_foreign_key = %(
        ALTER TABLE pokemons_types
        ADD CONSTRAINT fk_type_id
        FOREIGN KEY (type_id)
        REFERENCES types(id)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end
  end

  def down
    ActiveRecord::Base.connection.execute("drop table pokemons cascade")
    ActiveRecord::Base.connection.execute("drop table moves cascade")
    ActiveRecord::Base.connection.execute("drop table pokemons_moves cascade")
    ActiveRecord::Base.connection.execute("drop table abilities cascade")
    ActiveRecord::Base.connection.execute("drop table pokemons_abilities cascade")
    ActiveRecord::Base.connection.execute("drop table types cascade")
    ActiveRecord::Base.connection.execute("drop table pokemons_types cascade")
  end
end

if $0 == __FILE__
  schema = Schema.new
  error_message = "up か down を指定してください"
  pp error_message if ARGV.empty?
  ARGV.each do |arg|
    case arg
    when "up"
      schema.up
    when "down"
      schema.down
    else
      pp error_message
    end
  end
end