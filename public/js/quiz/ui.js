export class UI {
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
    const classNames = ["image", "utterable"];
    const dataSets = {"data-utterable-text": this.quiz.answerPokemonObj.name};
    this.renderBreadCrumbs(currentTurn);
    this.renderQuizImage(quizImageSrc, classNames, dataSets);
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

  renderQuizImage(src, classNames = [], dataSet = {}, width = "", height = "") {
    const quizImage = document.createElement("img");
    classNames.forEach(className => {
      quizImage.classList.add(className);
    })
    quizImage.src = src;
    quizImage.setAttribute("width", width);
    quizImage.setAttribute("height", height);

    for (let key in dataSet) {
      quizImage.setAttribute(key, dataSet[key]);
    }

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
