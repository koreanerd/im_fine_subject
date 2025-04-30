import { getState, setState } from "./state.js";
import { getNextId, saveIdCounter, resetIdCounterTo } from "./idManager.js";

/**
 * 데이터 추가 폼 핸들러
 * - 유효성 검사
 * - 상태 업데이트
 * - ID 자동 관리 및 동기화
 */
export function setupFormHandler() {
  const form = document.querySelector("#add-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 사용자가 입력한 label과 value 값 추출
    const labelInput = document.getElementById("input-label");
    const valueInput = document.getElementById("input-value");
    const label = labelInput.value.trim();
    const value = parseInt(valueInput.value, 10);

    // ⚠️ 기본 유효성 검사
    // label은 빈 문자열이면 안 되고, value는 1~100 사이의 정수여야 함
    if (!label) {
      alert("제목을 입력해주세요!");

      return;
    }

    if (isNaN(value)) {
      alert("숫자를 입력해주세요!");

      return;
    }

    if (value < 1 || value > 100) {
      alert("1에서 100 사이의 숫자를 입력해주세요!");

      return;
    }

    const currentState = getState();

    /**
     * ✅ ID 카운터 동기화 전략
     *
     * - JSON 편집기 등 외부에서 상태가 변경되었을 수 있으므로
     *   현재 상태에서 가장 큰 ID를 기준으로 다음 ID를 결정합니다.
     * - 모든 ID는 고유해야 하며, 중복 방지를 위해 항상 상태 기반으로 counter를 리셋합니다.
     */
    const maxId = currentState.reduce((max, item) => Math.max(max, item.id), 0);

    resetIdCounterTo(maxId + 1); // 다음 ID는 가장 큰 ID + 1

    // 새 항목 구성
    const newItem = {
      id: getNextId(), // 전역 ID 관리 모듈에서 ID 발급
      label,
      value,
    };

    // 상태에 새로운 항목 추가
    const newState = [...currentState, newItem];

    setState(newState); // 상태 업데이트 → 옵저버 통해 UI 갱신
    saveIdCounter(); // 로컬 스토리지에 ID 상태 저장 (새로고침 대응)

    form.reset(); // 폼 초기화
  });
}
