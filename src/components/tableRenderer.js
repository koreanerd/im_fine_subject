import { getState, setState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";

/**
 * 테이블 UI를 렌더링합니다.
 *
 * - 현재 상태(state)를 기반으로 테이블을 구성
 * - 각 항목(row)에 대해 수정 가능한 input 필드와 삭제 버튼을 제공
 * - Apply 버튼을 통해 편집된 값들을 상태에 반영
 */
export function tableRenderer() {
  const container = document.getElementById("table-container");

  if (!container) return;

  const state = getState(); // 현재 앱 상태를 가져옴 (배열 형태)

  // 테이블 영역 초기화
  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "Table"));

  // 데이터가 없을 경우 메시지 표시 후 종료
  if (state.length === 0) {
    container.appendChild(createTextElement("p", "데이터가 없습니다."));

    return;
  }

  const tableScrollWrapper = document.createElement("div");
  tableScrollWrapper.className = "table-scroll-wrapper";

  // 테이블 구조 생성
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["ID", "Label", "Value", "Action"].forEach((text) =>
    headerRow.appendChild(createTextElement("th", text))
  );

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // 바디 구성
  const tbody = document.createElement("tbody");

  // 각 항목(item)을 행으로 렌더링
  state.forEach((item) => {
    const row = document.createElement("tr");
    const idCell = createTextElement("td", item.id); // ID 셀 (읽기 전용)

    row.appendChild(idCell);

    // Label 셀 (input)
    const labelCell = document.createElement("td");
    const labelInput = document.createElement("input");

    labelInput.type = "text";
    labelInput.value = item.label;
    labelInput.dataset.id = item.id;
    labelInput.dataset.field = "label";

    labelCell.appendChild(labelInput);
    row.appendChild(labelCell);

    // Value 셀 (input)
    const valueCell = document.createElement("td");
    const valueInput = document.createElement("input");

    valueInput.type = "number";
    valueInput.value = item.value;
    valueInput.min = 0;
    valueInput.max = 100;
    valueInput.dataset.id = item.id;
    valueInput.dataset.field = "value";

    valueCell.appendChild(valueInput);
    row.appendChild(valueCell);

    // 삭제 버튼 셀
    const deleteCell = document.createElement("td");
    const deleteButton = createTextElement("button", "삭제");
    deleteButton.className = "delete-button"; // 삭제 버튼에 클래스 추가

    deleteButton.addEventListener("click", () => {
      const newState = getState().filter((el) => el.id !== item.id);

      setState(newState);
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableScrollWrapper.appendChild(table);
  container.appendChild(tableScrollWrapper);

  // Apply 버튼 추가
  const applyBtn = createTextElement("button", "Apply");
  applyBtn.addEventListener("click", handleApply);
  applyBtn.className = "apply-button"; // Apply 버튼에 클래스 추가

  container.appendChild(applyBtn);
}

/**
 * 테이블의 모든 input 값을 수집하여
 * 상태(appState)에 반영합니다.
 *
 * - 수정된 label, value 값만 추출하여 업데이트
 * - 삭제된 항목은 유지되지 않음
 */
function handleApply() {
  const inputs = document.querySelectorAll("#table-container input");
  const updatedMap = {};

  inputs.forEach((input) => {
    const id = input.dataset.id;
    const field = input.dataset.field;
    const value =
      field === "value" ? parseInt(input.value, 10) : input.value.trim();

    if (!updatedMap[id]) {
      updatedMap[id] = { id: parseInt(id, 10) };
    }

    updatedMap[id][field] = value;
  });

  // 기존 상태를 기반으로 변경된 항목만 업데이트
  const newState = getState().map((item) =>
    updatedMap[item.id] ? { ...item, ...updatedMap[item.id] } : item
  );

  setState(newState);
}
