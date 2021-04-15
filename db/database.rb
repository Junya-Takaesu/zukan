module Database
  def self.establish_connection
    if ENV['DATABASE_URL'].nil?
      ActiveRecord::Base.establish_connection(
        adapter:  "postgresql",
        host:     "db",
        username: "postgres",
        password: "password",
        database: "pokemon_zukan"
      )
    else
      ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')
    end
  end
end