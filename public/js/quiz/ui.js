import {utter} from "../common/utter.js";

export class UI {
  constructor(quiz) {
    this.quizSection = document.querySelector('.quiz');
    this.breadCrumbsDiv = document.querySelector('.bread-crumbs');
    this.quiz = quiz;
  }

  setup() {
    const loadingImgSrc = "icons/loading.svg"
    const classNames = ["image"]
    const dataSets = {};
    const width = "192";
    const height = "192";
    const alt = "ロード画像";
    const initialOptions = ["ロード中...", "ロード中...", "ロード中...", "ロード中..."];
    const anchorDisabled = true;

    this.renderQuizImage(loadingImgSrc, classNames, dataSets, width, height, alt);
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
    const width = "";
    const height = "";
    const alt = `${this.quiz.answerPokemonObj.name}の画像`;
    this.renderBreadCrumbs(currentTurn);
    this.renderQuizImage(quizImageSrc, classNames, dataSets, width, height, alt);
    this.renderOptions(quizOptions);
  }

  renderSummary() {
    this.renderBreadCrumbs();

    const correctAnswerCount = this.quiz.countCorrectAnswers();
    const breadCrumbs = document.querySelector(".bread-crumbs");
    const messageParagrah = document.createElement("p");
    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("summary");

    let icon;
    let messageText;
    let cssClass;

    if (correctAnswerCount < 3) {
      icon = "😥";
      messageText = "ポケモンゲットならず・・・";
      cssClass = "result-lost";
    } else {
      icon = "😎"
      messageText = `${correctAnswerCount} 匹のポケモンをゲット！`;
      cssClass = "result-won";
    }

    summaryDiv.innerHTML = `
      <h1>おしまい</h1>
      <p>けっか</p>
      <p id="result-symbol">${this.quiz.generateBreadCrumbs()}</p>
      <p id="${cssClass}"> ${correctAnswerCount} / ${this.quiz.results.length} </p>
    `

    messageParagrah.innerText = icon + messageText;
    summaryDiv.append(messageParagrah);

    breadCrumbs.remove();

    this.quizSection.append(summaryDiv);
  }

  renderBreadCrumbs(index) {
    let message = ""
    if (typeof index !== 'undefined') {
      message = `だい　${index+1}　もん`
    }
    this.breadCrumbsDiv.innerHTML = this.quiz.generateBreadCrumbs();
  }

  renderQuizImage(src, classNames = [], dataSets = {}, width = "", height = "", alt = "") {
    const imageContainer = document.createElement("div");
    const quizImage = document.createElement("img");

    imageContainer.classList.add("image-container");

    classNames.forEach(className => {
      quizImage.classList.add(className);
    })

    quizImage.src = src;
    quizImage.setAttribute("width", width);
    quizImage.setAttribute("height", height);
    quizImage.setAttribute("alt", alt);

    for (let key in dataSets) {
      quizImage.setAttribute(key, dataSets[key]);
    }

    imageContainer.append(quizImage);
    imageContainer.append(this.createAudioIndicator());
    this.quizSection.append(imageContainer);

    imageContainer.addEventListener("click", (event) => {
      const speakerOnImg = "icons/audio.svg";
      const speakerOffImg = "icons/no-audio.svg";
      const containerElement = event.currentTarget;
      const audioIndicator = containerElement.querySelector(".audio-indicator");
      const utterable = containerElement.querySelector(".utterable");
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
  }

  createAudioIndicator() {
    const speakerOffImg = "icons/no-audio.svg";
    const audioIndicator = document.createElement("img");

    audioIndicator.classList.add("audio-indicator");
    audioIndicator.setAttribute("src", speakerOffImg);
    audioIndicator.setAttribute("alt", "音声表示");
    return audioIndicator;
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
    const innerDiv = document.createElement("div");

    innerDiv.innerText = text;
    optionAnchor.classList.add("option");
    optionAnchor.append(innerDiv);

    optionAnchor.addEventListener("click", (event)=>{
      event.preventDefault;
      this.quiz.evaluate(event.target.innerText);
      $(this.createResultDiv(event.target.innerText)).modal();
      $(".modal").on($.modal.BEFORE_CLOSE, function () {$(".modal").remove();});

      const quizJson = JSON.stringify(this.quiz.json);
      localStorage.setItem("quizJson", quizJson);

      const ui = new UI(this.quiz);
      ui.displayQuiz();
    });

    return optionAnchor;
  }

  createResultDiv(userPick){
    const parentDiv = document.createElement("div");
    const resultDiv = document.createElement("div");
    const messageHeader = document.createElement("h2");
    const detailParagraph = document.createElement("p");

    messageHeader.classList.add("result-header");

    if(this.quiz.getLastResult()) {
      messageHeader.innerHTML = "&#9711; せいかい！";
      messageHeader.classList.add("result-won");
    } else {
      messageHeader.innerHTML = "&#215; ざんねん...";
      messageHeader.classList.add("result-lost");
    }

    detailParagraph.innerHTML = `
      こたえは「<strong>${this.quiz.getAnswerPokemonObj().name}</strong>」です。<br>
      あなたは「<strong>${userPick}</strong>」をえらびました。
    `

    resultDiv.classList.add("result")
    resultDiv.append(messageHeader);
    resultDiv.append(detailParagraph);
    parentDiv.append(resultDiv);
    return parentDiv
  }
}
