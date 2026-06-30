let age = 5;
let score = 0;
let selectedCar = null;
let selectedKey = null;
let currentMission = null;
let currentAnswer = null;

const cars = [
  { id: "police", name: "경찰차", emoji: "🚓", target: "🦹‍♂️", scene: "scene-police", title: "밤거리 추격 현장" },
  { id: "fire", name: "소방차", emoji: "🚒", target: "🔥", scene: "scene-fire", title: "화재 구조 현장" },
  { id: "ambulance", name: "구급차", emoji: "🚑", target: "🤒", scene: "scene-ambulance", title: "병원 앞 구조 현장" },
  { id: "tow", name: "견인차", emoji: "🚛", target: "🚗", scene: "scene-tow", title: "도로 견인 현장" },
  { id: "rescue", name: "구조차", emoji: "🚜", target: "🌳", scene: "scene-rescue", title: "숲길 구조 현장" },
  { id: "special", name: "특수기동차", emoji: "🚔", target: "🤖", scene: "scene-special", title: "비밀 로봇 현장" }
];

const keys = [
  { name: "블루 키", color: "#2196f3" },
  { name: "레드 키", color: "#f44336" },
  { name: "그린 키", color: "#4caf50" },
  { name: "옐로 키", color: "#ffeb3b" },
  { name: "퍼플 키", color: "#9c27b0" },
  { name: "블랙 키", color: "#111111" }
];

const encouragements = [
  "괜찮아! 다시 한번 해볼까?",
  "좋아, 거의 다 왔어!",
  "천천히 생각해보자!",
  "오웬 히어로, 한 번 더!",
  "파워키가 다시 힘을 모으고 있어!"
];

function selectAge(n) {
  age = n;
  show("garageScreen");
  renderCars();
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderCars() {
  document.getElementById("scoreText").textContent = score;
  const list = document.getElementById("carList");
  list.innerHTML = "";

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="car-emoji">${car.emoji}</div>
      <div class="car-name">${car.name}</div>
    `;
    div.onclick = () => chooseCar(car);
    list.appendChild(div);
  });
}

function chooseCar(car) {
  selectedCar = car;
  selectedKey = null;

  document.getElementById("carTitle").textContent = `${car.name} 선택 완료!`;
  document.getElementById("carPreview").innerHTML = `<div style="font-size:110px">${car.emoji}</div>`;
  document.getElementById("keyMsg").textContent = "어떤 파워키를 꽂을까?";
  document.getElementById("startBtn").classList.add("hidden");

  renderKeys();
  show("keyScreen");
}

function renderKeys() {
  const list = document.getElementById("keyList");
  list.innerHTML = "";

  keys.forEach(key => {
    const div = document.createElement("div");
    div.className = "key";
    div.innerHTML = `
      <div class="key-shape" style="background:${key.color}"></div>
      <strong>${key.name}</strong>
    `;
    div.onclick = () => chooseKey(key, div);
    list.appendChild(div);
  });
}

function chooseKey(key, el) {
  selectedKey = key;
  document.querySelectorAll(".key").forEach(k => k.classList.remove("selected"));
  el.classList.add("selected");

  document.getElementById("keyMsg").textContent = `${key.name} 장착 완료! 출동 준비 끝!`;
  document.getElementById("startBtn").classList.remove("hidden");
  soundCharge();
}

function startMission() {
  const scene = document.getElementById("scene");
  scene.className = selectedCar.scene;

  document.getElementById("sceneTitle").textContent = selectedCar.title;
  document.getElementById("heroCar").textContent = selectedCar.emoji;
  document.getElementById("target").textContent = selectedCar.target;
  document.getElementById("result").textContent = "";
  document.getElementById("againBtn").classList.add("hidden");
  document.getElementById("nextBtn").classList.add("hidden");

  show("missionScreen");
  soundScene();
  makeRandomMission();
}

function makeRandomMission() {
  const missions = ["math", "rps", "memory", "carQuiz"];
  const pick = missions[Math.floor(Math.random() * missions.length)];

  if (pick === "math") makeMathMission();
  if (pick === "rps") makeRpsMission();
  if (pick === "memory") makeMemoryMission();
  if (pick === "carQuiz") makeCarQuizMission();
}

function makeMathMission() {
  currentMission = "math";

  let a, b, op;

  if (age === 5) {
    op = Math.random() > 0.5 ? "+" : "-";
    if (op === "+") {
      a = rand(1, 9);
      b = rand(1, 10 - a);
    } else {
      a = rand(1, 10);
      b = rand(1, a);
    }
  } else if (age === 6) {
    op = Math.random() > 0.5 ? "+" : "-";
    a = rand(1, 20);
    b = rand(1, 10);
  } else {
    op = Math.random() > 0.5 ? "+" : "-";
    a = rand(10, 99);
    b = rand(1, 50);
  }

  if (op === "-" && b > a) [a, b] = [b, a];

  currentAnswer = op === "+" ? a + b : a - b;

  document.getElementById("missionTitle").textContent = "숫자 파워 미션!";
  document.getElementById("missionContent").textContent = `${a} ${op} ${b} = ?`;

  const answers = makeAnswers(currentAnswer);
  renderChoices(answers, value => check(value === currentAnswer));
}

function makeRpsMission() {
  currentMission = "rps";

  const enemy = ["✊", "✋", "✌"][rand(0, 2)];
  const winMap = { "✊": "✋", "✋": "✌", "✌": "✊" };

  currentAnswer = winMap[enemy];

  document.getElementById("missionTitle").textContent = "가위바위보 미션!";
  document.getElementById("missionContent").textContent = `상대는 ${enemy}`;
  renderChoices(["✊", "✋", "✌"], value => check(value === currentAnswer));
}

function makeMemoryMission() {
  currentMission = "memory";

  const answerKey = keys[rand(0, keys.length - 1)];
  currentAnswer = answerKey.name;

  document.getElementById("missionTitle").textContent = "파워키 기억 미션!";
  document.getElementById("missionContent").innerHTML = `
    <div class="key-shape" style="background:${answerKey.color}; margin:auto;"></div>
  `;
  document.getElementById("choices").innerHTML = "";

  setTimeout(() => {
    document.getElementById("missionContent").textContent = "방금 본 파워키는?";
    const options = shuffle([answerKey, ...keys.filter(k => k.name !== answerKey.name).slice(0, 2)]);
    renderChoices(options.map(k => k.name), value => check(value === currentAnswer));
  }, 1500);
}

function makeCarQuizMission() {
  currentMission = "carQuiz";

  currentAnswer = selectedCar.name;

  document.getElementById("missionTitle").textContent = "자동차 이름 미션!";
  document.getElementById("missionContent").textContent = selectedCar.emoji;

  const options = shuffle([selectedCar, ...cars.filter(c => c.id !== selectedCar.id).slice(0, 2)]);
  renderChoices(options.map(c => c.name), value => check(value === currentAnswer));
}

function renderChoices(items, handler) {
  const choices = document.getElementById("choices");
  choices.innerHTML = "";

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = item;
    btn.onclick = () => handler(item);
    choices.appendChild(btn);
  });
}

function check(ok) {
  if (ok) {
    score++;
    document.getElementById("target").textContent = "🎉";
    document.getElementById("target").classList.add("pop");
    document.getElementById("result").textContent = "멋지다! 미션 성공! ⭐ +1";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("nextBtn").classList.remove("hidden");
    soundSuccess();
  } else {
    document.getElementById("result").textContent = encouragements[rand(0, encouragements.length - 1)];
    document.getElementById("againBtn").classList.remove("hidden");
    soundEncourage();
  }
}

function retryMission() {
  document.getElementById("againBtn").classList.add("hidden");
  document.getElementById("result").textContent = "";
  makeRandomMission();
}

function nextRound() {
  document.getElementById("target").classList.remove("pop");
  show("garageScreen");
  renderCars();
}

function makeAnswers(answer) {
  const set = new Set([answer]);
  while (set.size < 3) {
    let wrong = answer + rand(-4, 4);
    if (wrong < 0) wrong = answer + rand(1, 4);
    if (wrong !== answer) set.add(wrong);
  }
  return shuffle(Array.from(set));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function soundCharge() {
  beep(500, 0.08);
  setTimeout(() => beep(750, 0.08), 100);
}

function soundScene() {
  beep(700, 0.08);
  setTimeout(() => beep(400, 0.08), 120);
}

function soundSuccess() {
  beep(650, 0.08);
  setTimeout(() => beep(850, 0.08), 100);
  setTimeout(() => beep(1050, 0.12), 200);
}

function soundEncourage() {
  beep(420, 0.08);
  setTimeout(() => beep(520, 0.08), 120);
}

function beep(freq, duration) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = freq;
    osc.type = "square";
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.05;

    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration * 1000);
  } catch (e) {}
}
