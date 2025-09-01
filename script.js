const board = document.getElementById("game-board");
const restartBtn = document.getElementById("restart");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level-text");

const bgMusic = document.getElementById("bg-music");
const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const mismatchSound = document.getElementById("mismatch-sound");
const winSound = document.getElementById("win-sound");
const failSound = document.getElementById("fail-sound"); // ✅ fixed

// Example card images
const images = [
  "https://tse3.mm.bing.net/th/id/OIP.OVY0P-q5ILWdfljHlAt9AwHaJ4?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.emg2hmTKkY0r1rI2Z4nixwHaIy?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.DeeuO4HgbipGdbWqitsWNAHaES?pid=Api&P=0&h=180",
  "https://tse3.mm.bing.net/th/id/OIP.Ie1cTnmneGcV_9w18WWULQHaJQ?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.eyBu2fG5l6hPhFXE5C-W3AHaLE?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.s9oi6OcOnRDYyxxbe4h1_AHaLH?pid=Api&P=0&h=180"
];

let flippedCards = [];
let matchedPairs = 0;
let level = 1;
let timeLeft = 40; // ⏳ reduced time per level
let timer;

function startGame() {
  board.innerHTML = "";
  matchedPairs = 0;
  flippedCards = [];
  timeLeft = 40; // reset shorter timer
  timeEl.textContent = `Time Left: ${timeLeft}s`;
  clearInterval(timer);

  // 🎵 Background music
  bgMusic.volume = 0.2; // lower volume
  bgMusic.currentTime = 0;
  bgMusic.play();

  // Timer countdown
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      failSound.play(); // 🔊 fail sound
      alert(`⏰ Time's up! Level ${level} failed!`);
      startGame(); // restart same level
    }
  }, 1000);

  // Duplicate & shuffle images
  let gameImages = [...images, ...images];
  gameImages.sort(() => 0.5 - Math.random());

  gameImages.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><img src="${img}" /></div>
        <div class="card-back"></div>
      </div>`;
    card.addEventListener("click", () => flipCard(card, img));
    board.appendChild(card);
  });
}

function flipCard(card, img) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flipSound.play();
    flippedCards.push({ card, img });

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 700);
    }
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.img === second.img) {
    matchSound.play();
    matchedPairs++;
    if (matchedPairs === images.length) {
      clearInterval(timer);
      winSound.play(); // 🔊 level complete sound
      alert(`🎉 Level ${level} completed with ${timeLeft}s left!`);
      level++;
      levelEl.textContent = `Level: ${level}`;
      startGame();
    }
  } else {
    mismatchSound.play();
    first.card.classList.remove("flipped");
    second.card.classList.remove("flipped");
  }
  flippedCards = [];
}

restartBtn.addEventListener("click", startGame);

startGame();
