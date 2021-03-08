require "active_record"
require "zeitwerk"

# zeitwerk が各ファイルを require する
# require したいファイルがあるディレクトリを push_dir で指定する
loader = Zeitwerk::Loader.new
loader.push_dir(File.expand_path __dir__)
loader.push_dir(File.expand_path "db")
loader.setup

class ApplicationRecord < ActiveRecord::Base
  include Database
  Database.establish_connection
  self.abstract_class = true
end