export function createTextElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;

  return element;
}
