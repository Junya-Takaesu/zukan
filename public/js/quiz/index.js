import {Quiz} from "./quiz.js";
import {UI} from "./ui.js";
import {PokemonAPIClient} from "../pokemonAPIClient/client.js"

document.addEventListener("DOMContentLoaded", async ()=>{
  const apiClient = new PokemonAPIClient();
  const ui = new UI();
  ui.setup();

  if(!localStorage.getItem("quizJson")) {
    const quizJson = await apiClient.fetchQuiz();
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