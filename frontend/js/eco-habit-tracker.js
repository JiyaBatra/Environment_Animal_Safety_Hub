// Eco Habit Tracker & Rewards JS
// Handles habits, logging, streaks, badges, analytics, and achievement card (LocalStorage)

const DEFAULT_HABITS = [
  "Recycle",
  "Bike/Walk",
  "Save Water",
  "Plant Care",
  "No Plastic"
];

const BADGES = [
  { name: "Green Starter", streak: 3, emoji: "🥉" },
  { name: "Eco Enthusiast", streak: 7, emoji: "🥈" },
  { name: "Planet Hero", streak: 14, emoji: "🥇" },
  { name: "Earth Guardian", streak: 30, emoji: "🏆" }
];

let ecoData = JSON.parse(localStorage.getItem("ecoHabitData") || "null") || {
  habits: [...DEFAULT_HABITS],
  log: {}, // { 'YYYY-MM-DD': [true, false, ...] }
  streak: 0,
  bestStreak: 0,
  badges: [],
};

function saveEcoData() {
  localStorage.setItem("ecoHabitData", JSON.stringify(ecoData));
}

function renderHabitList() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  ecoData.habits.forEach((habit, i) => {
    const div = document.createElement("div");
    div.className = "habit-item";
    div.innerHTML = `<span>${habit}</span><button class='action-btn' style='padding:0.2rem 0.7rem;font-size:0.9rem;' onclick='removeHabit(${i})'>✕</button>`;
    list.appendChild(div);
  });
}

function removeHabit(idx) {
  ecoData.habits.splice(idx, 1);
  saveEcoData();
  renderHabitList();
  renderHabitLog();
}

function renderHabitLog() {
  const logDiv = document.getElementById("habitLog");
  logDiv.innerHTML = "";
  const today = new Date().toISOString().slice(0, 10);
  if (!ecoData.log[today]) ecoData.log[today] = ecoData.habits.map(() => false);
  ecoData.habits.forEach((habit, i) => {
    const div = document.createElement("div");
    div.className = "habit-item";
    div.innerHTML = `<span>${habit}</span><input type='checkbox' class='habit-checkbox' id='habitCheck${i}' ${ecoData.log[today][i] ? "checked" : ""} onchange='toggleHabit(${i})'>`;
    logDiv.appendChild(div);
  });
}

function toggleHabit(idx) {
  const today = new Date().toISOString().slice(0, 10);
  ecoData.log[today][idx] = !ecoData.log[today][idx];
  saveEcoData();
}

function addHabit() {
  const name = prompt("Enter new eco-habit:");
  if (name && name.trim().length > 1) {
    ecoData.habits.push(name.trim());
    saveEcoData();
    renderHabitList();
    renderHabitLog();
  }
}

document.getElementById("addHabitBtn").onclick = addHabit;

function saveLog() {
  const today = new Date().toISOString().slice(0, 10);
  // Check if all habits done today
  if (ecoData.habits.length && ecoData.log[today].every(Boolean)) {
    // Streak logic
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (ecoData.log[yesterday] && ecoData.log[yesterday].every(Boolean)) {
      ecoData.streak += 1;
    } else {
      ecoData.streak = 1;
    }
    if (ecoData.streak > ecoData.bestStreak) ecoData.bestStreak = ecoData.streak;
    // Badge unlock
    BADGES.forEach(b => {
      if (ecoData.streak === b.streak && !ecoData.badges.includes(b.name)) ecoData.badges.push(b.name);
    });
  } else {
    ecoData.streak = 0;
  }
  saveEcoData();
  renderStreaks();
  renderBadges();
  renderAnalytics();
  renderAchievementCard();
}

document.getElementById("saveLogBtn").onclick = saveLog;

function renderStreaks() {
  const bar = document.getElementById("streaksBar");
  bar.innerHTML = `<div>Current Streak: <b>${ecoData.streak}</b> days</div><div>Best: <b>${ecoData.bestStreak}</b> days</div><div class='streak-bar' style='width:${Math.min(ecoData.streak,30)*3.3}%'></div>`;
}

function renderBadges() {
  const list = document.getElementById("badgesList");
  list.innerHTML = ecoData.badges.map(b => {
    const badge = BADGES.find(x => x.name === b);
    return `<span class='badge' title='${badge.name}'>${badge.emoji}</span>`;
  }).join("") || "<span style='color:#aaa;'>No badges yet</span>";
}

function renderAnalytics() {
  // Simple bar chart: days completed per habit
  const canvas = document.getElementById("analyticsChart");
  const ctx = canvas.getContext("2d");
  canvas.width = 400; canvas.height = 180;
  ctx.clearRect(0,0,400,180);
  ctx.font = "14px Arial";
  ctx.fillStyle = "#388e3c";
  // Count completions per habit
  const counts = ecoData.habits.map((_,i) => Object.values(ecoData.log).filter(arr => arr[i]).length);
  const max = Math.max(...counts,1);
  ecoData.habits.forEach((habit,i) => {
    const x = 40 + i*70;
    const h = Math.round((counts[i]/max)*100);
    ctx.fillStyle = "#a5d6a7";
    ctx.fillRect(x, 150-h, 40, h);
    ctx.fillStyle = "#388e3c";
    ctx.fillText(habit, x, 170);
    ctx.fillText(counts[i], x+12, 145-h);
  });
}

function renderAchievementCard() {
  const div = document.getElementById("achievementCard");
  div.innerHTML = `<div style='font-size:1.1rem;'>Eco Streak: <b>${ecoData.streak}</b> days</div><div>Badges: ${ecoData.badges.map(b => {
    const badge = BADGES.find(x => x.name === b);
    return `<span class='badge' title='${badge.name}'>${badge.emoji}</span>`;
  }).join("") || "None"}</div>`;
}

document.getElementById("shareAchievementBtn").onclick = function() {
  const card = document.getElementById("achievementCardSection");
  html2canvas(card).then(canvas => {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "eco-achievement-card.png";
    a.click();
  });
};

// Initial render
renderHabitList();
renderHabitLog();
renderStreaks();
renderBadges();
renderAnalytics();
renderAchievementCard();

// Expose remove/toggle for inline event handlers
window.removeHabit = removeHabit;
window.toggleHabit = toggleHabit;
