export class Quiz {
  constructor(quizJson) {
    this.json = quizJson

    const {pokemons, quiz_results} = this.json;

    this.pokemons = pokemons;
    this.results = quiz_results;
    this.currentSet = this.pokemons[this.currentIndex()];
    this.answerPokemonObj = this.currentSet.find(pokemon => pokemon.isAnswer)
    this.myPokemons = [];
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

  generateBreadCrumbs() {
    const spaceBetween = " ";
    const resultSymbs = this.results.map((result => {
      switch (result) {
        case false:
          return '<span class="result-lost">X<span>';
        case true:
          return '<span class="result-won">&#9711;<span>';
        default:
          return "<span>-</span>";
      }
    }));

    return resultSymbs.join(spaceBetween);
  }

  isPerfect() {
    return this.countCorrectAnswers() === this.results.length
  }
}