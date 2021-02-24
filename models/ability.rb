require_relative "application_record"

class Ability < ApplicationRecord
  belongs_to :pokemon, foreign_key: "pokemon_no", primary_key: "pokemon_no"
end