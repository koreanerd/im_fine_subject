import { subscribe } from "./state";

// 전체 렌더링 함수 (상태가 변할 때마다 호출될 함수)
function renderAll() {}

// 앱 초기화
function init() {
  // 상태 구독
  subscribe(renderAll);

  // 초기 렌더링
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
