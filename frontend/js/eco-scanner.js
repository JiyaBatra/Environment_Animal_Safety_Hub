// Demo eco product data
const demoProducts = [
  {
    barcode: "1234567890123",
    name: "Eco Toothbrush",
    ecoScore: 92,
    certifications: ["FSC", "Vegan"],
    alternatives: ["Bamboo Toothbrush", "Recycled Plastic Toothbrush"],
    image: "https://cdn-icons-png.flaticon.com/512/2917/2917992.png"
  },
  {
    barcode: "9876543210987",
    name: "Organic Shampoo",
    ecoScore: 85,
    certifications: ["USDA Organic", "Cruelty-Free"],
    alternatives: ["Bar Shampoo", "Refillable Shampoo"],
    image: "https://cdn-icons-png.flaticon.com/512/2917/2917993.png"
  },
  {
    barcode: "5555555555555",
    name: "Reusable Water Bottle",
    ecoScore: 98,
    certifications: ["BPA-Free", "Recyclable"],
    alternatives: ["Glass Water Bottle", "Stainless Steel Bottle"],
    image: "https://cdn-icons-png.flaticon.com/512/2917/2917994.png"
  }
];

const ecoScoreColors = [
  { min: 90, color: "#43a047" }, // Excellent
  { min: 75, color: "#fbc02d" }, // Good
  { min: 0, color: "#e53935" }   // Poor
];

const scanBtn = document.getElementById("scanBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");
const ecoScore = document.getElementById("ecoScore");
const badges = document.getElementById("badges");
const altList = document.getElementById("altList");
const alternatives = document.getElementById("alternatives");
favoritesSection = document.getElementById("favoritesSection");
historySection = document.getElementById("historySection");
favoritesList = document.getElementById("favoritesList");
historyList = document.getElementById("historyList");
favoriteBtn = document.getElementById("favoriteBtn");
shareBtn = document.getElementById("shareBtn");

let currentProduct = null;

function getEcoScoreColor(score) {
  for (const { min, color } of ecoScoreColors) {
    if (score >= min) return color;
  }
  return "#888";
}

function showProduct(product) {
  currentProduct = product;
  ecoScore.innerHTML =
    `<img src="${product.image}" alt="${product.name}" style="width:32px;vertical-align:middle;margin-right:8px;">` +
    `<span style="color:${getEcoScoreColor(product.ecoScore)}">Eco-Score: ${product.ecoScore}</span>`;
  badges.innerHTML = product.certifications.map(
    c => `<span class="badge">${c}</span>`
  ).join("");
  altList.innerHTML = product.alternatives.map(
    a => `<li>${a}</li>`
  ).join("");
  alternatives.style.display = product.alternatives.length ? "block" : "none";
  favoriteBtn.style.display = "inline-block";
  shareBtn.style.display = "inline-block";
  addToHistory(product);
}

function searchProduct(query) {
  query = query.trim().toLowerCase();
  return demoProducts.find(
    p => p.name.toLowerCase() === query || p.barcode === query
  );
}

function autocompleteProducts(query) {
  query = query.trim().toLowerCase();
  if (!query) return [];
  return demoProducts.filter(
    p => p.name.toLowerCase().includes(query)
  );
}

searchBtn.onclick = () => {
  const query = searchInput.value;
  const product = searchProduct(query);
  if (product) {
    showProduct(product);
    autocompleteList.innerHTML = "";
  } else {
    ecoScore.innerHTML = "<span style='color:#e53935'>Product not found.</span>";
    badges.innerHTML = "";
    altList.innerHTML = "";
    alternatives.style.display = "none";
    favoriteBtn.style.display = "none";
    shareBtn.style.display = "none";
  }
};

searchInput.oninput = () => {
  const query = searchInput.value;
  const matches = autocompleteProducts(query);
  if (matches.length && query) {
    autocompleteList.innerHTML = matches.map(
      p => `<div class='autocomplete-item' style='padding:6px;cursor:pointer;border-bottom:1px solid #eee;' onclick='selectAutocomplete("${p.name}")'>${p.name}</div>`
    ).join("");
  } else {
    autocompleteList.innerHTML = "";
  }
};

window.selectAutocomplete = function(name) {
  searchInput.value = name;
  autocompleteList.innerHTML = "";
  searchBtn.click();
};

// Barcode/QR code scanning (demo: prompt for barcode)
scanBtn.onclick = () => {
  const code = prompt("Enter barcode/QR code (demo):");
  if (code) {
    const product = searchProduct(code);
    if (product) {
      showProduct(product);
    } else {
      ecoScore.innerHTML = "<span style='color:#e53935'>Product not found.</span>";
      badges.innerHTML = "";
      altList.innerHTML = "";
      alternatives.style.display = "none";
      favoriteBtn.style.display = "none";
      shareBtn.style.display = "none";
    }
  }
};

// Favorites and history (LocalStorage)
function getFavorites() {
  return JSON.parse(localStorage.getItem("ecoFavorites") || "[]");
}
function setFavorites(favs) {
  localStorage.setItem("ecoFavorites", JSON.stringify(favs));
}
function getHistory() {
  return JSON.parse(localStorage.getItem("ecoHistory") || "[]");
}
function setHistory(hist) {
  localStorage.setItem("ecoHistory", JSON.stringify(hist));
}
function addToFavorites(product) {
  let favs = getFavorites();
  if (!favs.find(p => p.barcode === product.barcode)) {
    favs.unshift(product);
    setFavorites(favs);
    renderFavorites();
  }
}
function addToHistory(product) {
  let hist = getHistory();
  hist = hist.filter(p => p.barcode !== product.barcode);
  hist.unshift(product);
  if (hist.length > 10) hist.pop();
  setHistory(hist);
  renderHistory();
}
function renderFavorites() {
  const favs = getFavorites();
  if (favs.length) {
    favoritesSection.style.display = "block";
    favoritesList.innerHTML = favs.map(
      p => `<li onclick='selectFavorite("${p.barcode}")'>${p.name}</li>`
    ).join("");
  } else {
    favoritesSection.style.display = "none";
  }
}
function renderHistory() {
  const hist = getHistory();
  if (hist.length) {
    historySection.style.display = "block";
    historyList.innerHTML = hist.map(
      p => `<li onclick='selectHistory("${p.barcode}")'>${p.name}</li>`
    ).join("");
  } else {
    historySection.style.display = "none";
  }
}
window.selectFavorite = function(barcode) {
  const product = demoProducts.find(p => p.barcode === barcode);
  if (product) showProduct(product);
};
window.selectHistory = function(barcode) {
  const product = demoProducts.find(p => p.barcode === barcode);
  if (product) showProduct(product);
};
favoriteBtn.onclick = () => {
  if (currentProduct) addToFavorites(currentProduct);
};
// Share eco-rating as image (canvas)
shareBtn.onclick = () => {
  if (!currentProduct) return;
  const canvas = document.createElement("canvas");
  canvas.width = 350;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e0f7fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 20px Segoe UI";
  ctx.fillStyle = "#388e3c";
  ctx.fillText(currentProduct.name, 20, 40);
  ctx.font = "16px Segoe UI";
  ctx.fillStyle = getEcoScoreColor(currentProduct.ecoScore);
  ctx.fillText(`Eco-Score: ${currentProduct.ecoScore}`, 20, 75);
  ctx.fillStyle = "#00695c";
  ctx.font = "15px Segoe UI";
  ctx.fillText(`Certifications: ${currentProduct.certifications.join(", ")}", 20, 105);
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = "#33691e";
  ctx.fillText(`Greener Alternatives: ${currentProduct.alternatives.join(", ")}", 20, 135);
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.onload = function() {
    ctx.drawImage(img, 270, 30, 60, 60);
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProduct.name}-eco-rating.png`;
    a.click();
  };
  img.src = currentProduct.image;
};
// Initial render
renderFavorites();
renderHistory();
