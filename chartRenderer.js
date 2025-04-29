// chartRenderer.js
export function chartRenderer() {
  const chartContainer = document.getElementById("chart-container");

  if (chartContainer) {
    chartContainer.innerHTML = "<p>chartRenderer가 호출되었습니다.</p>";
  }
}
