// tableRenderer.js
export function tableRenderer() {
  const tableContainer = document.getElementById("table-container");

  if (tableContainer) {
    tableContainer.innerHTML = "<p>tableRenderer가 호출되었습니다.</p>";
  }
}
