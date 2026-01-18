/**
 * Voice Recognition Environmental Learning Game
 *
 * An interactive voice game where players learn environmental vocabulary
 * by listening to words and speaking them back using speech recognition.
 * Features pronunciation guidance, real-time feedback, and progressive learning.
 *
 * Game Mechanics:
 * - Sequential word presentation from environmental vocabulary database
 * - Text-to-speech pronunciation of target words
 * - Speech recognition validation of user pronunciation
 * - Audio feedback for correct/incorrect responses
 * - Progressive advancement through word list
 * - Game completion celebration
 *
 * Educational Value:
 * - Environmental vocabulary building (recycle, reuse, reduce, etc.)
 * - Pronunciation practice for key sustainability terms
 * - Speech recognition technology exposure
 * - Interactive learning through voice interaction
 * - Confidence building through successful pronunciation
 *
 * Technical Features:
 * - Web Speech API integration (SpeechSynthesis & SpeechRecognition)
 * - Audio feedback system with sound effects
 * - Progressive word database with emoji visual cues
 * - Real-time speech processing and validation
 * - Browser compatibility checking for speech features
 *
 * @author Environment Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ===== ENVIRONMENTAL VOCABULARY DATABASE =====
/**
 * Comprehensive database of environmental words and phrases
 * Each entry contains display text with emoji and the key word for recognition
 * @typedef {Object} EnvironmentalWord
 * @property {string} text - Display text with emoji for visual appeal
 * @property {string} key - The key word/phrase for speech recognition matching
 */
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
  { text: "🏞️ Protect Nature", key: "nature" },
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
  { text: "🦌 Protect Animals", key: "animals" },
  { text: "🦁 Wildlife Care", key: "wildlife" },
  { text: "🌳 Forest Protection", key: "forest" },
  { text: "🧹 Clean Surroundings", key: "clean" },
  { text: "🗑️ Reduce Waste", key: "waste" },
  { text: "🥕 Composting", key: "compost" },
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
  { text: "🏞️ Earth Protection", key: "earth" },
  { text: "🌴 Save Trees", key: "trees" },
  { text: "🏞️ Clean Rivers", key: "rivers" },
  { text: "🌱 Healthy Nature", key: "nature" },
  { text: "🌏 Green World", key: "world" },
  { text: "🥇 Nature First", key: "nature" },
  { text: "🌎 Environmental Care", key: "environment" },
  { text: "🌳 Protect Forests", key: "forests" },
  { text: "🦘 Save Wildlife", key: "wildlife" },
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
  { text: "🟢 Green Technology", key: "green" },
  { text: "🏞️ Safe Environment", key: "environment" },
  { text: "🌎 Healthy Planet", key: "planet" },
  { text: "🌱 Nature Protection", key: "nature" }
];

// ===== GAME STATE MANAGEMENT =====
/**
 * Core game state variables tracking current progress
 * @typedef {Object} VoiceGameState
 * @property {number} index - Current word index in the vocabulary database
 * @property {EnvironmentalWord} currentWord - Currently active word for pronunciation
 */
let index = 0;                          // Current word index (0 to words.length-1)
let currentWord = words[index];          // Currently active word object

// ===== DOM ELEMENT REFERENCES =====
/**
 * All interactive DOM elements organized by functionality
 */
const ecoWord = document.getElementById("eco-word");
const playBtn = document.getElementById("play-btn");
const recordBtn = document.getElementById("record-btn");
const spokenText = document.getElementById("spoken-text");
const feedback = document.getElementById("feedback");

// ===== AUDIO FEEDBACK SYSTEM =====
/**
 * Audio feedback files for correct and incorrect responses
 * @type {Object.<string, HTMLAudioElement>}
 */
const audioFeedback = {
  correct: new Audio("../assets/clap.mp3"),
  incorrect: new Audio("../assets/wrong.mp3")
};

// ===== GAME INITIALIZATION =====
/**
 * Initialize the voice game by displaying the first word
 */
function initializeGame() {
  ecoWord.textContent = currentWord.text;
}

// ===== SPEECH SYNTHESIS =====
/**
 * Play pronunciation of the current target word using text-to-speech
 */
function playWordPronunciation() {
  const utterance = new SpeechSynthesisUtterance(currentWord.key);
  utterance.rate = 0.8; // Slightly slower for clarity
  speechSynthesis.speak(utterance);
}

// ===== WORD PROGRESSION =====
/**
 * Advance to the next word in the vocabulary database
 * Handles game completion when all words are mastered
 */
function loadNextWord() {
  index++;

  // Check for game completion
  if (index >= words.length) {
    ecoWord.textContent = "🎉 Game Completed!";
    feedback.textContent = "🏆 Amazing Job!";
    recordBtn.disabled = true;
    playBtn.disabled = true;
    return;
  }

  // Load next word
  currentWord = words[index];
  ecoWord.textContent = currentWord.text;
}

// ===== SPEECH RECOGNITION =====
/**
 * Start speech recognition session to capture user pronunciation
 * Validates browser support and handles recognition results
 */
function startVoiceRecognition() {
  // Check for browser support
  if (!window.webkitSpeechRecognition) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  // Initialize speech recognition
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  // Update UI to show listening state
  spokenText.textContent = "🎤 Listening...";

  // Handle successful recognition
  recognition.onresult = (event) => {
    const spokenTextResult = event.results[0][0].transcript.toLowerCase().trim();
    spokenText.textContent = spokenTextResult;

    // Check if spoken text contains the target word
    if (spokenTextResult.includes(currentWord.key)) {
      // Correct pronunciation
      feedback.textContent = "🎉 Correct!";
      feedback.className = "correct";
      audioFeedback.correct.play();

      // Advance to next word after brief delay
      setTimeout(() => {
        feedback.textContent = "";
        loadNextWord();
      }, 1200);
    } else {
      // Incorrect pronunciation
      feedback.textContent = "😊 Try again!";
      feedback.className = "incorrect";
      audioFeedback.incorrect.play();
    }
  };

  // Handle recognition errors
  recognition.onerror = () => {
    spokenText.textContent = "❌ Could not hear clearly";
  };
}

// ===== EVENT LISTENERS =====
/**
 * Set up game control event handlers
 */

// Play button - Pronounce the current word
playBtn.onclick = playWordPronunciation;

// Record button - Start voice recognition
recordBtn.onclick = startVoiceRecognition;

// ===== GAME STARTUP =====
/**
 * Initialize the voice recognition game on page load
 */
initializeGame();