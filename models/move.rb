require_relative "application_record"

class Move < ApplicationRecord
  belongs_to :pokemon, foreign_key: "pokemon_no", primary_key: "pokemon_no"
  TYPES = ["level_up_moves", "tms", "trs"]
end