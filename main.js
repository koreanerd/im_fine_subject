import { subscribe } from "./state.js";
import { chartRenderer } from "./chartRenderer.js";
import { tableRenderer } from "./tableRenderer.js";
import { jsonEditorRenderer } from "./jsonEditorRenderer.js";

/**
 * 화면에 필요한 기본 레이아웃(div, textarea 등)을 생성합니다.
 *
 * - chartContainer: 막대 그래프 표시 영역
 * - tableContainer: 데이터 편집 테이블 표시 영역
 * - jsonEditor: JSON 편집기 영역
 *
 * 레이아웃은 JS로 동적으로 생성되며, 초기 HTML에는 존재하지 않습니다.
 */
function createLayout() {
  const body = document.body;

  const chartContainer = document.createElement("div");
  chartContainer.id = "chart-container";

  const tableContainer = document.createElement("div");
  tableContainer.id = "table-container";

  const jsonEditor = document.createElement("div");
  jsonEditor.id = "json-editor";

  body.appendChild(chartContainer);
  body.appendChild(tableContainer);
  body.appendChild(jsonEditor);
}

/**
 * 상태(appState) 변경 시 호출되어
 * 화면 전체를 다시 그려주는 렌더링 함수입니다.
 *
 * 각 컴포넌트(chart, table, jsonEditor)가 최신 상태를 반영하도록 합니다.
 */
function renderAll() {
  chartRenderer();
  tableRenderer();
  jsonEditorRenderer();
}

/**
 * 애플리케이션 초기화 함수입니다.
 *
 * - 레이아웃 생성
 * - 폼 이벤트 핸들러 연결
 * - 상태 변경 감지 및 구독 설정
 * - 최초 화면 렌더링
 *
 * 모든 초기 세팅은 DOMContentLoaded 이후 안전하게 수행됩니다.
 */
function init() {
  createLayout(); // 레이아웃 생성
  subscribe(renderAll); // 상태 구독
  renderAll(); // 초기 렌더링
}

// 문서가 로드되면 애플리케이션 초기화
document.addEventListener("DOMContentLoaded", init);
