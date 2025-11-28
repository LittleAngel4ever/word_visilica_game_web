// Themes and words (unchanged, Russian)
const themes = {
  "Погода": ["дождь","снег","ветер","град","туман","буря","солнце","мороз","жара","облако","гроза","шторм","роса","метель","ливень"],
  "Города": ["минск","москва","берлин","париж","киев","рим","лондон","мадрид","вена","варшава","стамбул","токио","пекин","осло","будапешт"],
  "Животные": ["тигр","слон","кошка","собака","орел","лев","заяц","медведь","волк","еж","лошадь","корова","рысь","жираф","обезьяна"],
  "Фрукты": ["яблоко","банан","груша","апельсин","виноград","слива","персик","киви","манго","лимон","арбуз","дыня","вишня","черника","гранат"],
  "Спорт": ["футбол","теннис","хоккей","бокс","шахматы","баскетбол","волейбол","гандбол","регби","гольф","биатлон","борьба","дзюдо","каратэ","серфинг"]
};

let word = "", guessed = [], attempts = 10;
let hintUsed = false;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame() {
  word = document.getElementById("wordInput").value.toLowerCase();
  if (word) initGame();
}

function chooseTheme(theme) {
  word = themes[theme][Math.floor(Math.random()*themes[theme].length)];
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
  createAlfavit();
  showScreen("game");
}

function updateWord() {
  document.getElementById("wordDisplay").textContent = guessed.join(" ");
}

function updateAttempts() {
  document.getElementById("attemptsDisplay").textContent = "Attempts left: " + attempts;
}

// Russian keyboard layout in physical rows
function createAlfavit() {
  const container = document.getElementById("alfavit");
  container.innerHTML = "";
  const rows = ["ЙЦУКЕНГШЩЗХЪ","ФЫВАПРОЛДЖЭ","ЯЧСМИТЬБЮ"];
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    for (let l of row) {
      let btn = document.createElement("button");
      btn.textContent = l;
      btn.onclick = () => checkLetter(l.toLowerCase(), btn);
      rowDiv.appendChild(btn);
    }
    container.appendChild(rowDiv);
  });
}

function checkLetter(letter, btn) {
  if (btn) btn.disabled = true;
  if (word.includes(letter)) {
    for (let i=0;i<word.length;i++) if (word[i]==letter) guessed[i]=letter;
    updateWord();
    if (btn) btn.classList.add("correct"); // green
    if (!guessed.includes("_")) endGame(true);
  } else {
    attempts--;
    updateAttempts();
    drawHangman();
    if (btn) btn.classList.add("wrong");   // red
    if (attempts===0) endGame(false);
  }
}

function drawHangman() {
  const ctx = document.getElementById("game_board").getContext("2d");
  ctx.clearRect(0,0,250,300);

  // White in dark theme, dark gray in light theme
  ctx.strokeStyle = document.body.classList.contains("dark") ? "#fff" : "#333";
  ctx.lineWidth = 3;
  let errors = 10 - attempts;

  if (errors>0) ctx.strokeRect(20,280,200,10);
  if (errors>1) ctx.strokeRect(50,50,10,230);
  if (errors>2) ctx.strokeRect(50,50,120,10);
  if (errors>3) ctx.strokeRect(170,50,2,40);
  if (errors>4) { ctx.beginPath(); ctx.arc(170,100,20,0,Math.PI*2); ctx.stroke(); }
  if (errors>5) ctx.strokeRect(169,120,2,60);
  if (errors>6) { ctx.beginPath(); ctx.moveTo(170,130); ctx.lineTo(140,170); ctx.stroke(); }
  if (errors>7) { ctx.beginPath(); ctx.moveTo(170,130); ctx.lineTo(200,170); ctx.stroke(); }
  if (errors>8) { ctx.beginPath(); ctx.moveTo(170,180); ctx.lineTo(140,230); ctx.stroke(); }
  if (errors>9) { ctx.beginPath(); ctx.moveTo(170,180); ctx.lineTo(200,230); ctx.stroke(); }
}

function hint() {
  if (hintUsed) return;
  let hidden = [];
  for (let i=0;i<guessed.length;i++) if (guessed[i]==="_") hidden.push(i);
  if (hidden.length) {
    let i = hidden[Math.floor(Math.random()*hidden.length)];
    let btn = Array.from(document.querySelectorAll("#alfavit button"))
                   .find(b => b.textContent.toLowerCase() === word[i]);
    checkLetter(word[i], btn);
    hintUsed = true;
    document.getElementById("hintBtn").disabled = true;
  }
}

function endGame(win) {
  const resultText = document.getElementById("resultText");
  const wordReveal = document.getElementById("wordReveal");
  const newGameBtn = document.getElementById("newGameBtn");

  if (win) {
    resultText.textContent = "Victory!";
    resultText.className = "victory";
    wordReveal.textContent = "";
  } else {
    resultText.textContent = "Defeat!";
    resultText.className = "defeat";
    wordReveal.textContent = "The word was: " + word;
  }
  showScreen("result");

  // Focus positioning already handled in CSS; ensure button visible below text
  newGameBtn.style.display = "inline-block";
}

function newGame() {
  document.getElementById("wordInput").value="";
  // Reset hint button state for next game
  hintUsed = false;
  document.getElementById("hintBtn").disabled = false;
  showScreen("start");
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
  drawHangman();
});

// Keyboard input (Russian letters only)
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("game").classList.contains("active")) return;
  let letter = e.key.toLowerCase();
  if (/[а-яё]/.test(letter)) {
    let btn = Array.from(document.querySelectorAll("#alfavit button"))
                   .find(b => b.textContent.toLowerCase() === letter);
    if (btn && !btn.disabled) checkLetter(letter, btn);
  }
});
