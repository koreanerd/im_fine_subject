import { getState, setState } from "./state.js";

let idCounter = loadIdCounter();

function loadIdCounter() {
  const storedCounter = localStorage.getItem("idCounter");

  if (storedCounter) {
    return parseInt(storedCounter, 10);
  }

  return 1; // 저장된 게 없으면 1부터 시작
}

function saveIdCounter() {
  localStorage.setItem("idCounter", idCounter.toString());
}

export function setupFormHandler() {
  const form = document.querySelector("#add-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const labelInput = document.getElementById("input-label");
    const valueInput = document.getElementById("input-value");
    const label = labelInput.value.trim();
    const value = parseInt(valueInput.value, 10);

    // 입력 검증
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

    // 새 데이터 객체 생성
    const newItem = {
      id: idCounter++,
      label,
      value,
    };

    // 기존 상태에 추가
    const currentState = getState();
    const newState = [...currentState, newItem];

    setState(newState);
    saveIdCounter();

    // 폼 초기화
    form.reset();
  });
}
