import { getState, setState } from "../core/state.js";
import {
  getNextId,
  saveIdCounter,
  resetIdCounterTo,
} from "../core/idManager.js";

/**
 * 데이터 추가 폼 이벤트 핸들러를 초기화합니다.
 *
 * - 사용자가 폼을 통해 label/value를 입력하면 유효성 검사 후 상태에 추가합니다.
 * - ID는 자동으로 부여되며, 기존 상태의 최대 ID를 기반으로 일관성 있게 관리됩니다.
 * - 상태 업데이트는 옵저버 패턴을 통해 모든 UI 컴포넌트에 반영됩니다.
 * - 폼은 제출 후 초기화되며, ID 카운터는 로컬 스토리지에도 동기화됩니다.
 */
export function setupFormHandler() {
  const form = document.querySelector("#add-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 사용자 입력값 가져오기
    const labelInput = document.getElementById("input-label");
    const valueInput = document.getElementById("input-value");
    const label = labelInput.value.trim();
    const value = parseInt(valueInput.value, 10);

    // ===== [1] 입력값 유효성 검사 =====
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

    // ===== [2] ID 동기화 및 상태 갱신 =====
    const currentState = getState();
    const maxId = currentState.reduce((max, item) => Math.max(max, item.id), 0);

    resetIdCounterTo(maxId + 1); // 기존 상태에서 가장 큰 ID 기준으로 재설정

    const newItem = {
      id: getNextId(), // 전역 ID 모듈로부터 고유 ID 부여
      label,
      value,
    };

    const newState = [...currentState, newItem];

    setState(newState); // 상태 반영 → 렌더러들이 자동 업데이트됨
    saveIdCounter(); // ID 상태 로컬스토리지에 저장 (향후 복원 대비)
    form.reset(); // 폼 초기화
  });
}
