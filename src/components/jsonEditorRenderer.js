import { getState, setState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";
import { resetIdCounterTo } from "../core/idManager.js";

/**
 * JSON 편집기 UI를 렌더링합니다.
 *
 * - 현재 상태(state)를 textarea 형태의 JSON으로 보여줍니다.
 * - 사용자는 JSON을 직접 편집할 수 있으며, Apply 시 해당 내용을 상태로 반영합니다.
 * - ID는 자동 관리되므로 편집 대상에서 제외되며, label과 value만 수정 가능합니다.
 */
export function jsonEditorRenderer() {
  const container = document.getElementById("json-editor");

  if (!container) return;

  // 초기화 및 제목 추가
  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "JSON Editor"));

  // 현재 상태를 JSON 형태로 textarea에 반영
  const textarea = document.createElement("textarea");
  textarea.id = "json-input";
  textarea.rows = 10;
  textarea.style.width = "100%";

  const state = getState();

  // 사용자에게는 label과 value만 보여주고 편집할 수 있게 구성
  const simplified = state.map(({ label, value }) => ({ label, value }));
  textarea.value = JSON.stringify(simplified, null, 2);

  container.appendChild(textarea);

  // Apply 버튼 생성 및 클릭 핸들링
  const applyBtn = createTextElement("button", "Apply");
  applyBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(textarea.value);

      // 유효성 검사: 배열 형태인지 확인
      if (!Array.isArray(parsed)) {
        alert("데이터는 배열 형태여야 합니다.");

        return;
      }

      const newState = [];

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        // 각 항목의 필드 유효성 검사
        if (
          typeof item.label !== "string" ||
          typeof item.value !== "number" ||
          !Number.isInteger(item.value) ||
          item.value < 1 ||
          item.value > 100
        ) {
          alert(
            `항목 ${i + 1}의 label 또는 value가 유효하지 않습니다.\n` +
              "label은 문자열, value는 1~100 사이의 정수여야 합니다."
          );

          return;
        }

        // ID는 배열 순서 기반으로 자동 부여
        newState.push({
          id: i + 1,
          label: item.label.trim(),
          value: item.value,
        });
      }

      // 상태 업데이트 및 ID 카운터 동기화
      setState(newState);
      resetIdCounterTo(newState.length + 1);
    } catch (error) {
      alert("유효하지 않은 JSON 형식입니다.");
      console.error("JSON 파싱 오류:", error);
    }
  });

  container.appendChild(applyBtn);
}
