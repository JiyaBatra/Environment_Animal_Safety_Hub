// Pollen Nutritional Decline Under Elevated CO₂ - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initCO2Simulator();
  initDevelopmentTracker();
  initQuiz();
  initScrollAnimations();
});

// CO₂ Impact Simulator
function initCO2Simulator() {
  const co2Slider = document.getElementById('co2-slider');
  const co2Value = document.getElementById('co2-value');
  const plantSelect = document.getElementById('plant-select');
  const proteinFill = document.getElementById('protein-fill');
  const proteinValue = document.getElementById('protein-value');
  const lipidFill = document.getElementById('lipid-fill');
  const lipidValue = document.getElementById('lipid-value');
  const survivalFill = document.getElementById('survival-fill');
  const survivalValue = document.getElementById('survival-value');

  // Plant-specific baseline data (protein %, lipid %, survival % at 280 ppm CO2)
  const plantData = {
    sunflower: { protein: 25.0, lipid: 9.5, survival: 85 },
    clover: { protein: 22.0, lipid: 8.0, survival: 82 },
    rape: { protein: 24.5, lipid: 8.8, survival: 88 },
    apple: { protein: 20.5, lipid: 7.2, survival: 80 }
  };

  function updateSimulator() {
    const co2Level = parseInt(co2Slider.value);
    const selectedPlant = plantSelect.value;
    const baseline = plantData[selectedPlant];

    // Calculate nutritional decline based on CO2 level
    // Protein and lipid decrease linearly with CO2 increase
    const co2Effect = (co2Level - 280) / 520; // Normalized 0-1 scale (280 to 800 ppm)
    const proteinReduction = co2Effect * 0.25; // Up to 25% reduction
    const lipidReduction = co2Effect * 0.20; // Up to 20% reduction

    const currentProtein = baseline.protein * (1 - proteinReduction);
    const currentLipid = baseline.lipid * (1 - lipidReduction);
    const currentSurvival = baseline.survival * (1 - co2Effect * 0.30); // Up to 30% survival reduction

    // Update display
    co2Value.textContent = co2Level + ' ppm';
    proteinValue.textContent = currentProtein.toFixed(1) + '%';
    lipidValue.textContent = currentLipid.toFixed(1) + '%';
    survivalValue.textContent = Math.max(0, currentSurvival.toFixed(0)) + '%';

    // Update progress bars
    proteinFill.style.width = (currentProtein / 30) * 100 + '%'; // Max 30%
    lipidFill.style.width = (currentLipid / 12) * 100 + '%'; // Max 12%
    survivalFill.style.width = Math.max(0, currentSurvival) + '%';
  }

  co2Slider.addEventListener('input', updateSimulator);
  plantSelect.addEventListener('change', updateSimulator);

  // Initialize
  updateSimulator();
}

// Larval Development Tracker
function initDevelopmentTracker() {
  const ctx = document.getElementById('developmentChart').getContext('2d');
  let developmentChart;

  // Development data for different scenarios
  const scenarios = {
    normal: {
      label: 'Normal Pollen Quality',
      data: [0, 2.1, 4.8, 8.2, 12.5, 17.8, 24.1, 31.2, 39.5, 48.8, 59.2, 70.5],
      color: '#4caf50'
    },
    elevated: {
      label: 'Elevated CO₂ Pollen',
      data: [0, 1.8, 4.1, 7.2, 11.1, 15.8, 21.2, 27.5, 34.8, 43.1, 52.2, 62.1],
      color: '#ff9800'
    },
    severe: {
      label: 'Severe CO₂ Impact',
      data: [0, 1.5, 3.4, 6.1, 9.5, 13.8, 18.9, 24.8, 31.5, 38.9, 46.8, 55.2],
      color: '#f44336'
    }
  };

  function createChart(scenario) {
    if (developmentChart) {
      developmentChart.destroy();
    }

    developmentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        datasets: [{
          label: scenarios[scenario].label,
          data: scenarios[scenario].data,
          borderColor: scenarios[scenario].color,
          backgroundColor: scenarios[scenario].color + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Larval Weight Growth Over Time (days)',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Larval Weight (mg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Days After Hatching'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  // Button event listeners
  document.getElementById('normal-pollen-btn').addEventListener('click', function() {
    setActiveButton('normal-pollen-btn');
    createChart('normal');
  });

  document.getElementById('elevated-co2-btn').addEventListener('click', function() {
    setActiveButton('elevated-co2-btn');
    createChart('elevated');
  });

  document.getElementById('severe-co2-btn').addEventListener('click', function() {
    setActiveButton('severe-co2-btn');
    createChart('severe');
  });

  function setActiveButton(activeId) {
    const buttons = ['normal-pollen-btn', 'elevated-co2-btn', 'severe-co2-btn'];
    buttons.forEach(id => {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
  }

  // Initialize with normal pollen
  createChart('normal');
}

// Quiz Functionality
function initQuiz() {
  const questions = [
    {
      question: "What is the primary effect of elevated CO₂ on pollen nutritional quality?",
      options: [
        "Increased protein content",
        "Dilution of nutrients",
        "Enhanced lipid production",
        "Improved mineral absorption"
      ],
      correct: "b",
      explanation: "Elevated CO₂ causes nutrient dilution in plant tissues, reducing protein and other nutrients in pollen."
    },
    {
      question: "Which pollinator group is most affected by pollen nutritional decline?",
      options: [
        "Birds",
        "Bats",
        "Bees and butterflies",
        "Flies"
      ],
      correct: "c",
      explanation: "Bees and butterflies rely heavily on pollen for larval nutrition, making them particularly vulnerable."
    },
    {
      question: "How much can larval survival rates decrease under severe CO₂ conditions?",
      options: [
        "5-10%",
        "15-25%",
        "30-50%",
        "60-80%"
      ],
      correct: "c",
      explanation: "Studies show larval survival can decrease by 30-50% when fed pollen from high CO₂ environments."
    },
    {
      question: "What agricultural impact results from pollinator nutritional stress?",
      options: [
        "Increased crop yields",
        "Reduced fruit quality",
        "Enhanced seed production",
        "Improved pollination efficiency"
      ],
      correct: "b",
      explanation: "Nutritionally stressed pollinators produce lower-quality pollination, reducing fruit size and nutrient content."
    },
    {
      question: "Which plant nutrient is most affected by elevated CO₂ in pollen?",
      options: [
        "Carbohydrates",
        "Proteins",
        "Vitamins",
        "Water content"
      ],
      correct: "b",
      explanation: "Protein content in pollen decreases significantly under elevated CO₂ due to nitrogen dilution effects."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  const questionText = document.getElementById('question-text');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-question-btn');
  const currentQuestionSpan = document.getElementById('current-question');
  const totalQuestionsSpan = document.getElementById('total-questions');

  totalQuestionsSpan.textContent = questions.length;

  function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    quizOptions.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'quiz-option';
      button.textContent = option;
      button.dataset.answer = String.fromCharCode(97 + index); // a, b, c, d
      button.addEventListener('click', () => checkAnswer(button.dataset.answer));
      quizOptions.appendChild(button);
    });

    quizFeedback.classList.add('hidden');
  }

  function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach(option => {
      option.disabled = true;
      if (option.dataset.answer === question.correct) {
        option.classList.add('correct');
      } else if (option.dataset.answer === selectedAnswer && selectedAnswer !== question.correct) {
        option.classList.add('incorrect');
      }
    });

    if (selectedAnswer === question.correct) {
      score++;
      feedbackText.textContent = "Correct! " + question.explanation;
    } else {
      feedbackText.textContent = "Incorrect. " + question.explanation;
    }

    quizFeedback.classList.remove('hidden');
  }

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      showFinalScore();
    }
  });

  function showFinalScore() {
    questionText.textContent = `Quiz Complete! Your score: ${score}/${questions.length}`;
    quizOptions.innerHTML = '';
    quizFeedback.classList.add('hidden');

    if (score === questions.length) {
      feedbackText.textContent = "Excellent! You have a great understanding of CO₂ effects on pollen nutrition.";
    } else if (score >= questions.length * 0.7) {
      feedbackText.textContent = "Good job! You understand most concepts about pollen nutritional decline.";
    } else {
      feedbackText.textContent = "Keep learning! Review the content above to better understand these important concepts.";
    }

    quizFeedback.classList.remove('hidden');
    nextBtn.textContent = "Restart Quiz";
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      nextBtn.textContent = "Next Question";
      loadQuestion();
    });
  }

  // Initialize quiz
  loadQuestion();
}

// Scroll Animations
function initScrollAnimations() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
  });
}

// Utility function for smooth scrolling
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Add click handlers for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      smoothScrollTo(target);
    }
  });
});