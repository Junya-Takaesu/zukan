import {PokemonAPIClient} from "../pokemonAPIClient/client.js";
import {utter} from "../common/utter.js";

export class CustomModal {
  constructor(pokemonNos) {
    this.pokemonNos = pokemonNos;
  }

  async initializeModals() {
    const apiClient = new PokemonAPIClient();
    const myPokemonString = this.pokemonNos.join("-");
    const pokemonsJson = await apiClient.fetchPokemons(myPokemonString);

    pokemonsJson.forEach(pokemon => {
      const stringifiedId = String(pokemon.pokemon_no).padStart(3, "0");
      const pokemonTile = document.getElementById(stringifiedId);
      pokemonTile.addEventListener("click", ()=> {
        this.populateModal(pokemon);
      });
    });
  }

  populateModal(pokemon) {
    const card = this.createCard(pokemon);
    let toLeftDiv, toRightDiv;

    $(card).modal();
    $(".modal").on($.modal.BEFORE_CLOSE, function () {$(".modal").remove();});

    [toLeftDiv, toRightDiv] = this.createArrows();

    toRightDiv.addEventListener("click", (event)=>{
      if(event.currentTarget.id == "to-right") {
        event.currentTarget.style.display = "none";
        toLeftDiv.style.display = "block";
      }
      $(".modal .content").empty();
    });
    toLeftDiv.addEventListener("click", (event)=>{
      if(event.currentTarget.id == "to-left") {
        event.currentTarget.style.display = "none";
        toRightDiv.style.display = "block";
      }
      this.populateModal(pokemon);
    });

    card.append(toLeftDiv);
    card.append(toRightDiv);
  }

  createCard(pokemon) {
    const pokemonName = pokemon.name;
    const pokemonImg = String(pokemon.pokemon_no).padStart(3, "0") + ".png";
    const pokemonAbilities = ""; //pokemon から取れるようにする
    const pokemonTypes = ""; //pokemon から取れるようにする
    const pokemonMoves = ""; //pokemon から取れるようにする
    const containerArticle = document.createElement("article");

    let excludeElements = [];

    for (let i in this.ARROW_TYPES) {
      excludeElements.push(this.ARROW_TYPES[i].arrowId);
    }

    containerArticle.classList.add("card");
    containerArticle.addEventListener("click", (event)=> {
      if(excludeElements.includes(event.target.id)) {
        return;
      }

      const speakerOnImg = "icons/audio.svg";
      const speakerOffImg = "icons/no-audio.svg";
      const containerElement = event.currentTarget;
      const audioIndicator = containerElement.querySelector(".audio-indicator");

      const onendCallback = () => {
        const indicatorImgSrc = audioIndicator.getAttribute("src")
        const src = indicatorImgSrc == speakerOnImg ? speakerOffImg : speakerOnImg;

        audioIndicator.setAttribute("src", src);
      }

      audioIndicator.setAttribute("src", speakerOnImg);
      utter(pokemonName, onendCallback);
    });

    containerArticle.innerHTML = `
      <img class="audio-indicator" src="icons/no-audio.svg" alt="音声表示" width="24" height="24">
      <img class="image" loading="lazy" src="images/${pokemonImg}" alt="${pokemonName} の画像" width="150" height="150">
      <section class="content">
        <h2 class="name">${pokemonName}</h2>
        <div class="attributes">
          <hr>
          <span class="attribute-header">のうりょく：</span>
          <span class="attribute-value">${pokemonAbilities}</span>
          <hr>
          <span class="attribute-header">タイプ：</span>
          <span class="attribute-value">${pokemonTypes}</span>
        </div>
      </section>
    `;

    return containerArticle;
  }

  createArrows() {
    const arrowTypeLeft = "1";
    const toLeftDiv = this.createArrowDiv(arrowTypeLeft);
    toLeftDiv.id = "to-left";
    toLeftDiv.style.display = "none";

    const arrowTypeRight = "2";
    const toRightDiv = this.createArrowDiv(arrowTypeRight);
    toRightDiv.id = "to-right";

    return [toLeftDiv, toRightDiv]
  }

  createArrowDiv(arrowType) {
    const arrowDiv = document.createElement("div");
    const arrowSpan = document.createElement("span");

    arrowSpan.innerText = this.ARROW_TYPES[arrowType].text;
    arrowSpan.id = this.ARROW_TYPES[arrowType].arrowId;
    arrowDiv.append(arrowSpan);
    return arrowDiv;
  }

  get ARROW_TYPES() {
    return {
      "1": {
        "text": "<",
        "arrowId": "to-left-arrow",
      },
      "2": {
        "text": ">",
        "arrowId": "to-right-arrow",
      }
    };
  }
}