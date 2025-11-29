const themes = {
  ru: {
    "Погода": ["дождь","снег","ветер","град","туман","буря","солнце","мороз","жара","облако","гроза","шторм","роса","метель","ливень"],
    "Города": ["минск","москва","берлин","париж","киев","рим","лондон","мадрид","вена","варшава","стамбул","токио","пекин","осло","будапешт"],
    "Животные": ["тигр","слон","кошка","собака","орел","лев","заяц","медведь","волк","еж","лошадь","корова","рысь","жираф","обезьяна"],
    "Фрукты": ["яблоко","банан","груша","апельсин","виноград","слива","персик","киви","манго","лимон","арбуз","дыня","вишня","черника","гранат"],
    "Спорт": ["футбол","теннис","хоккей","бокс","шахматы","баскетбол","волейбол","гандбол","регби","гольф","биатлон","борьба","дзюдо","каратэ","серфинг"]
  },
  en: {
    "Weather": ["rain","snow","wind","hail","fog","storm","sun","frost","heat","cloud","thunder","shower","dew","blizzard","downpour"],
    "Cities": ["minsk","moscow","berlin","paris","kyiv","rome","london","madrid","vienna","warsaw","istanbul","tokyo","beijing","oslo","budapest"],
    "Animals": ["tiger","elephant","cat","dog","eagle","lion","hare","bear","wolf","hedgehog","horse","cow","lynx","giraffe","monkey"],
    "Fruits": ["apple","banana","pear","orange","grape","plum","peach","kiwi","mango","lemon","watermelon","melon","cherry","blueberry","pomegranate"],
    "Sports": ["football","tennis","hockey","boxing","chess","basketball","volleyball","handball","rugby","golf","biathlon","wrestling","judo","karate","surfing"]
  }
};

let currentLang = "ru";
let word = "";
let guessed = [];
let attempts = 10;
let hintUsed = false;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startGame() {
  const val = document.getElementById("wordInput").value.toLowerCase().trim();
  if (!val) return;
  word = val;
  initGame();
}

function chooseTheme(themeLabel) {
  const list = themes[currentLang][themeLabel];
  if (!list) return;
  word = list[Math.floor(Math.random() * list.length)];
  initGame();
}

function initGame() {
  guessed = Array(word.length).fill("_");
  attempts = 10;
  hintUsed = false;
  document.getElementById("hintBtn").disabled = false;
  updateWord();
  updateAttempts();
  drawHangman();
  createKeyboard();
  showScreen("game");
}

function updateWord() {
  document.getElementById("wordDisplay").textContent = guessed.join(" ");
}

function updateAttempts() {
  const text = currentLang === "ru" ? "Осталось попыток: " : "Attempts left: ";
  document.getElementById("attemptsDisplay").textContent = text + attempts;
}

function getThemeLabels() {
  return currentLang === "ru"
    ? ["Погода","Города","Животные","Фрукты","Спорт"]
    : ["Weather","Cities","Animals","Fruits","Sports"];
}

function updateInterface() {
  document.querySelector("#start h2").textContent =
    currentLang === "ru" ? "Введите слово" : "Enter a word";
  document.querySelector("#start h3").textContent =
    currentLang === "ru" ? "или выберите тему:" : "or choose a theme:";
  const startBtn = document.querySelector("#start button[onclick='startGame()']");
  if (startBtn) startBtn.textContent = currentLang === "ru" ? "Играть" : "Play";
  const labels = getThemeLabels();
  const themeButtons = document.querySelectorAll(".themes button");
  themeButtons.forEach((btn, i) => {
    const label = labels[i];
    btn.textContent = label;
    btn.onclick = () => chooseTheme(label);
  });
  document.querySelector("#game h2").textContent =
    currentLang === "ru" ? "Игра" : "Game";
  document.getElementById("hintBtn").textContent =
    currentLang === "ru" ? "Подсказка" : "Hint";
  document.getElementById("newGameBtn").textContent =
    currentLang === "ru" ? "Новая игра" : "New Game";
  updateAttempts();
  createKeyboard();
}

function createKeyboard() {
  const container = document.getElementById("alfavit");
  container.innerHTML = "";
  const rows = currentLang === "ru"
    ? ["ЙЦУКЕНГШЩЗХЪ","ФЫВАПРОЛДЖЭ","ЯЧСМИТЬБЮ"]
    : ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    for (let ch of row) {
      const btn = document.createElement("button");
      btn.textContent = ch;
      btn.onclick = () => checkLetter(ch.toLowerCase(), btn);
      rowDiv.appendChild(btn);
    }
    container.appendChild(rowDiv);
  });
}

function checkLetter(letter, btn) {
  if (btn) btn.disabled = true;
  if (word.includes(letter)) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) guessed[i] = letter;
    }
    updateWord();
    if (btn) btn.classList.add("correct");
    if (!guessed.includes("_")) endGame(true);
  } else {
    attempts--;
    updateAttempts();
    drawHangman();
    if (btn) btn.classList.add("wrong");
    if (attempts === 0) endGame(false);
  }
}

function drawHangman() {
  const ctx = document.getElementById("game_board").getContext("2d");
  ctx.clearRect(0, 0, 250, 300);
  ctx.strokeStyle = document.body.classList.contains("dark") ? "#fff" : "#333";
  ctx.lineWidth = 3;
  const errors = 10 - attempts;
  if (errors > 0) ctx.strokeRect(20, 280, 200, 10);
  if (errors > 1) ctx.strokeRect(50, 50, 10, 230);
  if (errors > 2) ctx.strokeRect(50, 50, 120, 10);
  if (errors > 3) ctx.strokeRect(170, 50, 2, 40);
  if (errors > 4) { ctx.beginPath(); ctx.arc(170, 100, 20, 0, Math.PI*2); ctx.stroke(); }
  if (errors > 5) ctx.strokeRect(169, 120, 2, 60);
  if (errors > 6) { ctx.beginPath(); ctx.moveTo(170,130); ctx.lineTo(140,170); ctx.stroke(); }
  if (errors > 7) { ctx.beginPath(); ctx.moveTo(170,130); ctx.lineTo(200,170); ctx.stroke(); }
  if (errors > 8) { ctx.beginPath(); ctx.moveTo(170,180); ctx.lineTo(140,230); ctx.stroke(); }
  if (errors > 9) { ctx.beginPath(); ctx.moveTo(170,180); ctx.lineTo(200,230); ctx.stroke(); }
}

function hint() {
  if (hintUsed) return;
  const hiddenIdx = [];
  for (let i = 0; i < guessed.length; i++) {
    if (guessed[i] === "_") hiddenIdx.push(i);
  }
  if (!hiddenIdx.length) return;
  const i = hiddenIdx[Math.floor(Math.random() * hiddenIdx.length)];
  const targetLetter = word[i];
  const btn = Array.from(document.querySelectorAll("#alfavit button"))
    .find(b => b.textContent.toLowerCase() === targetLetter);
  checkLetter(targetLetter, btn);
  hintUsed = true;
  document.getElementById("hintBtn").disabled = true;
}

function endGame(win) {
  const resultText = document.getElementById("resultText");
  const wordReveal = document.getElementById("wordReveal");
  if (win) {
    resultText.textContent = currentLang === "ru" ? "Победа!" : "Victory!";
    resultText.className = "victory";
    wordReveal.textContent = "";
  } else {
    resultText.textContent = currentLang === "ru" ? "Поражение!" : "Defeat!";
    resultText.className = "defeat";
    wordReveal.textContent =
      (currentLang === "ru" ? "Загаданное слово: " : "The word was: ") + word;
  }
  showScreen("result");
}

function newGame() {
  document.getElementById("wordInput").value = "";
  hintUsed = false;
  document.getElementById("hintBtn").disabled = false;
  showScreen("start");
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
  drawHangman();
});

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "ru" ? "en" : "ru";
  document.getElementById("langToggle").textContent =
    currentLang === "ru" ? "🇬🇧" : "🇷🇺";
  updateInterface();
});

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("game").classList.contains("active")) return;
  const letter = e.key.toLowerCase();
  const isValid =
    currentLang === "ru" ? /[а-яё]/.test(letter) : /^[a-z]$/.test(letter);
  if (!isValid) return;
  const btn = Array.from(document.querySelectorAll("#alfavit button"))
    .find(b => b.textContent.toLowerCase() === letter);
  if (btn && !btn.disabled) checkLetter(letter, btn);
});

updateInterface();
