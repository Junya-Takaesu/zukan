(() => {
  serverQuizJson = {
    "quiz_pokemons": [
        [
          {pokemon_no: 12, name: "バタフリー", isAnswer: true},
          {pokemon_no: 13, name: "ビードル", isAnswer: false},
          {pokemon_no: 14, name: "コクーン", isAnswer: false},
          {pokemon_no: 98, name: "クラブ", isAnswer: false}
        ],
        [
          {pokemon_no: 512, name: "ヤナッキー", isAnswer: false},
          {pokemon_no: 40, name: "プクリン", isAnswer: true},
          {pokemon_no: 1155, name: "パンプジン-3", isAnswer: false},
          {pokemon_no: 222, name: "サニーゴ", isAnswer: false},
        ],
        [
          {pokemon_no: 402, name: "コロトック", isAnswer: false},
          {pokemon_no: 16, name: "ポッポ", isAnswer: false},
          {pokemon_no: 542, name: "ハハコモリ", isAnswer: false},
          {pokemon_no: 486, name: "レジギガス", isAnswer: true},
        ],
    ],
    "quiz_status": [
      "yet", "yet", "yet"
    ]
  }

  const quizSection = document.querySelector(".quiz");
  const resultModal = document.createElement("form");
  let answerPokemonObj = {};
  let optionsArray = [];
  let quizJson = {};

  const storageAvailable = (type) => {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
  }

  const populateStorage = () => {
    // サーバーから json を取得して、ローカルストレージに保存する

    localStorage.setItem("quizJson", JSON.stringify(serverQuizJson));
  }

  const setImage = (src) => {
    const img = document.createElement("img");
    img.classList.add("image");
    img.src = src;

    return img;
  }

  const setOptions = (options) => {
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");
    options.forEach((value) => {
      const optionAnchor = document.createElement("a");
      optionAnchor.classList.add("option");
      optionAnchor.setAttribute("rel","modal:open");
      optionAnchor.href = "#result-modal";
      optionAnchor.innerText = value;

      optionAnchor.addEventListener("click", (event) => {
        event.preventDefault;
        const userInput = event.target.innerText
        updateModal((userInput == answerPokemonObj.name), userInput);
      })

      optionsDiv.append(optionAnchor);
    });

    return optionsDiv;
  }

  const setResultModal = () =>{
    resultModal.id = "result-modal";
    resultModal.classList.add("modal");
    return resultModal;
  }

  const updateModal = (result, userInput) => {

    let resultDiv = document.querySelector('.result');
    if(resultDiv) {
      resultDiv.remove();
    }

    resultDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    const detailDiv = document.createElement("div");
    resultDiv.classList.add("result");

    if (result) {
      messageDiv.innerText = "せいかい！"
    } else {
      messageDiv.innerText = "ざんねん..."
    }
    detailDiv.innerHTML = `
      こたえは 「<strong>${answerPokemonObj.name}</strong>」<br>
      あなたがえらんだのは「${userInput}」でした
    `;
    resultDiv.append(messageDiv);
    resultDiv.append(detailDiv);
    resultModal.append(resultDiv);
  }

  const generateQuizUI = (domArray) => {
    domArray.forEach((dom) => {
      quizSection.append(dom);
    });
  }

  const getCurrentQuiz = () => {
    const currentQuizIndex = quizJson.quiz_status.findIndex((status, index) => status == "yet");
    const currentQuizObj = quizJson.quiz_pokemons[currentQuizIndex];
    let answerPokemonObj = currentQuizObj.find(pokemon => pokemon.isAnswer);
    const optionsArray = [];
    currentQuizObj.forEach((obj) => {
      optionsArray.push(obj.name);
    })
    return [answerPokemonObj, optionsArray]
  }

  if (storageAvailable) {
    if (!localStorage.getItem("quizJson")) {
      populateStorage();
    }

    quizJson = JSON.parse(localStorage.getItem("quizJson"));
    [answerPokemonObj, optionsArray] = getCurrentQuiz();

    const imageSrc = `images/${String(answerPokemonObj.pokemon_no).padStart(3, "0")}.png`;

    generateQuizUI([
      setImage(imageSrc),
      setOptions(optionsArray),
      setResultModal()
    ]);
  } else {
    alert("ローカルストレージを有効にしてください。(※一部のブラウザではローカルストレージ使用不可");
  }
})()