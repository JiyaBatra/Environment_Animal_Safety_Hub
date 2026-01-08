const animals = [
  { name: "Lion", emoji: "🦁", type: "carn" },
  { name: "Tiger", emoji: "🐯", type: "carn" },
  { name: "Leopard", emoji: "🐆", type: "carn" },
  { name: "Wolf", emoji: "🐺", type: "carn" },
  { name: "Fox", emoji: "🦊", type: "carn" },
  { name: "Crocodile", emoji: "🐊", type: "carn" },
  { name: "Snake", emoji: "🐍", type: "carn" },
  { name: "Eagle", emoji: "🦅", type: "carn" },
  { name: "Owl", emoji: "🦉", type: "carn" },
  { name: "Shark", emoji: "🦈", type: "carn" },

  { name: "Cow", emoji: "🐄", type: "herb" },
  { name: "Goat", emoji: "🐐", type: "herb" },
  { name: "Deer", emoji: "🦌", type: "herb" },
  { name: "Horse", emoji: "🐎", type: "herb" },
  { name: "Elephant", emoji: "🐘", type: "herb" },
  { name: "Rabbit", emoji: "🐇", type: "herb" },
  { name: "Giraffe", emoji: "🦒", type: "herb" },
  { name: "Panda", emoji: "🐼", type: "herb" },
  { name: "Camel", emoji: "🐫", type: "herb" },
  { name: "Sheep", emoji: "🐑", type: "herb" },

  { name: "Bear", emoji: "🐻", type: "omni" },
  { name: "Monkey", emoji: "🐵", type: "omni" },
  { name: "Pig", emoji: "🐷", type: "omni" },
  { name: "Dog", emoji: "🐕", type: "omni" },
  { name: "Cat", emoji: "🐈", type: "omni" },
  { name: "Crow", emoji: "🐦‍⬛", type: "omni" },
  { name: "Hen", emoji: "🐔", type: "omni" },
  { name: "Duck", emoji: "🦆", type: "omni" },
  { name: "Rat", emoji: "🐀", type: "omni" },
  { name: "Human", emoji: "🧑", type: "omni" }
];

animals.sort(() => Math.random() - 0.5);

let index = 0;
let correct = 0;
let wrong = 0;
let time = 60;

const animalEl = document.getElementById("animal");
const animalName = document.getElementById("animalName");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const timerEl = document.getElementById("time");

function loadAnimal() {
  if (index >= animals.length) {
    endGame();
    return;
  }

  const a = animals[index];
  animalEl.textContent = a.emoji;
  animalName.textContent = `${a.name}`;
  animalEl.style.opacity = "1";
}

animalEl.addEventListener("dragstart", () => {
  animalEl.classList.add("dragging");
});

animalEl.addEventListener("dragend", () => {
  animalEl.classList.remove("dragging");
});

document.querySelectorAll(".box").forEach(box => {
  box.addEventListener("dragover", e => e.preventDefault());

  box.addEventListener("drop", () => {
    checkAnswer(box.dataset.type, box);
  });
});

function checkAnswer(type, box) {
  const current = animals[index];

  // Remove any previous glow
  document.querySelectorAll(".box").forEach(b =>
    b.classList.remove("correct", "wrong")
  );

  if (type === current.type) {
    correct++;
    box.classList.add("correct");

    correctSound.currentTime = 0;
    correctSound.play();

    setTimeout(() => {
        correctSound.pause();
        correctSound.currentTime = 0;
    }, 1000);
    } else {
        wrong++;
        box.classList.add("wrong");

        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    setTimeout(() => {
        box.classList.remove("correct", "wrong");
    }, 1000);

    animalEl.style.opacity = "0";

    setTimeout(() => {
        index++;
        loadAnimal();
    }, 800);
}


const timer = setInterval(() => {
  time--;
  const m = String(Math.floor(time / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;

  if (time <= 0) {
    clearInterval(timer);
    endGame();
  }
}, 1000);

function endGame() {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("correctCount").textContent = correct;
  document.getElementById("wrongCount").textContent = wrong;
  correctSound.play();
}

function restart() {
  location.reload();
}

function goBack() {
  window.history.back();
}

loadAnimal();
