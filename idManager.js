let idCounter = loadIdCounter(); // ✅ 먼저 로드

export function getNextId() {
  return idCounter++;
}

export function saveIdCounter() {
  localStorage.setItem("idCounter", idCounter.toString());
}

export function resetIdCounterTo(value) {
  if (typeof value === "number" && value >= 1) {
    idCounter = value;

    saveIdCounter();
  }
}

function loadIdCounter() {
  const stored = localStorage.getItem("idCounter");

  return stored ? parseInt(stored, 10) : 1;
}
