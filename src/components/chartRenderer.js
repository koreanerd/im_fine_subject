import { getState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";

export function chartRenderer() {
  const container = document.getElementById("chart-container");

  if (!container) return;

  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "Chart"));

  const state = getState();

  if (state.length === 0) {
    container.appendChild(createTextElement("p", "데이터가 없습니다."));

    return;
  }

  // 그래프 전체 영역: Y축 눈금 + 막대 그래프
  const chartArea = document.createElement("div");
  chartArea.className = "chart-area";

  // Y축 눈금: 100 → 0까지 20 단위로 표시
  const axisContainer = document.createElement("div");
  axisContainer.className = "chart-axis";

  for (let i = 100; i >= 0; i -= 20) {
    const tick = document.createElement("div");
    tick.textContent = i;
    tick.style.top = "-15px"; // 눈금 위치 미세 조정
    axisContainer.appendChild(tick);
  }

  // 막대 그래프 그리는 영역
  const chartWrapper = document.createElement("div");
  chartWrapper.className = "chart-wrapper";

  // 막대 위에 띄울 툴팁 정의 (초기 비활성 상태)
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";

  chartWrapper.appendChild(tooltip);

  // 각 항목에 대한 막대 생성
  state.forEach(({ label, value }) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / 100) * 200}px`;

    bar.addEventListener("mouseenter", () => {
      tooltip.textContent = `${label}: ${value}`; // ✅ 툴팁에 label + value
      tooltip.style.display = "block";
    });

    bar.addEventListener("mousemove", (e) => {
      tooltip.style.left = `${e.pageX - container.offsetLeft - 40}px`;
      tooltip.style.top = `${e.pageY - container.offsetTop - 50}px`;
    });

    bar.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    barWrapper.appendChild(bar);
    chartWrapper.appendChild(barWrapper);
  });

  // 최종 구성 연결
  chartArea.appendChild(axisContainer);
  chartArea.appendChild(chartWrapper);
  container.appendChild(chartArea);
}
