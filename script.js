let selectedAge = 5;
let selectedCar = null;
let score = 0;
let currentAnswer = 0;

const cars = [
  {
    id: "police",
    name: "경찰차",
    color: "#1976d2",
    light: "#ff1744",
    keyColor: "#2196f3",
    mission: "도둑이 도망가고 있어!",
    event: "🦹‍♂️",
    success: "도둑 체포 성공!"
  },
  {
    id: "fire",
    name: "소방차",
    color: "#e53935",
    light: "#ffeb3b",
    keyColor: "#f44336",
    mission: "건물에 불이 났어!",
    event: "🔥",
    success: "불 끄기 성공!"
  },
  {
    id: "ambulance",
    name: "구급차",
    color: "#ffffff",
    light: "#ff1744",
    keyColor: "#4caf50",
    mission: "아픈 사람이 있어!",
    event: "🤒",
    success: "환자 구조 성공!"
  },
  {
    id: "tow",
    name: "견인차",
    color: "#fbc02d",
    light: "#ff9800",
    keyColor: "#ffeb3b",
    mission: "고장난 차가 있어!",
    event: "🚗💨",
    success: "견인 성공!"
  },
  {
    id: "rescue",
    name: "구조차",
    color: "#7b1fa2",
    light: "#ffeb3b",
    keyColor: "#9c27b0",
    mission: "길에 나무가 쓰러졌어!",
    event: "🌳",
    success: "도로 구조 성공!"
  },
  {
    id: "special",
    name: "특수기동차",
    color: "#263238",
    light: "#00e5ff",
    keyColor: "#111111",
    mission: "비밀 로봇이 나타났어!",
    event: "🤖",
    success: "특수 작전 성공!"
  }
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
    const div = document.createElement("div");
    div.className = "car-card";
    div.innerHTML = `
      ${getCarSVG(car)}
      <div class="car-name">${car.name}</div>
      <div>파워키 색상</div>
      <div class="key-body" style="background:${car.keyColor}; width:80px; height:25px;"></div>
    `;
    div.onclick = () => selectCar(car);
    carList.appendChild(div);
  });
}

function selectCar(car) {
  selectedCar = car;
  showScreen("missionScreen");

  document.getElementById("score").textContent = score;
  document.getElementById("eventIcon").textContent = car.event;

  const carStage = document.getElementById("carStage");
  carStage.className = "";
  carStage.innerHTML = getCarSVG(car, true);

  document.querySelectorAll(".crash-effect").forEach(el => el.remove());
  document.querySelectorAll(".speed-line").forEach(el => el.remove());
  document.getElementById("city").classList.remove("shake");

  document.getElementById("powerKey").innerHTML = `
    <div class="key-body" style="background:${car.keyColor};"></div>
  `;

  document.getElementById("chargeBar").style.width = "0%";
  document.getElementById("chargeText").textContent = "파워키를 장착하세요!";
  document.getElementById("connectBtn").classList.remove("hidden");
  document.getElementById("mathArea").classList.add("hidden");
  document.getElementById("launchBtn").classList.add("hidden");
  document.getElementById("resultText").textContent = "";
}

function connectKey() {
  document.getElementById("connectBtn").classList.add("hidden");
  document.getElementById("chargeText").textContent = "파워키 연결 완료! 충전 중...";
  document.getElementById("chargeBar").style.width = "100%";

  playBeep(450, 0.1);
  setTimeout(() => playBeep(650, 0.1), 120);
  setTimeout(() => playBeep(850, 0.1), 240);

  setTimeout(() => {
    createMathMission();
  }, 700);
}

function createMathMission() {
  document.getElementById("mathArea").classList.remove("hidden");
  document.getElementById("missionTitle").textContent = selectedCar.mission;

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
    document.getElementById("resultText").textContent = "정답! 파워 풀 충전!";
    document.getElementById("mathArea").classList.add("hidden");
    document.getElementById("launchBtn").classList.remove("hidden");
    playBeep(600, 0.15);
    setTimeout(() => playBeep(850, 0.15), 140);
  } else {
    document.getElementById("resultText").textContent = "아깝다! 다시 골라봐!";
    playBeep(180, 0.15);
  }
}

function launchCar() {
  document.getElementById("launchBtn").classList.add("hidden");
  document.getElementById("resultText").textContent = "3... 2... 1... 출동!";

  playLaunchSound();

  setTimeout(() => {
    showSpeedLine();

    const carStage = document.getElementById("carStage");
    carStage.classList.remove("launching");

    void carStage.offsetWidth;

    carStage.classList.add("launching");

    setTimeout(() => {
      showCrashEffect();
      playCrashSound();

      score += 1;
      document.getElementById("score").textContent = score;
      document.getElementById("resultText").textContent = `💥 쾅! ${selectedCar.success} ⭐ +1`;

      setTimeout(() => {
        selectCar(selectedCar);
      }, 2200);
    }, 1300);
  }, 700);
}

function showSpeedLine() {
  const city = document.getElementById("city");

  const line = document.createElement("div");
  line.className = "speed-line";
  line.textContent = "💨💨💨";
  city.appendChild(line);

  setTimeout(() => {
    line.remove();
  }, 1000);
}

function showCrashEffect() {
  const city = document.getElementById("city");
  city.classList.add("shake");

  const crash = document.createElement("div");
  crash.className = "crash-effect";
  crash.textContent = "💥";
  city.appendChild(crash);

  setTimeout(() => {
    city.classList.remove("shake");
  }, 500);
}

function goGarage() {
  showScreen("garageScreen");
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAnswers(answer) {
  const set = new Set();
  set.add(answer);

  while (set.size < 3) {
    let wrong = answer + random(-5, 5);

    if (wrong < 0) {
      wrong = answer + random(1, 5);
    }

    if (wrong !== answer) {
      set.add(wrong);
    }
  }

  return Array.from(set).sort(() => Math.random() - 0.5);
}

function getCarSVG(car, big = false) {
  const w = big ? 240 : 180;
  const h = big ? 130 : 100;

  return `
  <svg class="car-svg" width="${w}" height="${h}" viewBox="0 0 240 130">
    <rect x="35" y="55" width="160" height="45" rx="14" fill="${car.color}" stroke="#222" stroke-width="5"/>
    <rect x="70" y="30" width="85" height="38" rx="10" fill="${car.color}" stroke="#222" stroke-width="5"/>
    <rect x="82" y="38" width="25" height="22" rx="4" fill="#b3e5fc"/>
    <rect x="115" y="38" width="28" height="22" rx="4" fill="#b3e5fc"/>
    
    <rect class="light" x="102" y="20" width="35" height="14" rx="5" fill="${car.light}" stroke="#222" stroke-width="3"/>
    
    <circle class="wheel" cx="75" cy="102" r="17" fill="#222"/>
    <circle class="wheel" cx="165" cy="102" r="17" fill="#222"/>
    <circle cx="75" cy="102" r="7" fill="#aaa"/>
    <circle cx="165" cy="102" r="7" fill="#aaa"/>

    <rect x="195" y="70" width="28" height="16" rx="4" fill="${car.keyColor}" stroke="#222" stroke-width="4"/>
    <text x="75" y="87" font-size="18" font-weight="bold" fill="#111">${car.name}</text>
  </svg>
  `;
}

function playLaunchSound() {
  playBeep(500, 0.08);
  setTimeout(() => playBeep(700, 0.08), 100);
  setTimeout(() => playBeep(900, 0.08), 200);
  setTimeout(() => playBeep(1100, 0.12), 300);
}

function playCrashSound() {
  playBeep(120, 0.12);
  setTimeout(() => playBeep(90, 0.14), 100);
  setTimeout(() => playBeep(60, 0.18), 220);
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
    console.log("sound error");
  }
}
