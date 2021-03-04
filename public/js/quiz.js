(() => {
class Quiz {
  constructor(quizJson) {
    this.json = quizJson

    const {pokemons, quiz_results} = this.json;

    this.pokemons = pokemons;
    this.results = quiz_results;
    this.currentSet = this.pokemons[this.currentIndex()];
    this.answerPokemonObj = this.currentSet.find(pokemon => pokemon.isAnswer)
    this.myPokemons = [];
  }

  static async fetchJson() {
    try {
      let response = await fetch("https://thawing-mountain-93514.herokuapp.com/api/v1/quiz_json");
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
    const index = this.results.findIndex(result => result === null);
    const noIndex = -1;
    return (index === noIndex ? this.results.length : index);
  }

  getNames(){
    return this.currentSet.map(pokemon => pokemon.name);
  }

  evaluate(userPick){
    this.results[this.currentIndex()] = (userPick === this.getAnswerPokemonObj().name);
    this.myPokemons.push(this.getAnswerPokemonObj().pokemon_no);
  }

  getLastResult(){
    return this.results[this.currentIndex()-1]
  }

  countCorrectAnswers() {
    let count = 0;
    this.results.forEach(result => {
      count += result? 1 : 0;
    });
    return count;
  }

  isPerfect() {
    return this.countCorrectAnswers() === this.results.length
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

    const currentTurn = this.quiz.currentIndex();
    if (currentTurn === this.quiz.results.length) {
      this.renderSummary();
      localStorage.removeItem("quizJson");
      if(this.quiz.isPerfect()) {
        let myPokemons = JSON.parse(localStorage.getItem("myPokemons"));
        if (myPokemons) {
          this.quiz.myPokemons = this.quiz.myPokemons.concat(myPokemons);
        }
        localStorage.setItem("myPokemons", JSON.stringify(this.quiz.myPokemons));
      }
      return;
    }

    const quizImageSrc = this.quiz.nextSet().getQuizImageURL();
    const quizOptions = this.quiz.nextSet().getNames();
    const classNames = ["image"];
    this.renderBreadCrumbs(currentTurn);
    this.renderQuizImage(quizImageSrc, classNames);
    this.renderOptions(quizOptions);
  }

  renderSummary() {
    this.renderBreadCrumbs();

    const correctAnswerCount = this.quiz.countCorrectAnswers();
    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("summary");

    let icon;
    let messageText;
    let cssId;

    if (correctAnswerCount < 3) {
      icon = "😥";
      messageText = "ポケモンゲットならず・・・";
      cssId = "result-lost";
    } else {
      icon = "😎"
      messageText = `${correctAnswerCount} 匹のポケモンをゲット！`;
      cssId = "result-won";
    }

    summaryDiv.innerHTML = `
      <h1>おしまい</h1>
      <p>けっか</p>
      <p id="${cssId}"> ${correctAnswerCount} / ${this.quiz.results.length} </p>
    `

    const messageParagrah = document.createElement("p");
    messageParagrah.innerText = icon + messageText;

    summaryDiv.append(messageParagrah);

    this.quizSection.append(summaryDiv);
  }

  renderBreadCrumbs(index) {
    if (!index) {
      index = 0;
    }
    const message = `だい　${index+1}　もん`;
    this.breadCrumbsDiv.innerText = message;
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
    const messageHeader = document.createElement("h2");
    const detailParagraph = document.createElement("p");

    if(this.quiz.getLastResult()) {
      messageHeader.innerText = "せいかい！";
      messageHeader.id = "result-won";
    } else {
      messageHeader.innerText = "ざんねん...";
      messageHeader.id = "result-lost";
    }

    detailParagraph.innerHTML = `
      こたえは「<strong>${this.quiz.getAnswerPokemonObj().name}</strong>」です。<br>
      あなたは「<strong>${userPick}</strong>」をえらびました。
    `
    resultDiv.append(messageHeader);
    resultDiv.append(detailParagraph);
    return resultDiv
  }
}

document.addEventListener("DOMContentLoaded", async ()=>{

  const ui = new UI();
  ui.setup();

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