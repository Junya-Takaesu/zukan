const createGoToTopAnchor = () => {

  const goToTopAnchor = document.createElement("a");
  const buttonGraphic = document.createElement("div");
  buttonGraphic.classList.add("monster-ball-button");

  goToTopAnchor.append(buttonGraphic);

  goToTopAnchor.id = "go-to-top";
  goToTopAnchor.href = "#";

  document.addEventListener("scroll", () => {
    if(100 < window.scrollY) {

    }
  })

  return goToTopAnchor;
}

export {createGoToTopAnchor}