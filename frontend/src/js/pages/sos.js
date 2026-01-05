const cards = document.querySelectorAll(".sos-card");
const sosBtn = document.getElementById("sosBtn");
const popup = document.getElementById("sosPopup");
const popupText = document.getElementById("popupText");
const closeBtn = document.querySelector(".close-btn");
const desc = document.getElementById("description");
const locationInput = document.getElementById("location");

let selectedEmergency = null;

// Select emergency
cards.forEach(card => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedEmergency = card.dataset.type;
  });
});

// Send SOS
sosBtn.addEventListener("click", () => {
  if (!selectedEmergency) {
    alert("Please select the animal problem first 🐾");
    return;
  }

  if (!locationInput.value.trim()) {
    alert("Please tell us where to come 📍");
    return;
  }

  popupText.innerHTML = `
    <strong>Problem:</strong> ${selectedEmergency}<br>
    <strong>Details:</strong> ${desc.value || "Not provided"}<br>
    <strong>Location:</strong> ${locationInput.value}<br><br>
    Our rescue team is on the way 💚
  `;

  popup.style.display = "flex";
});

// Close popup
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  selectedEmergency = null;
  desc.value = "";
  locationInput.value = "";
  cards.forEach(c => c.classList.remove("selected"));
});
