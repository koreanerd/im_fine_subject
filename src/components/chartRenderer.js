import { getState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";

export function chartRenderer() {
  const container = document.getElementById("chart-container");

  if (!container) return;

  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "그래프"));

  const state = getState();

  if (state.length === 0) {
    container.appendChild(createTextElement("p", "데이터가 없습니다."));

    return;
  }

  // 그래프 전체 영역: Y축 눈금 + 막대 그래프
  const chartArea = document.createElement("div");
  chartArea.style.display = "flex";
  chartArea.style.alignItems = "flex-end";
  chartArea.style.gap = "12px";

  // Y축 눈금: 100 → 0까지 20 단위로 표시
  const axisContainer = document.createElement("div");
  axisContainer.style.display = "flex";
  axisContainer.style.flexDirection = "column";
  axisContainer.style.justifyContent = "space-between";
  axisContainer.style.height = "200px";
  axisContainer.style.paddingRight = "8px";
  axisContainer.style.fontSize = "12px";
  axisContainer.style.color = "#666";

  for (let i = 100; i >= 0; i -= 20) {
    const tick = document.createElement("div");
    tick.textContent = i;
    tick.style.height = "1px"; // 텍스트 표시용 placeholder
    tick.style.position = "relative";
    tick.style.top = "-8px"; // 눈금 위치 미세 조정
    axisContainer.appendChild(tick);
  }

  // 막대 그래프 그리는 영역
  const chartWrapper = document.createElement("div");
  chartWrapper.style.display = "flex";
  chartWrapper.style.flexDirection = "row";
  chartWrapper.style.gap = "12px";
  chartWrapper.style.alignItems = "flex-end";
  chartWrapper.style.height = "200px";
  chartWrapper.style.position = "relative";

  // 막대 위에 띄울 툴팁 정의 (초기 비활성 상태)
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.padding = "4px 8px";
  tooltip.style.background = "rgba(0, 0, 0, 0.7)";
  tooltip.style.color = "#fff";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.pointerEvents = "none";
  tooltip.style.display = "none";
  tooltip.style.zIndex = "10";
  tooltip.style.minWidth = "80px"; // label 길이에 따른 줄바꿈 방지
  tooltip.style.whiteSpace = "nowrap"; // 툴팁 텍스트 한 줄 유지
  tooltip.style.textAlign = "center";

  chartWrapper.appendChild(tooltip);

  // 각 항목에 대한 막대 생성
  state.forEach(({ label, value }) => {
    const barWrapper = document.createElement("div");
    barWrapper.style.display = "flex";
    barWrapper.style.flexDirection = "column";
    barWrapper.style.alignItems = "center";
    barWrapper.style.width = "40px";

    const bar = document.createElement("div");
    bar.style.width = "100%";
    bar.style.height = `${(value / 100) * 200}px`; // 0~100 비율로 높이 반영
    bar.style.background = "#4caf50";
    bar.style.borderRadius = "4px 4px 0 0";
    bar.style.cursor = "pointer";

    bar.addEventListener("mouseenter", () => {
      tooltip.textContent = `${label}: ${value}`; // ✅ 툴팁에 label + value
      tooltip.style.display = "block";
    });

    bar.addEventListener("mousemove", (e) => {
      tooltip.style.left = `${e.pageX - container.offsetLeft + 10}px`;
      tooltip.style.top = `${e.pageY - container.offsetTop - 40}px`;
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
