import {utter} from "../common/utter.js";
import {PokemonAPIClient} from "../pokemonAPIClient/client.js";
import {createGoToTopAnchor} from "../common/goToTopButton.js";

export class UI {

  renderTypeTags(types) {
    const apiClient = new PokemonAPIClient();

    const typeTagsAside = document.querySelector("#type-tags");
    types.forEach(type => {
      const typeAnchor = document.createElement("a");
      typeAnchor.classList.add("type-tag");
      typeAnchor.innerText = type;

      typeAnchor.addEventListener("click", event => {
        const params = {};
        let selectedTags;

        document.querySelector(".cards").innerHTML = "";

        event.target.classList.toggle("selected");
        selectedTags = [...document.querySelectorAll(".selected")].map(tag => {return tag.innerText});
        params.types = selectedTags.join("-");

        apiClient.fetchPokemons(params)
          .then(pokemons => {
            this.renderPokemonCountHeader(pokemons.length);
            this.renderCards(pokemons);
          });
      });

      typeTagsAside.append(typeAnchor);
    });
  }

  renderCards(pokemonsJson) {
    const cardsMain = document.querySelector(".cards");

    pokemonsJson.forEach(pokemon => {
      cardsMain.append(this.createCardArticle(pokemon));
    });
  }

  renderGoToTopAnchor() {
    document.querySelector("body").append(createGoToTopAnchor());
  }

  renderPokemonCountHeader(length) {
    let pokemonCountHeader = document.querySelector("#pokemon-count");

    if (pokemonCountHeader) {
      pokemonCountHeader.remove();
    }

    pokemonCountHeader = document.createElement("h2");
    const typeTags = document.querySelector("#type-tags");

    pokemonCountHeader.id = "pokemon-count";
    pokemonCountHeader.innerHTML = `<span id="count-number">${length}</span> 匹 のポケモンを表示中`

    document.querySelector("body").insertBefore(pokemonCountHeader, typeTags.nextSibling);
  }

  createCardArticle(pokemon) {
    const cardArticle = document.createElement("article");

    cardArticle.classList.add("card");
    cardArticle.append(this.createAudioIndicatorImg());
    cardArticle.append(this.createPokemonImg(pokemon.pokemon));
    cardArticle.append(this.createContentSection(pokemon));

    cardArticle.addEventListener("click", (event)=>{
      const speakerOnImg = "icons/audio.svg";
      const speakerOffImg = "icons/no-audio.svg";
      const containerElement = event.currentTarget;
      const utterable = containerElement.querySelector(".utterable");
      const audioIndicator = containerElement.querySelector(".audio-indicator");

      const onendCallback = () => {
        const indicatorImgSrc = audioIndicator.getAttribute("src")
        const src = indicatorImgSrc == speakerOnImg ? speakerOffImg : speakerOnImg;

        audioIndicator.style.transform = "rotate(0deg)";
        audioIndicator.setAttribute("src", src);
      }

      audioIndicator.style.transform = "rotate(-7deg)";
      audioIndicator.setAttribute("src", speakerOnImg);
      utter(utterable.dataset.utterableText, onendCallback);
    });

    return cardArticle;
  }

  createContentSection(pokemon) {
    const contentSection = document.createElement("section");
    const pokemonNameHeader2 = document.createElement("h2");
    const FieldSets = [
      {"fieldName": "のうりょく", "fieldValue": pokemon.abilities},
      {"fieldName": "タイプ", "fieldValue": pokemon.types}
    ];

    contentSection.classList.add("content");
    pokemonNameHeader2.classList.add("name", "utterable");
    pokemonNameHeader2.dataset.utterableText = pokemon.pokemon.name;
    pokemonNameHeader2.innerText = pokemon.pokemon.name;

    contentSection.append(pokemonNameHeader2);
    contentSection.append(this.createAttributeFields(FieldSets));

    return contentSection;
  }

  createAudioIndicatorImg() {
    const audioImgClassName = "audio-indicator";
    const audioImgSrc = "icons/no-audio.svg";
    const audioImgAlt = "音声表示";
    const audioImgDefaultSize = "24"
    return this.createImg(audioImgSrc, audioImgClassName, audioImgAlt, audioImgDefaultSize, audioImgDefaultSize);
  }

  createPokemonImg(pokemon) {
    const pokemonImgClassName = "image";
    const pokemonImgSrc = `images/${String(pokemon.pokemon_no).padStart(3, "0")}.png`;
    const pokemonImgAlt = `${pokemon.name}の画像`;
    const pokemonImgDefaultSize = "150";
    return this.createImg(pokemonImgSrc, pokemonImgClassName, pokemonImgAlt, pokemonImgDefaultSize, pokemonImgDefaultSize);
  }

  createImg(src, className, alt, width, height) {
    const img = document.createElement("img");
    img.classList.add(className);
    img.setAttribute("loading", "lazy");
    img.src = src;
    img.setAttribute("alt", alt);
    img.setAttribute("width", width);
    img.setAttribute("height", height);
    return img;
  }

  createAttributeFields(fieldSets) {
    const attributesDiv = document.createElement("div");
    const hr = document.createElement("hr");

    attributesDiv.classList.add("attributes");

    fieldSets.forEach(fieldSet => {
      attributesDiv.append(hr.cloneNode());
      this.createAttributeField(fieldSet.fieldValue, fieldSet.fieldName).forEach(attributeField => {
        attributesDiv.append(attributeField);
      });
    });

    return attributesDiv;
  }

  createAttributeField(attributes, label) {
    const attributeHeaderSpan = document.createElement("span");
    const attributeValueSpan = document.createElement("span");
    attributeHeaderSpan.classList.add("attribute-header");
    attributeValueSpan.classList.add("attribute-value");
    attributeHeaderSpan.innerText = `${label}：`;

    attributes.forEach(attribute => {
      attributeValueSpan.innerHTML += `${attribute}<br>`;
    });

    return [attributeHeaderSpan, attributeValueSpan];
  }
}