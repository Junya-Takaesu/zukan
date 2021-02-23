require_relative "application_record"

class Move < ApplicationRecord
  TYPES = ["level_up_moves", "tms", "trs"]
end