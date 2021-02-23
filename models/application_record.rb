require "active_record"
require_relative "../db/database.rb"

class ApplicationRecord < ActiveRecord::Base
  include Database
  Database.establish_connection
  self.abstract_class = true
end