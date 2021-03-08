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
        t.integer :pokemon_no
        t.string  :move_type
        t.string  :move_name
      end
    end

    unless table_exists?(:abilities)
      create_table :abilities, force: :cascade do |t|
        t.integer :pokemon_no
        t.string  :ability_name
      end
    end

    unless table_exists?(:types)
      create_table :types, force: :cascade do |t|
        t.integer :pokemon_no
        t.string  :type_name
      end
    end

    unless foreign_key_exists?(:moves, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE moves
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end
    unless foreign_key_exists?(:abilities, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE abilities
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end
    unless foreign_key_exists?(:types, name: "fk_pokemon_no")
      alter_table_add_foreign_key = %(
        ALTER TABLE types
        ADD CONSTRAINT fk_pokemon_no
        FOREIGN KEY (pokemon_no)
        REFERENCES pokemons(pokemon_no)
        ON DELETE CASCADE;
      )
      ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
    end
  end

  def down
    ActiveRecord::Base.connection.execute("drop table pokemons cascade")
    ActiveRecord::Base.connection.execute("drop table moves cascade")
    ActiveRecord::Base.connection.execute("drop table abilities cascade")
    ActiveRecord::Base.connection.execute("drop table types cascade")
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