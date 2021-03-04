(() => {
  // window.addEventListener("load", () => {
    const utterables = document.querySelectorAll('.utterable');
    const utterance = new SpeechSynthesisUtterance();

    utterables.forEach(utterable => {
      utterable.addEventListener("click", (event) => {
        utterance.text = event.target.dataset.utterableText;
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = 'ja-JP';
        window.speechSynthesis.speak(utterance);
      });
    });
  // });
})()