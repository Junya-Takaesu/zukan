export class PokemonAPIClient {

  get API_URL() {
    return location.hostname == "localhost" ? "http://localhost:4567/api/v1/" : "https://thawing-mountain-93514.herokuapp.com/api/v1/";
  }

  async fetchQuiz() {
    return this.fetchJson(`${this.API_URL}quiz_json`);
  }

  async fetchPokemons(params = {}) {
    let queryParameters = []
    if(params.nos) {
      queryParameters.push(`nos=${params.nos}`);
    }
    if(params.types) {
      queryParameters.push(`types=${params.types}`);
    }
    if(params.limit) {
      queryParameters.push(`limit=${params.limit}`);
    }
    if(params.sort_column) {
      queryParameters.push(`sort_column=${params.sort_column}`);
    }
    if(params.order) {
      queryParameters.push(`order=${params.order}`);
    }
    return this.fetchJson(`${this.API_URL}pokemons?${queryParameters.join("&")}`);
  }

  async fetchTypes() {
    return this.fetchJson(`${this.API_URL}types`);
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