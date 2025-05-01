// ✅ 애플리케이션의 전역 상태를 저장하는 중앙 데이터 저장소
let appState = loadAppState();

// ✅ 상태 변경을 감지하여 재렌더링할 함수들을 보관하는 옵저버 목록
const observers = [];

/**
 * 상태 구독 등록 함수
 *
 * - 화면 갱신을 위한 함수(렌더러 등)를 구독자로 등록합니다.
 * - 상태(setState)가 바뀌면 등록된 모든 함수가 자동 호출됩니다.
 */
export function subscribe(observerFn) {
  observers.push(observerFn);
}

/**
 * 상태 반환 함수
 *
 * - 외부에서 상태를 직접 수정하는 것을 방지하기 위해
 *   내부 배열의 복사본을 반환합니다.
 */
export function getState() {
  return [...appState]; // 원본 보호 (불변성 유지)
}

/**
 * 상태 설정 함수
 *
 * - 새로운 상태로 교체하며, 자동으로 로컬스토리지에 저장하고
 *   모든 구독자에게 변경 사항을 알립니다.
 */
export function setState(newState) {
  appState = [...newState]; // 불변성 유지하며 업데이트

  saveAppState(); // 로컬 저장소에 반영
  notifyObservers(); // 구독자들에게 변경 알림
}

/**
 * 내부 함수: 등록된 모든 구독자 함수 호출
 *
 * - 상태 변경 시 호출되어 UI를 최신 상태로 유지하게 합니다.
 */
function notifyObservers() {
  observers.forEach((observer) => observer());
}

/**
 * 내부 함수: 로컬스토리지에서 상태를 불러옴
 *
 * - 유효한 JSON 형식으로 저장된 데이터만 파싱하여 반환
 * - 데이터가 없거나 오류 발생 시 빈 배열 반환
 */
function loadAppState() {
  const storedState = localStorage.getItem("appState");

  if (storedState) {
    try {
      return JSON.parse(storedState);
    } catch (error) {
      console.error("❗ localStorage appState 파싱 실패:", error);

      return [];
    }
  }

  return [];
}

/**
 * 내부 함수: 상태를 로컬스토리지에 저장
 *
 * - 새로고침 시에도 동일한 상태를 유지할 수 있도록 저장합니다.
 */
function saveAppState() {
  localStorage.setItem("appState", JSON.stringify(appState));
}
