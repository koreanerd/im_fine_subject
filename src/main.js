import { subscribe } from "./core/state.js";
import { createLayout } from "./layout/createLayout.js";
import { chartRenderer } from "./components/chartRenderer.js";
import { tableRenderer } from "./components/tableRenderer.js";
import { jsonEditorRenderer } from "./components/jsonEditorRenderer.js";
import { setupFormHandler } from "./core/formHandler.js";

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
  setupFormHandler(); // 폼 이벤트 핸들러 연결
  subscribe(renderAll); // 상태 구독
  renderAll(); // 초기 렌더링
}

// 문서가 로드되면 애플리케이션 초기화
document.addEventListener("DOMContentLoaded", init);
