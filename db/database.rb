module Database
  def self.establish_connection
    # DATABASE_URL is only defined in heroku environment
    if ENV['DATABASE_URL'].nil?
      ActiveRecord::Base.establish_connection(
        adapter:  "postgresql",
        host:     "localhost",
        username: "gandhi",
        password: ENV["POKEMON_ZUKAN_DB_PASSWORD"],
        database: "pokemon_zukan"
      )
    else
      ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')
    end
  end
end