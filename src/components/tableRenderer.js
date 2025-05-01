import { getState, setState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";
import { resetIdCounterTo } from "../core/idManager.js"; // 삭제 후 ID 재정렬 위해 필요

/**
 * tableRenderer
 *
 * 현재 상태(state)를 기반으로 HTML 테이블 UI를 생성하고,
 * 각 항목을 행(row)으로 표시하여 편집 또는 삭제할 수 있도록 합니다.
 *
 * - Label과 Value는 input 요소로 표시되어 직접 수정 가능
 * - 삭제 시 ID는 배열 순서대로 재정렬되어 일관성 유지
 * - Apply 버튼을 통해 입력된 값이 상태에 반영되며,
 *   이 변경은 그래프, JSON 에디터 등 다른 컴포넌트에 동기 반영됩니다.
 */
export function tableRenderer() {
  const container = document.getElementById("table-container");

  if (!container) return;

  const state = getState(); // 현재 상태를 불러옵니다

  container.innerHTML = ""; // 기존 렌더링 초기화
  container.appendChild(createTextElement("h2", "Table"));

  // 상태가 비어 있을 경우 안내 메시지 표시
  if (state.length === 0) {
    container.appendChild(
      createTextElement("p", "👇👇Fill in the fields below and press Add!👇👇")
    );

    return;
  }

  // 스크롤 가능한 래퍼 생성
  const tableScrollWrapper = document.createElement("div");
  tableScrollWrapper.className = "table-scroll-wrapper";

  // 테이블 생성 (thead + tbody)
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["ID", "Label", "Value", "Action"].forEach((text) =>
    headerRow.appendChild(createTextElement("th", text))
  );

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // 상태 데이터를 기반으로 각 행 생성
  state.forEach((item) => {
    const row = document.createElement("tr");

    // ID (수정 불가)
    const idCell = createTextElement("td", item.id);
    idCell.style.cursor = "not-allowed";
    row.appendChild(idCell);

    // Label (수정 가능)
    const labelCell = document.createElement("td");
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.value = item.label;
    labelInput.dataset.id = item.id;
    labelInput.dataset.field = "label";

    labelCell.appendChild(labelInput);
    row.appendChild(labelCell);

    // Value (수정 가능)
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

    // 삭제 버튼
    const deleteCell = document.createElement("td");
    const deleteButton = createTextElement("button", "삭제");
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", () => {
      const confirmed = confirm(
        `정말로 "${item.label}" 항목을 삭제하시겠습니까?`
      );

      if (!confirmed) return;

      const filtered = getState().filter((el) => el.id !== item.id);

      const newState = filtered.map((el, index) => ({
        id: index + 1,
        label: el.label,
        value: el.value,
      }));

      setState(newState);
      resetIdCounterTo(newState.length + 1);
    });

    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableScrollWrapper.appendChild(table);
  container.appendChild(tableScrollWrapper);

  // Apply 버튼: 입력된 값들을 반영
  const applyBtn = createTextElement("button", "Apply");
  applyBtn.className = "apply-button";
  applyBtn.addEventListener("click", handleApply);

  container.appendChild(applyBtn);
}

/**
 * handleApply
 *
 * 테이블의 input 필드를 순회하여 수정된 데이터를 수집하고,
 * 상태에 반영하는 역할을 합니다.
 * 이로써 다른 UI 컴포넌트들도 최신 상태로 자동 갱신됩니다.
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

  const newState = getState().map((item) =>
    updatedMap[item.id] ? { ...item, ...updatedMap[item.id] } : item
  );

  setState(newState);
}
