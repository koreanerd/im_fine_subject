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
export function createLayout() {
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
  labelInput.placeholder = "이름";
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
