import {utter} from "../common/utter.js";

const pokemonCards = document.querySelectorAll(".card");

pokemonCards.forEach(card => {
  const utterable = card.querySelector(".utterable");

  card.addEventListener("click", (event)=>{
    const speakerOnImg = "icons/audio.svg";
    const speakerOffImg = "icons/no-audio.svg";
    const containerElement = event.currentTarget;
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
});