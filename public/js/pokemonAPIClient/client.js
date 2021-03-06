export class PokemonAPIClient {

  get API_URL() {
    return "https://thawing-mountain-93514.herokuapp.com/api/v1/";
  }

  async fetchQuiz() {
    return this.fetchJson(`${this.API_URL}quiz_json`);
  }

  async fetchJson(url) {
    try {
      let response = await fetch(url);
      let json = await response.json();
      return json;
    } catch(error) {
      console.log(error);
    }
  }
}