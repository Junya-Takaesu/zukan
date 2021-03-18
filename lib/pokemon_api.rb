class PokemonApi

  Default_option_limit = 4
  Default_turn_limit = 3
  POKEMON_NO_LIMIT = 809

  def get_quiz_json
    options_limit = Default_option_limit
    turn_limit = Default_turn_limit
    quiz_hash = {
      pokemons: [],
      quiz_results: []
    }

    pokemon_options = Pokemon.where("pokemon_no < ?", POKEMON_NO_LIMIT).order("random()").take(options_limit*turn_limit).as_json

    pokemon_options.each_slice(options_limit) do |options|
      options.map {|option| option["isAnswer"] = false}
      options[shuffle(options_limit)]["isAnswer"] = true
      quiz_hash[:pokemons].push options
    end

    turn_limit.times {quiz_hash[:quiz_results].push nil}
    quiz_hash.to_json
  end

  def get_pokemons(params)
    sort_column = (params["sort_column"] && Pokemon.column_names.include?(params["sort_column"])) ? params["sort_column"] : "pokemon_no"
    order = (params["order"] && ["desc", "asc"].include?(params["order"])) ? params["order"] : "asc"

    if params["nos"]
      pokemon_nos = params["nos"].split("-")
      pokemons = Pokemon.includes(:abilities, :moves, :types).where(pokemon_no: pokemon_nos).order(sort_column.to_sym => order.to_sym)
    else
      if params["types"]
        types = params["types"].split("-")
        pokemons = Pokemon.includes(:abilities, :moves, :types).where("types.type_name" => types).order(sort_column.to_sym => order.to_sym)
      else
        pokemons = Pokemon.includes(:abilities, :moves, :types).all.order(sort_column.to_sym => order.to_sym)
      end

      if params["limit"]
        pokemons = pokemons.limit(params["limit"].to_i)
      end
    end

    pokemons = pokemons.where("pokemons.pokemon_no < ?", POKEMON_NO_LIMIT)
    response = prepare_pokemons(pokemons)

    response.to_json
  end

  def get_types
    response = []
    Type.select(:type_name).distinct.each do |type|
      response.push type.type_name
    end

    response.to_json
  end

  private
    def prepare_pokemons(pokemons)
      response = []
      pokemons.each do |pokemon|
        pokemon_record = {
          pokemon: {},
          abilities: [],
          moves: [],
          types: []
        }

        pokemon_record[:pokemon] = pokemon

        pokemon.abilities.each do |ability|
          pokemon_record[:abilities].push ability.ability_name
        end

        pokemon.moves.each do |move|
          pokemon_record[:moves].push move.move_name
        end

        pokemon.types.each do |type|
          pokemon_record[:types].push type.type_name
        end

        response.push pokemon_record
      end
      response
    end

    def shuffle(n)
      (rand()*n).floor
    end

    def json_params
      begin
        JSON.parse request.body.read
      rescue
        halt 400, { message: "Invalid JSON" }.to_json
      end
    end

end