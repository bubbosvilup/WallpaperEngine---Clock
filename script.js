const timeText = document.getElementById("time");
const secondsText = document.getElementById("seconds");
const amPmText = document.getElementById("amPm");
const dateText = document.getElementById("date");
const menuButton = document.getElementById("menuButton");
const settingsMenu = document.getElementById("settingsMenu");
const blurOverlay = document.getElementById("blurOverlay");

function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const amPm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  timeText.innerHTML = `${displayHours}:${minutes}`;
  secondsText.innerHTML = `${seconds}`;
  amPmText.innerHTML = `${amPm}`;
  dateText.innerHTML = `${day}/${month}/${year}`;
}

menuButton.addEventListener("click", () => {
  settingsMenu.classList.toggle("visible");
  settingsMenu.classList.toggle("hidden");
  blurOverlay.classList.toggle("visible");
});

const closeMenuButton = document.getElementById("closeMenuButton");

closeMenuButton.addEventListener("click", () => {
  settingsMenu.classList.remove("visible");
  settingsMenu.classList.add("hidden");
  blurOverlay.classList.remove("visible");
});

const secondsElement = document.getElementById("seconds");
const wordleOverlay = document.getElementById("wordleOverlay");
const wordleGrid = document.getElementById("wordleGrid");
const closeWordleButton = document.getElementById("closeWordleButton");
const gameMessage = document.getElementById("gameMessage");

// Funzione per mostrare il messaggio di gioco
function showGameMessage(message, isWin) {
  gameMessage.textContent = message;
  gameMessage.classList.add("show");
  if (isWin) {
    triggerConfetti();
  }
  setTimeout(() => {
    gameMessage.classList.remove("show");
  }, 3000);
}

// Nasconde il messaggio dopo 3 secondi
setTimeout(() => {
  gameMessage.classList.remove("show");
}, 3000);

// Effetto confetti per la vittoria
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

const secretWords = ["apple", "dream", "light", "brave", "stone"];
let secretWord = secretWords[Math.floor(Math.random() * secretWords.length)];
let currentGuess = "";
let attempts = 0;

// Funzione per mostrare il minigioco
function openWordleGame() {
  wordleOverlay.classList.add("visible");
  document.body.classList.add("blurred");
  resetGame();
}

// Funzione per chiudere il minigioco
function closeWordleGame() {
  wordleOverlay.classList.remove("visible");
  document.body.classList.remove("blurred");
}

// Reset del gioco
function resetGame() {
  wordleGrid.innerHTML = "";
  attempts = 0;
  secretWord = secretWords[Math.floor(Math.random() * secretWords.length)];
  createNewRow();
}

// Creazione di una nuova riga
function createNewRow() {
  for (let i = 0; i < 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("wordle-cell");
    wordleGrid.appendChild(cell);
  }
}

// Controllo della parola inserita
function checkGuess(guess) {
  const cells = Array.from(wordleGrid.children).slice(
    attempts * 5,
    attempts * 5 + 5
  );
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (letter === secretWord[i]) {
      cells[i].classList.add("correct");
    } else if (secretWord.includes(letter)) {
      cells[i].classList.add("misplaced");
    } else {
      cells[i].classList.add("wrong");
    }
    cells[i].textContent = letter;
  }

  if (guess === secretWord) {
    showGameMessage("🎉 Hai vinto! 🎉", true);
    setTimeout(closeWordleGame, 3500); // Chiudi il gioco dopo aver mostrato il messaggio
  } else if (++attempts === 6) {
    showGameMessage(`❌ Hai perso! La parola era: ${secretWord}`, false);
    setTimeout(closeWordleGame, 3500); // Chiudi il gioco dopo aver mostrato il messaggio
  } else {
    createNewRow();
  }
}

// Eventi
secondsElement.addEventListener("click", openWordleGame);
closeWordleButton.addEventListener("click", closeWordleGame);

// Ascolta i tasti premuti
document.addEventListener("keydown", (e) => {
  if (!wordleOverlay.classList.contains("visible")) return;

  const key = e.key.toLowerCase();

  if (key === "backspace" && currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
  } else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
    currentGuess += key;
    updateCurrentRow();
  } else if (key === "enter" && currentGuess.length === 5) {
    checkGuess(currentGuess);
    currentGuess = "";
  }
});

// Aggiorna la riga corrente con la parola digitata
function updateCurrentRow() {
  const cells = Array.from(wordleGrid.children).slice(
    attempts * 5,
    attempts * 5 + 5
  );
  for (let i = 0; i < 5; i++) {
    cells[i].textContent = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
  }
}

setInterval(getTime, 999);
getTime();
