require_relative "application_record"

class Pokemon < ApplicationRecord
  has_many :moves, foreign_key: "pokemon_no", primary_key: "pokemon_no"
  has_many :abilities, foreign_key: "pokemon_no", primary_key: "pokemon_no"
  has_many :types, foreign_key: "pokemon_no", primary_key: "pokemon_no"
end