require 'active_record'
require_relative 'database'

class Schema
  include Database

  def self.create_tables
    Database.establish_connection

    ActiveRecord::Schema.define do
      unless table_exists?(:pokemons)
        create_table :pokemons, force: :cascade do |t|
          t.integer :pokemon_no, null: false
          t.string  :name,       null: false
          t.integer :stage
          t.string  :abilities
          t.string  :types
        end
        add_index :pokemons, :pokemon_no, unique: true
      end

      unless table_exists?(:moves)
        create_table :moves, force: :cascade do |t|
          t.integer :no
          t.string  :move_type
          t.string  :name
        end
      end
    end

    alter_table_add_foreign_key = %(
      ALTER TABLE moves
      ADD CONSTRAINT fk_pokemon_no
      FOREIGN KEY (no)
      REFERENCES pokemons(pokemon_no)
      ON DELETE CASCADE;
    )
    ActiveRecord::Base.connection.execute(alter_table_add_foreign_key)
  end
end

if $0 == __FILE__
  Schema.create_tables
end