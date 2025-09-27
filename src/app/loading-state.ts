const canvasContainer = document.querySelector(".webgl-container") as HTMLElement;
const loadingIndicator = document.querySelector(".loading-indicator") as HTMLElement;
const sectionsContainer = document.querySelector(".section-scroll-controllers") as HTMLElement;

export function enterLoadingState() {
  loadingIndicator.style.visibility = "visible";
  canvasContainer.style.visibility = "hidden";
  sectionsContainer.style.display = "none";
}

export function exitLoadingState() {
  loadingIndicator.style.visibility = "hidden";
  canvasContainer.style.visibility = "visible";
  sectionsContainer.style.display = "initial";
}
