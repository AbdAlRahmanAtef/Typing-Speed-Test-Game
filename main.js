const easyLevelWords = [
  "Hello",
  "Code",
  "Town",
  "Country",
  "Github",
  "Python",
  "Scala",
  "Funny",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
];
const normalLevelWords = [
  "Javascript",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Leetcode",
  "Internet",
  "Paradigm",
  "Styling",
  "Cascade",
  "Coding",
  "Working",
  "Playing",
];
const hardLevelWords = [
  "Programming",
  "Destructuring",
  "Documentation",
  "Dependencies",
];
let level = {
  Easy: 6,
  Normal: 5,
  Hard: 4,
};
let playingDificulty;
let selectLevel = document.querySelector("select");
let levelSpan = document.querySelector(".lvl");
let durationSpan = document.querySelector(".seconds");
let input = document.querySelector(".input");
let upcomingWord = document.querySelector(".upcoming-words");
let time = document.querySelector(".time span");
let gotScore = document.querySelector(".score .got");
let result = document.querySelector(".finish");
let total = document.querySelector(".total");
let start = document.querySelector(".start");
let currentWord = document.querySelector(".the-word");
let currentLevel = "Easy";
let currentlevelSeconds;

if (window.localStorage.getItem("time")) {
  document
    .querySelector(`[data-value="${window.localStorage.getItem("time")}"]`)
    .setAttribute("selected", "selected");
  currentLevel = selectLevel.options[selectLevel.selectedIndex].innerHTML;
  levelSpan.innerHTML = currentLevel;
  currentlevelSeconds = level[currentLevel];
  time.innerHTML = currentlevelSeconds;
  durationSpan.innerHTML = currentlevelSeconds;
  playingMood();
}
selectLevel.onchange = function () {
  currentLevel = selectLevel.options[selectLevel.selectedIndex].innerHTML;
  levelSpan.innerHTML = currentLevel;
  currentlevelSeconds = level[currentLevel];
  durationSpan.innerHTML = currentlevelSeconds;
  gotScore.innerHTML = "0";
  playingMood();
  window.localStorage.setItem(
    "time",
    selectLevel.options[selectLevel.selectedIndex].dataset.value
  );
};
// Determine The Defficulty
function playingMood() {
  if (currentLevel === "Easy") {
    playingDificulty = easyLevelWords;
  } else if (currentLevel === "Normal") {
    playingDificulty = normalLevelWords;
  } else {
    playingDificulty = hardLevelWords;
  }
  total.innerHTML = playingDificulty.length;
}
window.onload = function () {
  selectLevel.focus();
};
// Avoid Past
input.onpaste = () => {
  return false;
};

let subCounter = 0;
// Start The Game
let countDown = document.querySelector(".count-down");
let span = document.querySelector(".count-down span");
let span2 = document.querySelector(".count-down .show");
start.onclick = function () {
  start.remove();
  document.querySelector(".landing").style.display = "none";
  let counter = "4";
  span.innerHTML = counter;
  span2.innerHTML = "Three";
  countDown.style.display = "block";
  let interval = setInterval(() => {
    span.innerHTML--;
    if (span.innerHTML === "3") {
      span2.innerHTML = "Two";
    } else if (span.innerHTML === "2") {
      span2.innerHTML = "One";
    } else if (span.innerHTML === "1") {
      span2.innerHTML = "Go";
    } else {
      clearInterval(interval);
      countDown.style.display = "none";
      input.style.display = "block";
      input.focus();
      genWord();
      let subTime = setInterval(() => {
        subCounter++;
        console.log(subCounter);
        if (playingDificulty.length === 0 && currentWord.innerHTML === "") {
          clearInterval(subTime);
        }
      }, 1000);
      upcomingWord.style.opacity = "1";
      document.querySelector(".control").style.opacity = "1";
      selectLevel.style.display = "none";
    }
  }, 1000);
};

// Genetate Word
function genWord() {
  // Create Random Word
  let randomWord =
    playingDificulty[Math.floor(Math.random() * playingDificulty.length)];
  // Append The Random Word
  currentWord.innerHTML = randomWord;
  // Remove The Word Form Array
  let index = playingDificulty.indexOf(randomWord);
  playingDificulty.splice(index, 1);
  // Clear Upcomming playingDificulty Containe
  upcomingWord.innerHTML = "";
  // Show Upcoming playingDificulty
  Upcoming();
  // Reset Time
  // Start Playing
  startPlaying();
}

// Upcoming playingDificulty
function Upcoming() {
  for (let i = 0; i < playingDificulty.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = playingDificulty[i];
    upcomingWord.append(div);
  }
  if (playingDificulty.length === 0 && currentWord.innerHTML === "") {
    upcomingWord.style.display = "none";
  }
}
// Start Playin
function startPlaying() {
  // Reset Time
  time.innerHTML = currentlevelSeconds;
  // Count Down
  let start = setInterval(() => {
    time.innerHTML--;
    if (time.innerHTML === "0") {
      clearInterval(start);
      // Compare The Words
      if (currentWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        gotScore.innerHTML++;
        // Clear Input Field
        input.value = "";
        // Generate New word
        if (playingDificulty.length > 0) {
          genWord();
        } else {
          document.querySelector(".checkmark").style.display = "block";
          let control = document.querySelector(".control")
          result.style.display = "none";
          control.className = "avarage";
          control.innerHTML = `${Math.trunc((+gotScore.innerHTML / +subCounter) * 60)} W / Min`;
          currentWord.innerHTML = "";
          tryAgain();
        }
        // Show The Result
      } else {
        let span = document.createElement("span");
        span.className = "bad";
        let spanText = document.createTextNode("Game Over");
        span.appendChild(spanText);
        result.appendChild(span);
        // Restart The Game
        tryAgain();
      }
    } else {
      toNext(start);
    }
  }, 1000);
}

function toNext(interval) {
  input.onkeyup = function (e) {
    if (e.key === "Enter") {
      clearInterval(interval);
      if (currentWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        gotScore.innerHTML++;
        // Clear Input Field
        input.value = "";
        // Generate New word
        if (playingDificulty.length > 0) {
          genWord();
        } else {
          document.querySelector(".checkmark").style.display = "block";
          let control = document.querySelector(".control")
          result.style.display = "none";
          control.className = "avarage";
          control.innerHTML = `${Math.trunc((+gotScore.innerHTML / +subCounter) * 60)} W / Min`;
          input.onkeyup = false;
          currentWord.innerHTML = "";
          input.style.display = "none";
          tryAgain();
        }
        // Show The Result
      } else {
        let span = document.createElement("span");
        span.className = "bad";
        let spanText = document.createTextNode("Game Over");
        span.appendChild(spanText);
        result.appendChild(span);
        // Restart The Game
        input.onkeyup = false;
        tryAgain();
      }
    }
  };
}
// Restart The Game
function tryAgain() {
  let btn = document.createElement("button");
  btn.className = "try-again";
  btn.append(document.createTextNode("Play Again"));
  document.querySelector(".container").append(btn);
  btn.onclick = () => {
    window.location.reload();
  };
  input.onkeyup = false;
}
