let selectedAge = 5;
let selectedCar = null;
let selectedKey = null;
let score = 0;
let currentAnswer = 0;

const cars = [
  {
    id: "police",
    name: "경찰차",
    color: "#1976d2",
    light: "#ff1744",
    mission: "도둑 앞에 도착했어!",
    event: "🦹‍♂️",
    success: "도둑 체포 성공!",
    sceneClass: "scene-police",
    sceneTitle: "밤거리 추격 현장"
  },
  {
    id: "fire",
    name: "소방차",
    color: "#e53935",
    light: "#ffeb3b",
    mission: "불난 건물 앞에 도착했어!",
    event: "🔥",
    success: "불 끄기 성공!",
    sceneClass: "scene-fire",
    sceneTitle: "화재 구조 현장"
  },
  {
    id: "ambulance",
    name: "구급차",
    color: "#ffffff",
    light: "#ff1744",
    mission: "아픈 사람 앞에 도착했어!",
    event: "🤒",
    success: "환자 구조 성공!",
    sceneClass: "scene-ambulance",
    sceneTitle: "병원 앞 구조 현장"
  },
  {
    id: "tow",
    name: "견인차",
    color: "#fbc02d",
    light: "#ff9800",
    mission: "고장난 차 앞에 도착했어!",
    event: "🚗",
    success: "견인 성공!",
    sceneClass: "scene-tow",
    sceneTitle: "도로 견인 현장"
  },
  {
    id: "rescue",
    name: "구조차",
    color: "#7b1fa2",
    light: "#ffeb3b",
    mission: "쓰러진 나무 앞에 도착했어!",
    event: "🌳",
    success: "도로 구조 성공!",
    sceneClass: "scene-rescue",
    sceneTitle: "숲길 구조 현장"
  },
  {
    id: "special",
    name: "특수기동차",
    color: "#263238",
    light: "#00e5ff",
    mission: "로봇 앞에 도착했어!",
    event: "🤖",
    success: "특수 작전 성공!",
    sceneClass: "scene-special",
    sceneTitle: "비밀 로봇 현장"
  }
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
  "거의 다 왔어! 천천히 생각해보자!",
  "오웬 히어로, 한 번 더 도전!",
  "파워키가 더 힘을 모으고 있어!",
  "좋아! 다시 누르면 할 수 있어!"
];

function selectAge(age) {
  selectedAge = age;
  showScreen("garageScreen");
  renderCars();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function renderCars() {
  const carList = document.getElementById("carList");
  carList.innerHTML = "";

  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      ${getCarSVG(car)}
      <div class="car-name">${car.name}</div>
    `;
    card.onclick = () => selectCar(car);
    carList.appendChild(card);
  });
}

function selectCar(car) {
  selectedCar = car;
  selectedKey = null;

  document.getElementById("score1").textContent = score;
  document.getElementById("selectedCarName").textContent = `${car.name} 선택 완료!`;
  document.getElementById("selectedCarView").innerHTML = `<div class="big-car">${getCarSVG(car)}</div>`;
  document.getElementById("keyMessage").textContent = "어떤 파워키를 꽂을까?";
  document.getElementById("attachBtn").classList.add("hidden");
  document.getElementById("launchBtn").classList.add("hidden");

  renderKeys();
  showScreen("keyScreen");
}

function renderKeys() {
  const keyList = document.getElementById("keyList");
  keyList.innerHTML = "";

  keys.forEach(key => {
    const card = document.createElement("div");
    card.className = "key-card";
    card.innerHTML = `
      <div class="power-key" style="background:${key.color}"></div>
      <strong>${key.name}</strong>
    `;
    card.onclick = () => selectKey(key, card);
    keyList.appendChild(card);
  });
}

function selectKey(key, card) {
  selectedKey = key;

  document.querySelectorAll(".key-card").forEach(el => {
    el.classList.remove("selected");
  });

  card.classList.add("selected");
  document.getElementById("attachBtn").classList.remove("hidden");
  document.getElementById("launchBtn").classList.add("hidden");
  document.getElementById("keyMessage").textContent = `${key.name} 선택 완료!`;
  playChargeSound();
}

function attachKey() {
  document.getElementById("keyMessage").textContent = `${selectedKey.name} 장착 완료! 출동 준비 끝!`;
  document.getElementById("attachBtn").classList.add("hidden");
  document.getElementById("launchBtn").classList.remove("hidden");
  playChargeSound();
}

function goToScene() {
  document.getElementById("score2").textContent = score;

  const scene = document.getElementById("scene");
  scene.className = "";
  scene.classList.add(selectedCar.sceneClass);

  document.getElementById("sceneTitle").textContent = selectedCar.sceneTitle;
  document.getElementById("sceneCar").innerHTML = `<div class="big-car">${getCarSVG(selectedCar)}</div>`;
  document.getElementById("sceneEvent").textContent = selectedCar.event;
  document.getElementById("missionText").textContent = selectedCar.mission;
  document.getElementById("resultText").textContent = "";
  document.getElementById("nextBtn").classList.add("hidden");

  showScreen("sceneScreen");
  playSceneSound();
  createMathMission();
}

function createMathMission() {
  let a, b, op;

  if (selectedAge === 5) {
    op = Math.random() > 0.5 ? "+" : "-";

    if (op === "+") {
      a = random(1, 9);
      b = random(1, 10 - a);
    } else {
      a = random(1, 10);
      b = random(1, a);
    }
  } else if (selectedAge === 6) {
    a = random(5, 20);
    b = random(1, 10);
    op = Math.random() > 0.5 ? "+" : "-";
  } else {
    a = random(10, 99);
    b = random(1, 50);
    op = Math.random() > 0.5 ? "+" : "-";
  }

  if (op === "-" && b > a) {
    const temp = a;
    a = b;
    b = temp;
  }

  currentAnswer = op === "+" ? a + b : a - b;

  document.getElementById("question").textContent = `${a} ${op} ${b} = ?`;

  const answers = makeAnswers(currentAnswer);
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  answers.forEach(num => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = num;
    btn.onclick = () => checkAnswer(num);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(num) {
  if (num === currentAnswer) {
    score++;
    document.getElementById("score2").textContent = score;

    const event = document.getElementById("sceneEvent");
    event.textContent = "🎉";
    event.classList.add("success-pop");

    document.getElementById("resultText").textContent = `멋지다! ${selectedCar.success} ⭐ +1`;
    document.getElementById("answers").innerHTML = "";
    document.getElementById("nextBtn").classList.remove("hidden");

    playSuccessSound();
  } else {
    const msg = encouragements[random(0, encouragements.length - 1)];
    document.getElementById("resultText").textContent = msg;
    playEncourageSound();
  }
}

function nextMission() {
  selectCar(selectedCar);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAnswers(answer) {
  const set = new Set();
  set.add(answer);

  while (set.size < 3) {
    let wrong = answer + random(-4, 4);

    if (wrong < 0) wrong = answer + random(1, 4);
    if (wrong !== answer) set.add(wrong);
  }

  return Array.from(set).sort(() => Math.random() - 0.5);
}

function getCarSVG(car) {
  return `
  <svg class="car-svg" viewBox="0 0 240 130">
    <rect x="35" y="55" width="160" height="45" rx="14" fill="${car.color}" stroke="#222" stroke-width="5"/>
    <rect x="70" y="30" width="85" height="38" rx="10" fill="${car.color}" stroke="#222" stroke-width="5"/>
    <rect x="82" y="38" width="25" height="22" rx="4" fill="#b3e5fc"/>
    <rect x="115" y="38" width="28" height="22" rx="4" fill="#b3e5fc"/>
    <rect class="light" x="102" y="20" width="35" height="14" rx="5" fill="${car.light}" stroke="#222" stroke-width="3"/>
    <circle cx="75" cy="102" r="17" fill="#222"/>
    <circle cx="165" cy="102" r="17" fill="#222"/>
    <circle cx="75" cy="102" r="7" fill="#aaa"/>
    <circle cx="165" cy="102" r="7" fill="#aaa"/>
    <text x="72" y="88" font-size="18" font-weight="bold" fill="#111">${car.name}</text>
  </svg>
  `;
}

function playSceneSound() {
  if (selectedCar.id === "police") {
    playBeep(700, 0.08);
    setTimeout(() => playBeep(400, 0.08), 120);
  } else if (selectedCar.id === "fire") {
    playBeep(900, 0.08);
    setTimeout(() => playBeep(500, 0.08), 120);
  } else if (selectedCar.id === "ambulance") {
    playBeep(600, 0.08);
    setTimeout(() => playBeep(800, 0.08), 120);
  } else if (selectedCar.id === "tow") {
    playBeep(300, 0.08);
    setTimeout(() => playBeep(350, 0.08), 120);
  } else if (selectedCar.id === "rescue") {
    playBeep(450, 0.08);
    setTimeout(() => playBeep(650, 0.08), 120);
  } else {
    playBeep(200, 0.08);
    setTimeout(() => playBeep(900, 0.08), 120);
  }
}

function playChargeSound() {
  playBeep(500, 0.08);
  setTimeout(() => playBeep(750, 0.08), 100);
}

function playSuccessSound() {
  playBeep(650, 0.08);
  setTimeout(() => playBeep(850, 0.08), 110);
  setTimeout(() => playBeep(1050, 0.12), 220);
}

function playEncourageSound() {
  playBeep(420, 0.08);
  setTimeout(() => playBeep(520, 0.08), 120);
}

function playBeep(freq, duration) {
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
  } catch (e) {
    console.log("sound blocked");
  }
}
