const originalCanvas = document.getElementById("original-canvas");
const puzzleGrid = document.getElementById("puzzle-grid");
const piecesContainer = document.getElementById("pieces-container");

const newBoardBtn = document.getElementById("new-board-btn");
const resetBtn = document.getElementById("reset-btn");
const backBtn = document.getElementById("back-btn");

const placeSound = document.getElementById("place-sound");

const successModal = document.getElementById("success-modal");
const modalBackBtn = document.getElementById("modal-back-btn");
const modalNewBtn = document.getElementById("modal-new-btn");

const ctx = originalCanvas.getContext("2d");

const images = [
  "../assets/puzzle/puzzle1.jpg",
  "../assets/puzzle/puzzle2.jpg",
  "../assets/puzzle/puzzle3.webp",
  "../assets/puzzle/puzzle4.jpg",
  "../assets/puzzle/puzzle5.jpg",
    "../assets/puzzle/puzzle6.webp",
    "../assets/puzzle/puzzle7.webp",
    "../assets/puzzle/puzzle8.webp",
    "../assets/puzzle/puzzle9.webp",
    "../assets/puzzle/puzzle10.jpg"
];

const gridSize = 3;
const pieceSize = 120;
const canvasSize = gridSize * pieceSize;
originalCanvas.width = canvasSize;
originalCanvas.height = canvasSize;

let img = new Image();
let pieces = [];
let slots = [];
let draggedPiece = null;

function loadRandomImage() {
  img.src = images[Math.floor(Math.random() * images.length)];
}

function drawOriginalImage() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
}

function generateImagePieces() {
  pieces = [];
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvasSize;
  tempCanvas.height = canvasSize;
  const tctx = tempCanvas.getContext("2d");
  tctx.drawImage(img, 0, 0, canvasSize, canvasSize);

  for (let row=0; row<gridSize; row++){
    for (let col=0; col<gridSize; col++){
      const piece = document.createElement("canvas");
      piece.width = pieceSize;
      piece.height = pieceSize;
      piece.getContext("2d").drawImage(
        tempCanvas,
        col*pieceSize, row*pieceSize, pieceSize, pieceSize,
        0,0, pieceSize, pieceSize
      );
      piece.className = "piece";
      piece.draggable = true;
      piece.dataset.row = row;
      piece.dataset.col = col;
      piece.addEventListener("dragstart", ()=> draggedPiece = piece);
      pieces.push(piece);
    }
  }
}

function initGrid() {
  puzzleGrid.innerHTML = "";
  slots = [];
  for (let i=0; i<gridSize*gridSize; i++){
    const slot = document.createElement("div");
    slot.classList.add("grid-slot");
    slot.dataset.index = i;
    slot.addEventListener("dragover", e=> e.preventDefault());
    slot.addEventListener("drop", dropPiece);
    slots.push(slot);
    puzzleGrid.appendChild(slot);
  }
}

function placePieces() {
  piecesContainer.innerHTML = "";
  shuffle(pieces).forEach(piece => piecesContainer.appendChild(piece));
}

function dropPiece(e){
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot.children.length===0){
    slot.appendChild(draggedPiece);
    placeSound.play();
    checkCompletion();
  }
}

function checkCompletion(){
  let correct = true;
  slots.forEach((slot,i)=>{
    if(slot.children[0]){
      const piece = slot.children[0];
      const row = Math.floor(i/gridSize);
      const col = i%gridSize;
      if(piece.dataset.row!=row || piece.dataset.col!=col) correct=false;
    } else correct=false;
  });
  if(correct){
    successModal.style.display = "flex";
  }
}

function shuffle(array){ return array.sort(()=>Math.random()-0.5); }

function initPuzzle(newImage=false){
  if(newImage) loadRandomImage();
  img.onload = () => {
    drawOriginalImage();
    generateImagePieces();
    initGrid();
    placePieces();
  };
}

// Buttons
newBoardBtn.onclick = ()=> { successModal.style.display="none"; initPuzzle(true); };
resetBtn.onclick = () => {
  slots.forEach(slot => {
    if(slot.firstChild) slot.removeChild(slot.firstChild);
  });

  placePieces();
};
backBtn.onclick = ()=> history.back();
modalBackBtn.onclick = ()=> { successModal.style.display="none"; history.back(); };
modalNewBtn.onclick = ()=> { successModal.style.display="none"; initPuzzle(true); };

// Start game
initPuzzle(true);

AOS.init({duration: 800});

