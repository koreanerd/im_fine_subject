import { getState, setState } from "../core/state.js";
import { createTextElement } from "../utils/utils.js";
import { resetIdCounterTo } from "../core/idManager.js";

export function jsonEditorRenderer() {
  const container = document.getElementById("json-editor");

  if (!container) return;

  container.innerHTML = "";
  container.appendChild(createTextElement("h2", "JSON Editor"));

  const textarea = document.createElement("textarea");
  textarea.id = "json-input";
  textarea.rows = 10;
  textarea.style.width = "100%";

  const state = getState();

  // 사용자 편의를 위해 JSON 에디터에는 ID를 숨기고 label, value만 노출합니다.
  // ID는 시스템이 자동으로 부여하므로 사용자가 직접 수정하지 않도록 설계함.
  const simplified = state.map(({ label, value }) => ({ label, value }));
  textarea.value = JSON.stringify(simplified, null, 2);

  container.appendChild(textarea);

  const applyBtn = createTextElement("button", "Apply");

  applyBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(textarea.value);

      if (!Array.isArray(parsed)) {
        alert("데이터는 배열 형태여야 합니다.");

        return;
      }

      const newState = [];

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        // 필드 유효성 검사: label은 문자열, value는 1~100 사이의 정수여야 함
        if (
          typeof item.label !== "string" ||
          typeof item.value !== "number" ||
          !Number.isInteger(item.value) ||
          item.value < 1 ||
          item.value > 100
        ) {
          alert(
            `항목 ${
              i + 1
            }의 label 또는 value가 유효하지 않습니다.\nlabel은 문자열, value는 1~100 사이의 정수여야 합니다.`
          );
          return;
        }

        newState.push({
          // 🔽 ID는 배열 순서 기반으로 자동 부여됩니다.
          // 이는 사용자 편집 중 ID 충돌/누락 문제를 방지하기 위함이며,
          // ID는 내부 식별용이므로 사용자가 임의로 조작할 수 없습니다.
          id: i + 1,
          label: item.label.trim(),
          value: item.value,
        });
      }

      setState(newState);

      // 🔁 ID 카운터도 동기화: 이후 추가되는 데이터가 중복 ID를 생성하지 않도록
      resetIdCounterTo(newState.length + 1);
    } catch (error) {
      alert("유효하지 않은 JSON 형식입니다.");

      console.error("JSON 파싱 오류:", error);
    }
  });

  container.appendChild(applyBtn);
}
