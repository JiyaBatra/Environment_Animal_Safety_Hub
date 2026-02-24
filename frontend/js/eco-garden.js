// Demo plant species and decorations
const plantSpecies = [
  { name: "Sprout", stages: 3, unlock: 0, color: "#81c784" },
  { name: "Sunflower", stages: 4, unlock: 3, color: "#ffd600" },
  { name: "Cactus", stages: 3, unlock: 6, color: "#43a047" },
  { name: "Bonsai", stages: 4, unlock: 10, color: "#795548" },
  { name: "Cherry Blossom", stages: 4, unlock: 15, color: "#f06292" }
];
const decorations = [
  { name: "Garden Stone", unlock: 5 },
  { name: "Bird Bath", unlock: 12 }
];

const gardenCanvas = document.getElementById("gardenCanvas");
const plantBtn = document.getElementById("plantBtn");
const waterBtn = document.getElementById("waterBtn");
const logEcoActionBtn = document.getElementById("logEcoActionBtn");
const shareGardenBtn = document.getElementById("shareGardenBtn");
const unlockedInfo = document.getElementById("unlockedInfo");

// Garden state
let garden = JSON.parse(localStorage.getItem("ecoGarden") || "null") || {
  plants: [], // {species, stage, x, y, watered, growth, id}
  ecoActions: 0,
  unlocked: { species: [0], decorations: [] }
};

function saveGarden() {
  localStorage.setItem("ecoGarden", JSON.stringify(garden));
}

function unlockables() {
  // Unlock new species and decorations based on ecoActions
  let unlockedSpecies = [0];
  let unlockedDecor = [];
  for (let i = 1; i < plantSpecies.length; ++i) {
    if (garden.ecoActions >= plantSpecies[i].unlock) unlockedSpecies.push(i);
  }
  for (let i = 0; i < decorations.length; ++i) {
    if (garden.ecoActions >= decorations[i].unlock) unlockedDecor.push(i);
  }
  garden.unlocked = { species: unlockedSpecies, decorations: unlockedDecor };
}

function randomPos() {
  // Place plant randomly in canvas
  const w = gardenCanvas.offsetWidth || 350;
  const h = gardenCanvas.offsetHeight || 220;
  return {
    x: Math.floor(Math.random() * (w - 60) + 20),
    y: Math.floor(Math.random() * (h - 80) + 40)
  };
}

function addPlant() {
  unlockables();
  const unlocked = garden.unlocked.species;
  const idx = unlocked[Math.floor(Math.random() * unlocked.length)];
  const pos = randomPos();
  garden.plants.push({
    id: Date.now() + Math.random(),
    species: idx,
    stage: 0,
    x: pos.x,
    y: pos.y,
    watered: false,
    growth: 0
  });
  saveGarden();
  renderGarden();
}

function waterPlants() {
  garden.plants.forEach(p => {
    if (!p.watered && p.stage < plantSpecies[p.species].stages - 1) {
      p.watered = true;
      p.growth += 1;
    }
  });
  saveGarden();
  renderGarden();
}

function logEcoAction() {
  garden.ecoActions += 1;
  // Grow plants if watered
  garden.plants.forEach(p => {
    if (p.watered && p.stage < plantSpecies[p.species].stages - 1) {
      p.stage += 1;
      p.watered = false;
    }
  });
  unlockables();
  saveGarden();
  renderGarden();
  showUnlocks();
}

function showUnlocks() {
  let msg = [];
  plantSpecies.forEach((s, i) => {
    if (garden.ecoActions === s.unlock && i !== 0) msg.push(`Unlocked plant: ${s.name}`);
  });
  decorations.forEach((d, i) => {
    if (garden.ecoActions === d.unlock) msg.push(`Unlocked decoration: ${d.name}`);
  });
  unlockedInfo.textContent = msg.join(" | ");
  if (msg.length) setTimeout(() => { unlockedInfo.textContent = ""; }, 3500);
}

function renderGarden() {
  gardenCanvas.innerHTML = "";
  // Draw decorations
  garden.unlocked.decorations.forEach(i => {
    const d = decorations[i];
    const deco = document.createElement("div");
    deco.style.position = "absolute";
    deco.style.left = (30 + i * 60) + "px";
    deco.style.bottom = "10px";
    deco.style.width = "40px";
    deco.style.height = "40px";
    deco.style.background = i === 0 ? "#bdbdbd" : "#90caf9";
    deco.style.borderRadius = "50%";
    deco.style.opacity = 0.7;
    deco.title = d.name;
    gardenCanvas.appendChild(deco);
  });
  // Draw plants
  garden.plants.forEach(p => {
    const s = plantSpecies[p.species];
    const plant = document.createElement("div");
    plant.className = "plant plant-anim";
    plant.style.position = "absolute";
    plant.style.left = p.x + "px";
    plant.style.top = p.y + "px";
    plant.style.width = "36px";
    plant.style.height = "60px";
    plant.style.transition = "top 0.7s, left 0.7s";
    // Animated growth: scale by stage
    plant.style.transform = `scale(${0.7 + 0.3 * (p.stage + 1)})`;
    plant.style.zIndex = 2 + p.stage;
    // Plant visual (simple SVG or emoji for demo)
    let emoji = "🌱";
    if (s.name === "Sunflower") emoji = "🌻";
    if (s.name === "Cactus") emoji = "🌵";
    if (s.name === "Bonsai") emoji = "🎍";
    if (s.name === "Cherry Blossom") emoji = "🌸";
    plant.innerHTML = `<span style='font-size:${30 + p.stage * 6}px;display:block;text-align:center;'>${emoji}</span>`;
    // Water drop if watered
    if (p.watered) {
      plant.innerHTML += `<span style='font-size:18px;position:absolute;left:18px;top:0;'>💧</span>`;
    }
    plant.title = `${s.name} (Stage ${p.stage + 1}/${s.stages})`;
    gardenCanvas.appendChild(plant);
  });
}

plantBtn.onclick = addPlant;
waterBtn.onclick = waterPlants;
logEcoActionBtn.onclick = logEcoAction;

// Share garden as image
shareGardenBtn.onclick = () => {
  const w = gardenCanvas.offsetWidth || 350;
  const h = gardenCanvas.offsetHeight || 220;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  // Background
  ctx.fillStyle = "#a5d6a7";
  ctx.fillRect(0, 0, w, h);
  // Decorations
  garden.unlocked.decorations.forEach(i => {
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(50 + i * 60, h - 30, 20, 0, 2 * Math.PI);
    ctx.fillStyle = i === 0 ? "#bdbdbd" : "#90caf9";
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  // Plants
  garden.plants.forEach(p => {
    const s = plantSpecies[p.species];
    let emoji = "🌱";
    if (s.name === "Sunflower") emoji = "🌻";
    if (s.name === "Cactus") emoji = "🌵";
    if (s.name === "Bonsai") emoji = "🎍";
    if (s.name === "Cherry Blossom") emoji = "🌸";
    ctx.font = `${30 + p.stage * 6}px Segoe UI Emoji, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(emoji, p.x + 18, p.y + 50);
    if (p.watered) {
      ctx.font = "18px Segoe UI Emoji, Arial";
      ctx.fillText("💧", p.x + 32, p.y + 20);
    }
  });
  // Download
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = `eco-garden.png`;
  a.click();
};

// Initial render
unlockables();
renderGarden();
showUnlocks();
