import {utter} from "../common/utter.js";

const pokemonCards = document.querySelectorAll(".card");

pokemonCards.forEach(card => {
  const utterable = card.querySelector(".utterable");

  card.addEventListener("click", ()=>{utter(utterable.dataset.utterableText)});
});