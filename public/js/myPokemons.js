(() => {

  const pokemonNos = JSON.parse(localStorage.getItem("myPokemons"));

  pokemonNos.forEach(pokemonNo => {
    const id = String(pokemonNo).padStart(3, "0");
    pokemonDom = document.getElementById(id);

    const img = pokemonDom.querySelector("img");
    img.src = `images/${id}.png`;
  })

})()