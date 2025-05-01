// 앱 전체에서 공유되는 고유 ID 카운터
let idCounter = loadIdCounter(); // 앱 시작 시 로컬스토리지에서 불러와 초기화

/**
 * 고유 ID를 반환하고, 내부 카운터를 증가시킵니다.
 *
 * - 각 항목의 ID는 순차적으로 증가하며 중복되지 않습니다.
 * - 이 함수는 새로운 데이터가 추가될 때 사용됩니다.
 */
export function getNextId() {
  return idCounter++;
}

/**
 * 현재 ID 카운터 상태를 로컬스토리지에 저장합니다.
 *
 * - 페이지 새로고침 후에도 ID가 이어지도록 유지합니다.
 */
export function saveIdCounter() {
  localStorage.setItem("idCounter", idCounter.toString());
}

/**
 * ID 카운터를 외부 값으로 초기화합니다.
 *
 * - JSON 편집기에서 상태를 강제로 바꾼 후 동기화를 위해 사용됩니다.
 * - 1 이상의 숫자만 허용되며, 바로 저장까지 수행합니다.
 */
export function resetIdCounterTo(value) {
  if (typeof value === "number" && value >= 1) {
    idCounter = value;
    saveIdCounter();
  }
}

/**
 * 로컬스토리지에서 ID 카운터를 불러옵니다.
 *
 * - 저장된 값이 없거나 유효하지 않은 경우 기본값 1을 반환합니다.
 */
function loadIdCounter() {
  const stored = localStorage.getItem("idCounter");

  return stored ? parseInt(stored, 10) : 1;
}
