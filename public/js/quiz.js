(() => {
class Quiz {
  constructor(quizJson) {
    this.json = quizJson

    const {pokemons, quiz_results} = this.json;

    this.pokemons = pokemons;
    this.results = quiz_results;
    this.currentSet = this.pokemons[this.currentIndex()];
    this.answerPokemonObj = this.currentSet.find(pokemon => pokemon.isAnswer)
  }

  static async fetch() {
    try {
      let response = await fetch("http://localhost:4567/api/v1/quiz_json");
      let json = await response.json();
      return json;
    } catch(error) {
      console.log(error);
    }
  }

  getQuizImageURL() {
    const imgDir = "images";
    return `${imgDir}/${String(this.answerPokemonObj.pokemon_no).padStart(3, "0")}.png`;
  }

  currentIndex(){
    return this.results.findIndex(result => result === null);
  }

  getNames(){
    return this.currentSet.map(pokemon => pokemon.name);
  }

  evaluate(userPick){
    this.results[this.currentIndex()] = (userPick === this.answerPokemonObj.name);
  }

  getLastResult(){
    return this.results[this.currentIndex()]
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
    const quizImageSrc = quiz.getQuizImageURL();
    const quizOptions = quiz.getNames();
    const classNames = ["image"];
    this.renderQuizImage(quizImageSrc, classNames);
    this.renderOptions(quizOptions);
    this.renderResultModal();
    this.update();

    this.initializeEventListeners(quiz);
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

  updateModalContent(quiz, userPick) {
    const resultModal = document.querySelector("#result-modal");
    const resultContainer = document.createElement("div");
    const messageDiv = document.createElement("div");
    const detailDiv = document.createElement("div");

    resultModal.innerText = "";
    messageDiv.innerText = quiz.getLastResult() ? "せいかい！" : "ざんねん...";
    detailDiv.innerHTML = `
      こたえは「<strong>${quiz.answerPokemonObj.name}</strong>」です。<br>
      あなたは「<strong>${userPick}</strong>」をえらびました。
    `
    resultContainer.append(messageDiv);
    resultContainer.append(detailDiv);
    resultContainer.classList.add("result-container")
    resultModal.append(resultContainer);
  }

  initializeEventListeners(quiz) {
    const optionAnchors = document.querySelectorAll(".option");
    optionAnchors.forEach(anchor => {
      anchor.addEventListener("click", (event)=>{
        event.preventDefault;
        quiz.evaluate(event.target.innerText);
        this.updateModalContent(quiz, event.target.innerText);

        const quizJson = JSON.stringify(quiz.json);
        localStorage.setItem("quizJson", quizJson);

        const ui = new UI();
        ui.displayQuiz(new Quiz(quiz.json));
      });
    });
  }
}

class Storage {

}

document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  ui.setup()

  if(!localStorage.getItem("quizJson")) {
    Quiz.fetch()
      .then((quizJson) => {
        const quiz = new Quiz(quizJson);
        ui.displayQuiz(quiz);
      })
  } else {
    const quiz = new Quiz(JSON.parse(localStorage.getItem("quizJson")));
    ui.displayQuiz(quiz);
  }
});

})()