const createGoToTopAnchor = () => {
  const containerDiv = document.createElement("div");
  const goToTopAnchor = document.createElement("a");
  const switchDrawing = document.createElement("div");
  const buttonLabel = document.createElement("p");

  containerDiv.id = "go-to-top-container"
  goToTopAnchor.id = "go-to-top";
  goToTopAnchor.href = "#";
  switchDrawing.classList.add("monster-ball-button");
  buttonLabel.id = "go-to-top-label";
  buttonLabel.innerHTML = "トップに<br>もどる"

  document.addEventListener("scroll", () => {
    if(100 < window.scrollY) {

    }
  })

  goToTopAnchor.append(switchDrawing);
  containerDiv.append(buttonLabel);
  containerDiv.append(goToTopAnchor);
  return containerDiv;
}

export {createGoToTopAnchor}