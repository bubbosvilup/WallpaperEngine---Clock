// Modifiche al file script.js
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
setTimeout(() => {
  gameMessage.classList.remove("show");
}, 3000);

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

const secretWords = [
  "apple",
  "dream",
  "light",
  "brave",
  "stone",
  "chair",
  "table",
  "phone",
  "clock",
  "glass",
  "plate",
  "knife",
  "spoon",
  "forge",
  "shelf",
  "beach",
  "ocean",
  "cloud",
  "river",
  "plant",
  "sunny",
  "rainy",
  "storm",
  "woods",
  "grass",
  "happy",
  "angry",
  "peace",
  "laugh",
  "smile",
  "sleep",
  "awake",
  "tired",
  "relax",
  "focus",
  "pizza",
  "pasta",
  "bread",
  "sweet",
  "candy",
  "water",
  "juice",
  "wine",
  "salad",
  "fruit",
  "music",
  "dance",
  "paint",
  "robot",
  "ghost",
  "magic",
  "paper",
  "money",
  "world",
  "space",
  "heart",
  "brain",
  "smart",
  "power",
  "quick",
  "build",
  "quiet",
  "giant",
  "small",
  "begin",
];

let secretWord = secretWords[Math.floor(Math.random() * secretWords.length)];
let currentGuess = "";
let attempts = 0;
let letterStates = {};

function openWordleGame() {
  wordleOverlay.classList.add("visible");
  document.body.classList.add("blurred");
  resetGame();
  createVirtualKeyboard();
}

function closeWordleGame() {
  wordleOverlay.classList.remove("visible");
  document.body.classList.remove("blurred");
  const keyboard = document.getElementById("virtualKeyboard");
  if (keyboard) {
    keyboard.remove();
  }
}

function resetGame() {
  wordleGrid.innerHTML = "";
  attempts = 0;
  currentGuess = "";
  letterStates = {};
  secretWord = secretWords[Math.floor(Math.random() * secretWords.length)];
  createNewRow();
}

function createNewRow() {
  for (let i = 0; i < 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("wordle-cell");
    wordleGrid.appendChild(cell);
  }
}

function checkGuess(guess) {
  if (guess.length !== 5) return;

  const cells = Array.from(wordleGrid.children).slice(
    attempts * 5,
    attempts * 5 + 5
  );

  const letterCounts = {};
  for (let i = 0; i < secretWord.length; i++) {
    letterCounts[secretWord[i]] = (letterCounts[secretWord[i]] || 0) + 1;
  }

  let markedCorrect = new Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    if (letter === secretWord[i]) {
      cells[i].classList.add("correct");
      markedCorrect[i] = true;
      letterCounts[letter]--;

      letterStates[letter] = "correct";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (markedCorrect[i]) continue;

    const letter = guess[i];

    if (letterCounts[letter] > 0) {
      cells[i].classList.add("misplaced");
      letterCounts[letter]--;

      if (letterStates[letter] !== "correct") {
        letterStates[letter] = "misplaced";
      }
    } else {
      cells[i].classList.add("wrong");

      if (!letterStates[letter]) {
        letterStates[letter] = "wrong";
      }
    }

    cells[i].textContent = letter;
  }

  updateKeyboardColors();

  if (guess === secretWord) {
    showGameMessage("🎉 You won! 🎉", true);
    setTimeout(closeWordleGame, 3500);
  } else if (++attempts === 6) {
    showGameMessage(`❌ You lost! the word was: ${secretWord}`, false);
    setTimeout(closeWordleGame, 3500);
  } else {
    createNewRow();
    currentGuess = "";
  }
}

function updateKeyboardColors() {
  // update the color of keys
  const keys = document.querySelectorAll(".keyboard-key:not(.enter-key)");
  keys.forEach((key) => {
    const letter = key.textContent.toLowerCase();
    if (letter === "⌫") return;

    //remove classes
    key.classList.remove("key-correct", "key-misplaced", "key-wrong");

    // class based on status
    if (letterStates[letter] === "correct") {
      key.classList.add("key-correct");
    } else if (letterStates[letter] === "misplaced") {
      key.classList.add("key-misplaced");
    } else if (letterStates[letter] === "wrong") {
      key.classList.add("key-wrong");
    }
  });
}

function createVirtualKeyboard() {
  const existingKeyboard = document.getElementById("virtualKeyboard");
  if (existingKeyboard) {
    existingKeyboard.remove();
  }

  const keyboard = document.createElement("div");
  keyboard.id = "virtualKeyboard";

  // qwerty
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", "⌫"],
  ];

  rows.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.forEach((key) => {
      const keyButton = document.createElement("button");
      keyButton.classList.add("keyboard-key");
      keyButton.textContent = key.toUpperCase();

      // delete status prev
      if (key !== "⌫" && letterStates[key]) {
        keyButton.classList.add(`key-${letterStates[key]}`);
      }

      keyButton.addEventListener("click", () => {
        if (key === "⌫") {
          // Backspace
          if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
          }
        } else if (currentGuess.length < 5) {
          // Add letter
          currentGuess += key;
        }

        updateCurrentRow();

        // this check right word
        if (currentGuess.length === 5) {
          const enterButton = document.getElementById("enterButton");
          enterButton.classList.add("enter-active");
        } else {
          const enterButton = document.getElementById("enterButton");
          if (enterButton) {
            enterButton.classList.remove("enter-active");
          }
        }
      });

      rowDiv.appendChild(keyButton);
    });

    keyboard.appendChild(rowDiv);
  });

  // Aggiungi pulsante ENTER
  const enterRow = document.createElement("div");
  enterRow.classList.add("keyboard-row");

  const enterButton = document.createElement("button");
  enterButton.textContent = "ENTER";
  enterButton.id = "enterButton";
  enterButton.classList.add("keyboard-key", "enter-key");
  enterButton.addEventListener("click", () => {
    if (currentGuess.length === 5) {
      checkGuess(currentGuess);
      currentGuess = "";
      enterButton.classList.remove("enter-active");
    }
  });

  enterRow.appendChild(enterButton);
  keyboard.appendChild(enterRow);

  const wordleGame = document.getElementById("wordleGame");
  wordleGame.appendChild(keyboard);
}

function updateCurrentRow() {
  const cells = Array.from(wordleGrid.children).slice(
    attempts * 5,
    attempts * 5 + 5
  );
  for (let i = 0; i < 5; i++) {
    cells[i].textContent = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
  }
}

secondsElement.addEventListener("click", openWordleGame);
closeWordleButton.addEventListener("click", closeWordleGame);

setInterval(getTime, 999);
getTime();
