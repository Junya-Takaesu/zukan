require_relative "application_record"

class Pokemon < ApplicationRecord
  self.primary_key = :pokemon_no
  has_and_belongs_to_many :moves, foreign_key: "pokemon_no", join_table: "pokemons_moves"
  has_and_belongs_to_many :abilities, foreign_key: "pokemon_no", join_table: "pokemons_abilities"
  has_and_belongs_to_many :types, foreign_key: "pokemon_no", join_table: "pokemons_types"
end

if $0 == __FILE__
  # Pokemon.joins(:moves).where("pokemons.pokemon_no" => 13).each
end