(() => {

  const pokemonNos = JSON.parse(localStorage.getItem("myPokemons"));

  const myPokemonCounter = document.querySelector('.my-pokemon-stats p');
  myPokemonCounter.innerText = `${pokemonNos.length} ${myPokemonCounter.innerText}`;

  pokemonNos.forEach(pokemonNo => {
    const id = String(pokemonNo).padStart(3, "0");
    pokemonDom = document.getElementById(id);

    const img = pokemonDom.querySelector("img");
    img.src = `images/${id}.png`;
  })

})()