const createGoToTopAnchor = () => {
  const goToTopAnchor = document.createElement("a");
  const switchDrawing = document.createElement("div");
  const buttonLabel = document.createElement("p");

  goToTopAnchor.id = "go-to-top-container"
  goToTopAnchor.href = "#";
  switchDrawing.classList.add("monster-ball-button");
  buttonLabel.id = "go-to-top-label";
  buttonLabel.innerHTML = "トップに<br>もどる"

  document.addEventListener("scroll", () => {
    if(100 < window.scrollY) {

    }
  })

  goToTopAnchor.append(switchDrawing);
  goToTopAnchor.append(buttonLabel);
  return goToTopAnchor;
}

export {createGoToTopAnchor}