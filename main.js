import { subscribe, getState } from "./state.js";
import { chartRenderer } from "./chartRenderer.js";
import { tableRenderer } from "./tableRenderer.js";
import { jsonEditorRenderer } from "./jsonEditorRenderer.js";
import { setupFormHandler } from "./formHandler.js";
/**
 * 화면에 필요한 기본 레이아웃(div, textarea 등)을 생성합니다.
 *
 * - chartContainer: 막대 그래프 표시 영역
 * - tableContainer: 데이터 편집 테이블 표시 영역
 * - jsonEditor: JSON 편집기 영역
 * - addForm: 데이터 추가 폼
 *
 * 레이아웃은 JS로 동적으로 생성되며, 초기 HTML에는 존재하지 않습니다.
 */
function createLayout() {
  const body = document.body;
  const appContainer = document.createElement("div");
  appContainer.id = "app-container";
  const leftPane = document.createElement("div");
  leftPane.id = "left-pane";
  const rightPane = document.createElement("div");
  rightPane.id = "right-pane";

  const chartContainer = document.createElement("div");
  chartContainer.id = "chart-container";

  const tableContainer = document.createElement("div");
  tableContainer.id = "table-container";

  const jsonEditor = document.createElement("div");
  jsonEditor.id = "json-editor";

  const addForm = document.createElement("form");
  addForm.id = "add-form";

  // label 입력
  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.id = "input-label";
  labelInput.placeholder = "제목";
  labelInput.required = true;
  labelInput.oninvalid = function () {
    this.setCustomValidity("제목을 입력해주세요!");
  };
  labelInput.oninput = function () {
    this.setCustomValidity("");
  };

  // value 입력
  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.id = "input-value";
  valueInput.placeholder = "입력값 (0~100)";
  valueInput.required = true;
  valueInput.min = "1";
  valueInput.max = "100";
  valueInput.oninvalid = function () {
    this.setCustomValidity("1에서 100 사이의 숫자를 입력해주세요!");
  };
  valueInput.oninput = function () {
    this.setCustomValidity("");
  };

  // 버튼
  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add";

  // 폼에 추가
  addForm.appendChild(labelInput);
  addForm.appendChild(valueInput);
  addForm.appendChild(addButton);

  leftPane.appendChild(chartContainer);
  leftPane.appendChild(tableContainer);
  leftPane.appendChild(addForm);
  rightPane.appendChild(jsonEditor);

  appContainer.appendChild(leftPane);
  appContainer.appendChild(rightPane);
  body.appendChild(appContainer);
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
  setupFormHandler(); // 폼 이벤트 핸들러 연결
  subscribe(renderAll); // 상태 구독
  renderAll(); // 초기 렌더링
}

// 문서가 로드되면 애플리케이션 초기화
document.addEventListener("DOMContentLoaded", init);
