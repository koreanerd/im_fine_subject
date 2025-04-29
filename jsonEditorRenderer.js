// jsonEditorRenderer.js
export function jsonEditorRenderer() {
  const jsonEditorContainer = document.getElementById("json-editor");

  if (jsonEditorContainer) {
    jsonEditorContainer.innerHTML =
      "<p>jsonEditorRenderer가 호출되었습니다.</p>";
  }
}
