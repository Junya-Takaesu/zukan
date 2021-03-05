const utter = (text) => {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = "ja-JP";
  window.speechSynthesis.speak(utterance);
}

export {utter}