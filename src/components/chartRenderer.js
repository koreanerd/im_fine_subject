import { getState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";

/**
 * chartRenderer
 *
 * - 현재 애플리케이션 상태(appState)를 기반으로 막대 그래프를 렌더링합니다.
 * - 그래프는 Y축 눈금과 막대(bar) 영역으로 구성되며, 값에 따라 막대의 높이를 비율로 표시합니다.
 * - 마우스 오버 시, 해당 막대의 label과 value 정보를 툴팁으로 제공합니다.
 *
 * [구성 요소]
 * - chartArea: Y축과 막대가 포함된 전체 그래프 컨테이너
 * - chart-axis: Y축 눈금 (100 → 0까지 20 단위 표시)
 * - chart-wrapper: 실제 막대들이 렌더링되는 영역
 * - chart-tooltip: 마우스 hover 시 표시되는 정보창
 */
export function chartRenderer() {
  const container = document.getElementById("chart-container");

  if (!container) return;

  // 렌더링 영역 초기화
  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "Chart"));

  const state = getState();

  if (state.length === 0) {
    container.appendChild(
      createTextElement("p", "Oops! There's no data to display the chart 📊")
    );

    return;
  }

  // 전체 그래프 영역 (눈금 + 막대)
  const chartArea = document.createElement("div");
  chartArea.className = "chart-area";

  // Y축 눈금 생성: 100 → 0, 20 단위로 표시
  const axisContainer = document.createElement("div");
  axisContainer.className = "chart-axis";

  for (let i = 100; i >= 0; i -= 20) {
    const tick = document.createElement("div");

    tick.textContent = i;
    tick.style.top = "-15px"; // 눈금 위치 미세 조정

    axisContainer.appendChild(tick);
  }

  // 막대(bar) 렌더링 영역 생성
  const chartWrapper = document.createElement("div");
  chartWrapper.className = "chart-wrapper";

  // 툴팁 DOM 생성 (초기 비노출)
  const tooltip = document.createElement("div");
  tooltip.className = "chart-tooltip";

  chartWrapper.appendChild(tooltip);

  // 각 항목에 대한 막대(bar) 생성
  state.forEach(({ label, value }) => {
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.setProperty("--target-height", `${(value / 100) * 200}px`); // 값 비율로 높이 설정

    // 툴팁 이벤트 연결
    bar.addEventListener("mouseenter", () => {
      tooltip.textContent = `${label}: ${value}`;
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

  // 구성 요소들을 최종 결합
  chartArea.appendChild(axisContainer);
  chartArea.appendChild(chartWrapper);
  container.appendChild(chartArea);
}
