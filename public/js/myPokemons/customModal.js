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
        $(this.createCard(pokemon)).modal();
        $(".modal").on($.modal.BEFORE_CLOSE, function () {$(".modal").remove();});
      });
    });
  }

  createCard(pokemon) {
    const pokemonName = pokemon.name;
    const pokemonImg = String(pokemon.pokemon_no).padStart(3, "0") + ".png";
    const pokemonAbilities = ""; //pokemon から取れるようにする
    const pokemonTypes = ""; //pokemon から取れるようにする
    const pokemonMoves = ""; //pokemon から取れるようにする
    const containerArticle = document.createElement("article");

    let toLeftDiv, toRightDiv;
    let excludeElements = [];

    for (let i in this.ARROW_TYPES) {
      excludeElements = excludeElements.concat([this.ARROW_TYPES[i].arrowId, this.ARROW_TYPES[i].captionId]);
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

    [toLeftDiv, toRightDiv] = this.createArrows();
    containerArticle.append(toLeftDiv);
    containerArticle.append(toRightDiv);

    return containerArticle;
  }

  createArrows() {
    const arrowTypeLeft = "1";
    const captionTextLeft = "ポケモンをみる";
    const toLeftDiv = this.createArrowDiv(arrowTypeLeft, captionTextLeft);
    toLeftDiv.id = "to-left";
    toLeftDiv.style.display = "none";

    const arrowTypeRight = "2";
    const captionTextRight = "技をみる";
    const toRightDiv = this.createArrowDiv(arrowTypeRight, captionTextRight);
    toRightDiv.id = "to-right";

    toRightDiv.addEventListener("click", (event)=>{
      if(event.currentTarget.id == "to-right") {
        event.currentTarget.style.display = "none";
        toLeftDiv.style.display = "block";
      }
    });
    toLeftDiv.addEventListener("click", (event)=>{
      if(event.currentTarget.id == "to-left") {
        event.currentTarget.style.display = "none";
        toRightDiv.style.display = "block";
      }
    });

    return [toLeftDiv, toRightDiv]
  }

  createArrowDiv(arrowType, captionText) {
    const arrowDiv = document.createElement("div");
    const arrowSpan = document.createElement("span");
    const captionSpan = document.createElement("span");

    arrowSpan.innerText = this.ARROW_TYPES[arrowType].text;
    arrowSpan.id = this.ARROW_TYPES[arrowType].arrowId;
    captionSpan.innerText = captionText;
    captionSpan.id = this.ARROW_TYPES[arrowType].captionId;
    arrowDiv.append(arrowSpan);
    arrowDiv.append(captionSpan);
    return arrowDiv;
  }

  get ARROW_TYPES() {
    return {
      "1": {
        "text": "<",
        "arrowId": "to-left-arrow",
        "captionId": "to-left-caption"
      },
      "2": {
        "text": ">",
        "arrowId": "to-right-arrow",
        "captionId": "to-right-caption"
      }
    };
  }
}