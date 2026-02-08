// Wildlife Rescue Adventure Game JS
// Handles map, missions, animated scenes, and rescued animals gallery (LocalStorage)

const GAME_MISSIONS = [
  {
    id: 1,
    name: "Clean the River",
    area: "Riverbank",
    lesson: "Keeping rivers clean helps all wildlife!",
    animal: { name: "Otter", emoji: "🦦" },
    collectible: "River Pebble",
    animation: "🌊🧹🦦"
  },
  {
    id: 2,
    name: "Rescue the Turtle",
    area: "Beach",
    lesson: "Plastic waste harms sea turtles. Always dispose of trash properly.",
    animal: { name: "Sea Turtle", emoji: "🐢" },
    collectible: "Shell",
    animation: "🏖️🧤🐢"
  },
  {
    id: 3,
    name: "Plant Trees",
    area: "Forest",
    lesson: "Trees provide homes for many animals and clean our air!",
    animal: { name: "Owl", emoji: "🦉" },
    collectible: "Leaf",
    animation: "🌳🌱🦉"
  }
];

let wildlifeData = JSON.parse(localStorage.getItem("wildlifeGameData") || "null") || {
  unlockedAreas: ["Riverbank"],
  completedMissions: [],
  rescuedAnimals: [],
  collectibles: []
};

function saveWildlifeData() {
  localStorage.setItem("wildlifeGameData", JSON.stringify(wildlifeData));
}

function renderMap() {
  const map = document.getElementById("wildlifeMap");
  map.innerHTML = "";
  ["Riverbank", "Beach", "Forest"].forEach(area => {
    const btn = document.createElement("button");
    btn.className = "mission-btn";
    btn.textContent = area;
    btn.disabled = !wildlifeData.unlockedAreas.includes(area);
    btn.onclick = () => showMissions(area);
    map.appendChild(btn);
  });
}

function showMissions(area) {
  const list = document.getElementById("missionList");
  list.innerHTML = GAME_MISSIONS.filter(m => m.area === area).map(m => {
    const done = wildlifeData.completedMissions.includes(m.id);
    return `<button class='mission-btn' onclick='startMission(${m.id})' ${done ? "disabled style='background:#bdbdbd;'" : ""}>${m.name} ${done ? "✔️" : ""}</button>`;
  }).join("") || "<span style='color:#aaa;'>No missions here yet</span>";
  document.getElementById("missionDetails").innerHTML = "";
}

function startMission(id) {
  const mission = GAME_MISSIONS.find(m => m.id === id);
  if (!mission) return;
  // Show mission details and start button
  document.getElementById("missionDetails").innerHTML = `
    <div style='margin:0.5rem 0;'><b>${mission.name}</b></div>
    <div>${mission.lesson}</div>
    <button class='mission-btn' onclick='completeMission(${id})'>Complete Mission</button>
  `;
  // Show animation
  animateScene(mission.animation);
}

function animateScene(anim) {
  const scene = document.getElementById("animatedScene");
  scene.innerHTML = `<div style='font-size:2rem;animation:bounce 1.2s;'>${anim}</div>`;
  setTimeout(() => { scene.innerHTML = ""; }, 1800);
}

function completeMission(id) {
  const mission = GAME_MISSIONS.find(m => m.id === id);
  if (!mission) return;
  if (!wildlifeData.completedMissions.includes(id)) {
    wildlifeData.completedMissions.push(id);
    wildlifeData.rescuedAnimals.push(mission.animal);
    wildlifeData.collectibles.push(mission.collectible);
    // Unlock next area
    if (mission.area === "Riverbank") wildlifeData.unlockedAreas.push("Beach");
    if (mission.area === "Beach") wildlifeData.unlockedAreas.push("Forest");
    saveWildlifeData();
    renderMap();
    renderGallery();
    showMissions(mission.area);
    document.getElementById("missionDetails").innerHTML = `<div style='color:#388e3c;font-weight:600;'>Mission Complete! You rescued a ${mission.animal.name} ${mission.animal.emoji} and found a ${mission.collectible}.</div>`;
  }
}

function renderGallery() {
  const div = document.getElementById("rescuedAnimals");
  if (!wildlifeData.rescuedAnimals.length) {
    div.innerHTML = "<span style='color:#aaa;'>No animals rescued yet</span>";
    return;
  }
  div.innerHTML = wildlifeData.rescuedAnimals.map(a => `<span class='rescued-animal' title='${a.name}'>${a.emoji} ${a.name}</span>`).join("");
}

// Initial render
renderMap();
renderGallery();
window.showMissions = showMissions;
window.startMission = startMission;
window.completeMission = completeMission;
