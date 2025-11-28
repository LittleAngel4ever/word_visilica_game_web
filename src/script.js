const themes = {
  "Погода": ["дождь","снег","ветер","град","туман"],
  "Города": ["минск","москва","берлин","париж","киев"],
  "Животные": ["тигр","слон","кошка","собака","орел"],
  "Фрукты": ["яблоко","банан","груша","апельсин","виноград"],
  "Спорт": ["футбол","теннис","хоккей","бокс","шахматы"]
};

let word = "", guessed = [], attempts = 10;
let hintUsed = false;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame() {
  word = document.getElementById("wordInput").value.toLowerCase();
  initGame();
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
  createAlphabet();
  showScreen("game");
}

function updateWord() {
  document.getElementById("wordDisplay").textContent = guessed.join(" ");
}

function updateAttempts() {
  document.getElementById("attemptsDisplay").textContent = "Осталось попыток: " + attempts;
}

function createAlphabet() {
  const container = document.getElementById("alphabet");
  container.innerHTML = "";
  const letters = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ";
  for (let l of letters) {
    let btn = document.createElement("button");
    btn.textContent = l;
    btn.onclick = () => checkLetter(l.toLowerCase(), btn);
    container.appendChild(btn);
  }
}

function checkLetter(letter, btn) {
  if (btn) btn.disabled = true;
  if (word.includes(letter)) {
    for (let i=0;i<word.length;i++) if (word[i]==letter) guessed[i]=letter;
    updateWord();
    if (!guessed.includes("_")) endGame(true);
  } else {
    attempts--;
    updateAttempts();
    drawHangman();
    if (attempts===0) endGame(false);
  }
}

function drawHangman() {
  const ctx = document.getElementById("hangman").getContext("2d");
  ctx.clearRect(0,0,200,250);
  ctx.strokeStyle = "#fff";   
  ctx.fillStyle = "#fff";    
  let errors = 10 - attempts;

  if (errors>0) ctx.fillRect(20,230,160,10);
  if (errors>1) ctx.fillRect(50,50,10,180);
  if (errors>2) ctx.fillRect(50,50,100,10);
  if (errors>3) ctx.fillRect(150,50,2,30);
  if (errors>4) { ctx.beginPath(); ctx.arc(150,90,20,0,Math.PI*2); ctx.stroke(); }
  if (errors>5) ctx.fillRect(149,110,2,50);
  if (errors>6) { ctx.beginPath(); ctx.moveTo(150,120); ctx.lineTo(120,150); ctx.stroke(); }
  if (errors>7) { ctx.beginPath(); ctx.moveTo(150,120); ctx.lineTo(180,150); ctx.stroke(); }
  if (errors>8) { ctx.beginPath(); ctx.moveTo(150,160); ctx.lineTo(120,200); ctx.stroke(); }
  if (errors>9) { ctx.beginPath(); ctx.moveTo(150,160); ctx.lineTo(180,200); ctx.stroke(); }
}


function hint() {
  if (hintUsed) return;
  let hidden = [];
  for (let i=0;i<guessed.length;i++) if (guessed[i]==="_") hidden.push(i);
  if (hidden.length) {
    let i = hidden[Math.floor(Math.random()*hidden.length)];
    let btn = Array.from(document.querySelectorAll("#alphabet button"))
                   .find(b => b.textContent.toLowerCase() === word[i]);
    checkLetter(word[i], btn);
    hintUsed = true;
    document.getElementById("hintBtn").disabled = true;
  }
}

function endGame(win) {
  document.getElementById("resultText").textContent = win ? "Победа!" : "Поражение... Слово было: "+word;
  showScreen("result");
}

function newGame() {
  document.getElementById("wordInput").value="";
  showScreen("start");
}

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("game").classList.contains("active")) return;

  let letter = e.key.toLowerCase();

  if (/[а-яё]/.test(letter)) {
    let btn = Array.from(document.querySelectorAll("#alphabet button"))
                   .find(b => b.textContent.toLowerCase() === letter);

    if (btn && !btn.disabled) {
      checkLetter(letter, btn);
    }
  }
});