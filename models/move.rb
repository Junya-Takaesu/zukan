require_relative "application_record"

class Move < ApplicationRecord
  has_and_belongs_to_many :pokemons, foreign_key: "pokemon_no", primary_key: "pokemon_no"
  TYPES = ["level_up_moves", "tms", "trs"]
end