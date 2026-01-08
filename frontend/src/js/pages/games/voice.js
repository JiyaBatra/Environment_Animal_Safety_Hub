const words = [
  { text: "🌱 Recycle", key: "recycle" },
  { text: "♻️ Reuse", key: "reuse" },
  { text: "🗑️ Reduce", key: "reduce" },
  { text: "💧 Save Water", key: "water" },
  { text: "💦 Clean Water", key: "water" },
  { text: "🌬️ Clean Air", key: "air" },
  { text: "🌳 Plant Trees", key: "trees" },
  { text: "🌍 Green Earth", key: "earth" },
  { text: "🍃 Go Green", key: "green" },
  { text: "🛡️ Protect Nature", key: "nature" },

  { text: "🌿 Eco Friendly", key: "eco" },
  { text: "🚫 No Plastic", key: "plastic" },
  { text: "🌎 Green Planet", key: "planet" },
  { text: "☀️ Solar Energy", key: "solar" },
  { text: "🌪️ Wind Energy", key: "wind" },
  { text: "⚡ Save Energy", key: "energy" },
  { text: "🤲 Earth Care", key: "earth" },
  { text: "💚 Nature Love", key: "nature" },
  { text: "🧼 Clean Environment", key: "clean" },
  { text: "🚯 Stop Pollution", key: "pollution" },

  { text: "🚰 Water Conservation", key: "water" },
  { text: "🌲 Tree Plantation", key: "tree" },
  { text: "🔋 Renewable Energy", key: "renewable" },
  { text: "🌱 Green Life", key: "green" },
  { text: "🥕 Organic Farming", key: "organic" },
  { text: "🌍 Healthy Earth", key: "earth" },
  { text: "🐾 Protect Animals", key: "animals" },
  { text: "🦁 Wildlife Care", key: "wildlife" },
  { text: "🌳 Forest Protection", key: "forest" },
  { text: "🧹 Clean Surroundings", key: "clean" },

  { text: "🗑️ Reduce Waste", key: "waste" },
  { text: "🍂 Composting", key: "compost" },
  { text: "🌾 Biodegradable", key: "biodegradable" },
  { text: "🚫 Say No Plastic", key: "plastic" },
  { text: "🌧️ Rainwater Harvesting", key: "rainwater" },
  { text: "💡 Save Electricity", key: "electricity" },
  { text: "📢 Eco Awareness", key: "eco" },
  { text: "🔮 Green Future", key: "green" },
  { text: "🌼 Nature Friendly", key: "nature" },
  { text: "🏙️ Clean City", key: "clean" },

  { text: "🧽 Keep Earth Clean", key: "earth" },
  { text: "♻️ Sustainable Living", key: "sustainable" },
  { text: "⚡ Green Energy", key: "energy" },
  { text: "🚯 Plastic Free", key: "plastic" },
  { text: "🛡️ Earth Protection", key: "earth" },
  { text: "🌴 Save Trees", key: "trees" },
  { text: "🏞️ Clean Rivers", key: "rivers" },
  { text: "🌱 Healthy Nature", key: "nature" },
  { text: "🌏 Green World", key: "world" },
  { text: "🥇 Nature First", key: "nature" },

  { text: "🌎 Environmental Care", key: "environment" },
  { text: "🌳 Protect Forests", key: "forests" },
  { text: "🐘 Save Wildlife", key: "wildlife" },
  { text: "🏖️ Clean Beaches", key: "beaches" },
  { text: "🚯 Reduce Pollution", key: "pollution" },
  { text: "♻️ Recycle More", key: "recycle" },
  { text: "🌿 Eco Habits", key: "eco" },
  { text: "📈 Green Growth", key: "green" },
  { text: "🚿 Water Saving", key: "water" },
  { text: "🌼 Nature Matters", key: "nature" },

  { text: "🌱 Plant a Tree", key: "tree" },
  { text: "🌍 Clean Planet", key: "planet" },
  { text: "🍃 Earth Friendly", key: "earth" },
  { text: "🔋 Renewable Power", key: "renewable" },
  { text: "☀️ Solar Panels", key: "solar" },
  { text: "🌪️ Wind Mills", key: "wind" },
  { text: "🧠 Green Technology", key: "green" },
  { text: "🛡️ Safe Environment", key: "environment" },
  { text: "🌎 Healthy Planet", key: "planet" },
  { text: "🌱 Nature Protection", key: "nature" }
];


let index = 0;
let currentWord = words[index];

const ecoWord = document.getElementById("eco-word");
const playBtn = document.getElementById("play-btn");
const recordBtn = document.getElementById("record-btn");
const spokenText = document.getElementById("spoken-text");
const feedback = document.getElementById("feedback");
const clap = new Audio("../assets/clap.mp3");
const wrong = new Audio("../assets/wrong.mp3");

ecoWord.textContent = currentWord.text;

playBtn.onclick = () => {
  const utter = new SpeechSynthesisUtterance(currentWord.key);
  utter.rate = 0.8;
  speechSynthesis.speak(utter);
};

function loadNextWord() {
  index++;

  if (index >= words.length) {
    ecoWord.textContent = "🎉 Game Completed!";
    feedback.textContent = "🏆 Amazing Job!";
    recordBtn.disabled = true;
    playBtn.disabled = true;
    return;
  }

  currentWord = words[index];
  ecoWord.textContent = currentWord.text;
}

recordBtn.onclick = () => {
  if (!window.webkitSpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();
  spokenText.textContent = "🎧 Listening...";

  recognition.onresult = (e) => {
    const spoken = e.results[0][0].transcript.toLowerCase().trim();
    spokenText.textContent = spoken;

    if (spoken.includes(currentWord.key)) {
      feedback.textContent = "🎉 Correct!";
      feedback.className = "correct";
        clap.play();


      setTimeout(() => {
        feedback.textContent = "";
        loadNextWord(); 
      }, 1200);

    } else {
      feedback.textContent = "😊 Try again!";
      feedback.className = "incorrect";
        wrong.play();
    }
  };

  recognition.onerror = () => {
    spokenText.textContent = "❌ Could not hear clearly";
  };
};
