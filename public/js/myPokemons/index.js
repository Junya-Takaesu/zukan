import {CustomModal} from "./customModal.js";
import {createGoToTopAnchor} from "../common/goToTopButton.js";

document.addEventListener("DOMContentLoaded", ()=>{
  const pokemonNos = JSON.parse(localStorage.getItem("myPokemons")) ?? [];
  const customModal = new CustomModal(pokemonNos);
  const countMyPokemon = pokemonNos.length;

  const myPokemonCounter = document.querySelector('.my-pokemon-stats p');
  myPokemonCounter.innerText = `${countMyPokemon} ${myPokemonCounter.innerText}`;

  pokemonNos.forEach(pokemonNo => {
    const id = String(pokemonNo).padStart(3, "0");
    const pokemonDom = document.getElementById(id);

    const img = pokemonDom.querySelector("img");
    img.src = `images/${id}.png`;
  })
  if (0 < countMyPokemon) {
    customModal.initializeModals();
  }
  document.querySelector("body").append(createGoToTopAnchor());
})