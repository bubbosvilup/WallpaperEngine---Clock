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

setInterval(getTime, 999);
getTime();
