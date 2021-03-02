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

  static async fetchJson() {
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
    return `${imgDir}/${String(this.getAnswerPokemonObj().pokemon_no).padStart(3, "0")}.png`;
  }

  nextSet() {
    this.currentSet = this.pokemons[this.currentIndex()];
    return this;
  }

  getAnswerPokemonObj() {
    this.answerPokemonObj = this.currentSet.find(pokemon => pokemon.isAnswer)
    return this.answerPokemonObj
  }

  currentIndex(){
    return this.results.findIndex(result => result === null);
  }

  getNames(){
    return this.currentSet.map(pokemon => pokemon.name);
  }

  evaluate(userPick){
    this.results[this.currentIndex()] = (userPick === this.getAnswerPokemonObj().name);
  }

  getLastResult(){
    return this.results[this.currentIndex()]
  }
}

class UI {
  constructor(quiz) {
    this.quizSection = document.querySelector('.quiz');
    this.breadCrumbsDiv = document.querySelector('.bread-crumbs');
    this.quiz = quiz;
  }

  setup() {
    const loadingImgSrc = "icons/loading.svg"
    const classNames = ["image"]
    const initialOptions = ["loading...", "loading...", "loading...", "loading..."];
    const anchorDisabled = true;
    this.renderQuizImage(loadingImgSrc, classNames);
    this.renderOptions(initialOptions, anchorDisabled)
  }

  displayQuiz() {
    this.quizSection.innerHTML = "";
    const quizImageSrc = this.quiz.nextSet().getQuizImageURL();
    const quizOptions = this.quiz.nextSet().getNames();
    const classNames = ["image"];
    this.renderQuizImage(quizImageSrc, classNames);
    this.renderOptions(quizOptions);
  }



  
  }

  renderQuizImage(src, classNames = [], width = "", height = "") {
    const quizImage = document.createElement("img");
    classNames.forEach(className => {
      quizImage.classList.add(className);
    })
    quizImage.src = src;
    quizImage.setAttribute("width", width);
    quizImage.setAttribute("height", height);

    this.quizSection.append(quizImage)
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

    this.quizSection.append(optionsDiv);
  }

  createOptionAnchor(text) {
    const optionAnchor = document.createElement("a");
    optionAnchor.classList.add("option");
    optionAnchor.innerText = text;

    optionAnchor.addEventListener("click", (event)=>{
      event.preventDefault;
      this.quiz.evaluate(event.target.innerText);
      $(this.createResultDiv(event.target.innerText)).modal();

      const quizJson = JSON.stringify(this.quiz.json);
      localStorage.setItem("quizJson", quizJson);

      const ui = new UI(this.quiz);
      ui.displayQuiz();
    });

    return optionAnchor;
  }

  createResultDiv(userPick){
    const resultDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    const detailDiv = document.createElement("div");

    messageDiv.innerText = this.quiz.getLastResult() ? "せいかい！" : "ざんねん...";
    detailDiv.innerHTML = `
      こたえは「<strong>${this.quiz.getAnswerPokemonObj().name}</strong>」です。<br>
      あなたは「<strong>${userPick}</strong>」をえらびました。
    `
    resultDiv.append(messageDiv);
    resultDiv.append(detailDiv);
    return resultDiv
  }
}

document.addEventListener("DOMContentLoaded", async ()=>{
  if(!localStorage.getItem("quizJson")) {
    const quizJson = await Quiz.fetchJson();
    const quiz = new Quiz(quizJson);
    const ui = new UI(quiz);
    ui.displayQuiz();
  } else {
    const quizJson = JSON.parse(localStorage.getItem("quizJson"));
    const quiz = new Quiz(quizJson);
    const ui = new UI(quiz);
    ui.displayQuiz();
  }
});

})()