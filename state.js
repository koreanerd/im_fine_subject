// 중앙 데이터 저장소
let appState = [];

// 구독자(렌더링 함수) 리스트
const observers = [];

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
  notifyObservers(); // 모든 구독자들에게 알림
}

// 내부 함수: 모든 구독자 호출
function notifyObservers() {
  observers.forEach((observer) => observer());
}
