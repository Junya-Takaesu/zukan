import { UI } from "./ui.js";
import {PokemonAPIClient} from "../pokemonAPIClient/client.js";

document.addEventListener("DOMContentLoaded", async ()=>{
  const apiClient = new PokemonAPIClient();
  const ui = new UI();
  const params = {
    "limit": 30
  };

  apiClient.fetchTypes()
    .then(typesJson => {
      ui.renderTypeTags(typesJson);
    });

  apiClient.fetchPokemons(params)
    .then(pokemonsJson => {
      ui.renderCards(pokemonsJson);
    });
})