=begin
データベースに接続するためのコンフィグ
=end
module DatabaseConfig
  HOST = "localhost"
  PORT = "5432"
  DBNAME = "pokemon_zukan"
  USER = "gandhi"
  PASSWORD = ENV["POKEMON_ZUKAN_DB_PASSWORD"]
end

if $0 == __FILE__
  puts DatabaseConfig::HOST
  puts DatabaseConfig::PORT
  puts DatabaseConfig::DBNAME
  puts DatabaseConfig::USER
  puts DatabaseConfig::PASSWORD
end