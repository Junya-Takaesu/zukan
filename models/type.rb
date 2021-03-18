require_relative "application_record"

class Type < ApplicationRecord
  has_and_belongs_to_many :pokemons, foreign_key: "pokemon_no", primary_key: "pokemon_no"
end