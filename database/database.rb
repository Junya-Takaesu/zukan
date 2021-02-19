require "pg"
require_relative "database_config"

class Database
  include DatabaseConfig

  DEFAULT_COLUMNS = [:ID, :CREATED_AT, :UPDATED_AT]

  def initialize(table: "")
    @conn = PG::connect(
      host: DatabaseConfig::HOST,
      port: DatabaseConfig::PORT,
      dbname: DatabaseConfig::DBNAME,
      user: DatabaseConfig::USER,
      password: DatabaseConfig::PASSWORD,
    )

    @table = table
  end

  def select(columns: ["*"], where: {})
    sql = sprintf "select %s from %s", columns.join(","), @table

    if where.any?
      parameters = []
      where.each_with_index do |(column, value), index|
        parameters.push("#{column} = $#{index+1}") # plus 1 の必要ある?
      end
      sql += " where " + parameters.join(" and ")
    end

    @conn.prepare "prepared", sql
    result = @conn.exec_prepared "prepared", where.values.empty? ? [] : where.values
    @conn.exec("DEALLOCATE prepared")
    result
  end

  def insert(params: [])
    columns = exclude_defaults columns: self.class::COLUMNS
    bind_params = []

    columns.length.times do |index|
      bind_params.push "$#{(index+1).to_s}"
    end

    sql = sprintf "INSERT INTO %s (%s) VALUES (%s)", @table, columns.join(", "), bind_params.join(", ")

    @conn.prepare "prepared", sql
    result = @conn.exec_prepared "prepared", params
    @conn.exec "DEALLOCATE prepared"
    result
  end

  def migrate
    columns = []
    self.class::COLUMNS.each do |key, value|
      columns.push "#{key.downcase.to_s} #{value}"
    end
    columns_attributes = columns.join ","

    sql = sprintf "CREATE TABLE #{self.class::TABLE_NAME} (%s)", columns_attributes
    @conn.exec sql
  end

  def drop
    @conn.exec "drop table #{self.class::TABLE_NAME} cascade"
  end

  private

    def exclude_defaults(columns: {})
      return if columns.empty?
      columns.keys.select {|column| !DEFAULT_COLUMNS.include?(column)}
    end
end

if $0 == __FILE__
  database = Database.new
end