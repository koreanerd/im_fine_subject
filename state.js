let appState = loadAppState(); // 중앙 데이터 저장소
const observers = []; // 구독자(렌더링 함수) 리스트

// 상태를 구독하는 함수
export function subscribe(observerFn) {
  observers.push(observerFn);
}

// 상태를 가져오는 함수
export function getState() {
  return [...appState]; // 얕은 복사본을 리턴해서 직접 수정 못하게 막는다
}

// 상태를 설정하는 함수
export function setState(newState) {
  appState = [...newState]; // 새로운 상태로 교체
  saveAppState(); // 상태 저장
  notifyObservers(); // 모든 구독자들에게 알림
}

// 내부 함수: 모든 구독자 호출
function notifyObservers() {
  observers.forEach((observer) => observer());
}

// 내부 함수: 로컬 스토리지에서 상태를 로드하는 함수
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

// 내부 함수: 상태를 localStorage에 저장하는 함수
function saveAppState() {
  localStorage.setItem("appState", JSON.stringify(appState));
}
