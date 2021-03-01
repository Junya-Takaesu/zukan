(() => {
class Quiz {
  constructor() {
    this.pokemons = []
    this.results = []
    this.currentSet = []
  }
  async fetch() {
    try {
      let response = await fetch("http://localhost:4567/api/v1/quiz_json");
      let quizJson = await response.json();
      const {pokemons, quiz_results} = quizJson;

      this.pokemons = pokemons
      this.results = quiz_results
    } catch(error) {
      console.log(error);
    }
  }
  filterOptions(n = this.currentIndex()) {
    this.currentSet = this.pokemons[n];
    return this;
  }
  getQuizImageURL() {
    const imgDir = "images";
    let answerPokemonObj = this.currentSet.find(pokemon => pokemon.isAnswer);
    return `${imgDir}/${String(answerPokemonObj.pokemon_no).padStart(3, "0")}.png`;
  }
  currentIndex(){
    return this.results.findIndex(result => result === null);
  }
  names(){
    return this.currentSet.map(pokemon => pokemon.name);
  }
}

class UI {
  constructor() {
    this.quizSection = document.querySelector('.quiz');
    this.breadCrumbsDiv = document.querySelector('.bread-crumbs');
    this.updatableDOMs = [];
  }

  setup() {
    const loadingImgSrc = "icons/loading.svg"
    const classNames = ["image"]
    const initialOptions = ["loading...", "loading...", "loading...", "loading..."];
    const anchorDisabled = true;
    this.renderQuizImage(loadingImgSrc, classNames);
    this.renderOptions(initialOptions, anchorDisabled)
    this.renderResultModal();
    this.update();
  }

  displayQuiz(quiz) {
    this.quizSection.innerHTML = "";
    const filteredOptions = quiz.filterOptions();
    const quizImageSrc = filteredOptions.getQuizImageURL();
    const classNames = ["image"];
    const quizOptions = filteredOptions.names();
    this.renderQuizImage(quizImageSrc, classNames);
    this.renderOptions(quizOptions);
    this.renderResultModal();
    this.update();
  }

  update() {
    this.updatableDOMs.forEach(dom => {
      this.quizSection.append(dom);
    })
    this.updatableDOMs = [];
  }

  renderBreadCrumbs() {

  }

  renderQuizImage(src, classNames = [], width = "", height = "") {
    const quizImage = document.createElement("img");
    classNames.forEach(className => {
      quizImage.classList.add(className);
    })
    quizImage.src = src;
    quizImage.setAttribute("width", width);
    quizImage.setAttribute("height", width);

    this.updatableDOMs.push(quizImage);
  }

  renderOptions(options, disabled = false) {
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    options.forEach((option) => {
      const optionAnchor = this.createOptionAnchor(option);
      if(disabled) {
        optionAnchor.style.pointerEvents="none";
        optionAnchor.style.cursor="default";
      }
      optionsDiv.append(optionAnchor);
    });

    this.updatableDOMs.push(optionsDiv);
  }

  createOptionAnchor(text) {
    const optionAnchor = document.createElement("a");
    optionAnchor.classList.add("option");
    optionAnchor.setAttribute("rel","modal:open");
    optionAnchor.href = "#result-modal";
    optionAnchor.innerText = text;

    return optionAnchor;
  }

  renderResultModal() {
    const resultModal = document.createElement("form");
    resultModal.id = "result-modal";

    this.updatableDOMs.push(resultModal);
  }
}

class Storage {

}

document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  const quiz = new Quiz();

  ui.setup()

  quiz.fetch()
    .then(() => {
      ui.displayQuiz(quiz);
    })
});

})()