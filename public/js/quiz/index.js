import {Quiz} from "./quiz.js";
import {UI} from "./ui.js";
import {utter} from "../common/utter.js";

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