// Wetland Methane Flux Variability - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initMethaneSimulator();
  initFeedbackLoops();
  initQuiz();
  initScrollAnimations();
});

// Methane Flux Simulator
function initMethaneSimulator() {
  const biodiversitySlider = document.getElementById('biodiversity-slider');
  const biodiversityValue = document.getElementById('biodiversity-value');
  const temperatureSlider = document.getElementById('temperature-slider');
  const temperatureValue = document.getElementById('temperature-value');
  const wetlandType = document.getElementById('wetland-type');
  const fluxFill = document.getElementById('flux-fill');
  const fluxValue = document.getElementById('flux-value');
  const carbonFill = document.getElementById('carbon-fill');
  const carbonValue = document.getElementById('carbon-value');
  const impactFill = document.getElementById('impact-fill');
  const impactValue = document.getElementById('impact-value');

  // Baseline data for different wetland types
  const wetlandData = {
    peatland: { baseFlux: 15, baseCarbon: 50, tempSensitivity: 0.08, biodiversityEffect: -0.3 },
    marsh: { baseFlux: 25, baseCarbon: 35, tempSensitivity: 0.12, biodiversityEffect: -0.25 },
    mangrove: { baseFlux: 8, baseCarbon: 180, tempSensitivity: 0.06, biodiversityEffect: -0.4 },
    'rice-paddy': { baseFlux: 35, baseCarbon: 20, tempSensitivity: 0.15, biodiversityEffect: -0.2 }
  };

  function updateSimulator() {
    const biodiversity = parseInt(biodiversitySlider.value);
    const temperature = parseInt(temperatureSlider.value);
    const wetland = wetlandType.value;
    const data = wetlandData[wetland];

    // Calculate biodiversity effect (more species = lower emissions)
    const biodiversityFactor = 1 + (data.biodiversityEffect * (biodiversity - 25) / 25);

    // Calculate temperature effect (higher temp = higher emissions)
    const tempFactor = 1 + (data.tempSensitivity * (temperature - 15));

    // Calculate final values
    const methaneFlux = data.baseFlux * biodiversityFactor * tempFactor;
    const carbonSeq = data.baseCarbon * biodiversityFactor;
    const netImpact = (methaneFlux * 25) - carbonSeq; // CO2-equivalent

    // Update display
    biodiversityValue.textContent = biodiversity + ' species';
    temperatureValue.textContent = temperature + '°C';
    fluxValue.textContent = methaneFlux.toFixed(1) + ' mg CH₄/m²/day';
    carbonValue.textContent = carbonSeq.toFixed(1) + ' g C/m²/year';

    if (netImpact > 0) {
      impactValue.textContent = 'Net Source (+' + netImpact.toFixed(1) + ' CO₂-eq)';
      impactFill.style.background = 'linear-gradient(90deg, #f44336, #ff9800)';
    } else {
      impactValue.textContent = 'Net Sink (' + netImpact.toFixed(1) + ' CO₂-eq)';
      impactFill.style.background = 'linear-gradient(90deg, #4caf50, #2e7d32)';
    }

    // Update progress bars
    fluxFill.style.width = Math.min(100, (methaneFlux / 50) * 100) + '%';
    carbonFill.style.width = Math.min(100, (carbonSeq / 200) * 100) + '%';
    impactFill.style.width = Math.min(100, Math.abs(netImpact) / 50 * 100) + '%';
  }

  biodiversitySlider.addEventListener('input', updateSimulator);
  temperatureSlider.addEventListener('input', updateSimulator);
  wetlandType.addEventListener('change', updateSimulator);

  // Initialize
  updateSimulator();
}

// Biodiversity Feedback Loops Visualization
function initFeedbackLoops() {
  const ctx = document.getElementById('feedbackChart').getContext('2d');
  let feedbackChart;

  // Feedback loop data for different biodiversity aspects
  const feedbackData = {
    plant: {
      labels: ['Low Diversity', 'Medium Diversity', 'High Diversity'],
      datasets: [{
        label: 'Methane Flux (mg/m²/day)',
        data: [28, 18, 12],
        borderColor: '#2e7d32',
        backgroundColor: '#2e7d3220',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    microbial: {
      labels: ['Low Diversity', 'Medium Diversity', 'High Diversity'],
      datasets: [{
        label: 'Methane Oxidation Rate (%)',
        data: [15, 35, 55],
        borderColor: '#43a047',
        backgroundColor: '#43a04720',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    faunal: {
      labels: ['Low Diversity', 'Medium Diversity', 'High Diversity'],
      datasets: [{
        label: 'Carbon Processing Efficiency',
        data: [20, 45, 70],
        borderColor: '#66bb6a',
        backgroundColor: '#66bb6a20',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    combined: {
      labels: ['Species Richness'],
      datasets: [
        {
          label: 'Methane Emissions',
          data: [30, 25, 18, 12, 8],
          borderColor: '#f44336',
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Carbon Sequestration',
          data: [20, 35, 50, 65, 80],
          borderColor: '#4caf50',
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    }
  };

  function createChart(feedbackType) {
    if (feedbackChart) {
      feedbackChart.destroy();
    }

    const data = feedbackData[feedbackType];
    const isCombined = feedbackType === 'combined';

    feedbackChart = new Chart(ctx, {
      type: isCombined ? 'line' : 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: getChartTitle(feedbackType),
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
        scales: isCombined ? {
          x: {
            title: {
              display: true,
              text: 'Biodiversity Level'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Methane (mg/m²/day)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Carbon (g/m²/year)'
            },
            grid: {
              drawOnChartArea: false,
            }
          }
        } : {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: getYAxisLabel(feedbackType)
            }
          },
          x: {
            title: {
              display: true,
              text: 'Biodiversity Level'
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

  function getChartTitle(type) {
    const titles = {
      plant: 'Plant Diversity Impact on Methane Flux',
      microbial: 'Microbial Diversity Effect on Methane Oxidation',
      faunal: 'Faunal Diversity Influence on Carbon Processing',
      combined: 'Combined Biodiversity Effects on Wetland Carbon Cycling'
    };
    return titles[type];
  }

  function getYAxisLabel(type) {
    const labels = {
      plant: 'Methane Flux (mg/m²/day)',
      microbial: 'Oxidation Rate (%)',
      faunal: 'Processing Efficiency (%)'
    };
    return labels[type];
  }

  // Button event listeners
  document.getElementById('plant-btn').addEventListener('click', function() {
    setActiveButton('plant-btn');
    createChart('plant');
  });

  document.getElementById('microbial-btn').addEventListener('click', function() {
    setActiveButton('microbial-btn');
    createChart('microbial');
  });

  document.getElementById('faunal-btn').addEventListener('click', function() {
    setActiveButton('faunal-btn');
    createChart('faunal');
  });

  document.getElementById('combined-btn').addEventListener('click', function() {
    setActiveButton('combined-btn');
    createChart('combined');
  });

  function setActiveButton(activeId) {
    const buttons = ['plant-btn', 'microbial-btn', 'faunal-btn', 'combined-btn'];
    buttons.forEach(id => {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
  }

  // Initialize with plant diversity
  createChart('plant');
}

// Quiz Functionality
function initQuiz() {
  const questions = [
    {
      question: "How does plant biodiversity typically affect wetland methane emissions?",
      options: [
        "Always increases emissions",
        "Always decreases emissions",
        "Creates complex feedback loops",
        "Has no significant effect"
      ],
      correct: "c",
      explanation: "Biodiversity creates complex feedback loops that can either amplify or mitigate methane emissions depending on species composition and environmental conditions."
    },
    {
      question: "Which wetland type generally has the highest methane emissions?",
      options: [
        "Boreal peatlands",
        "Tropical mangroves",
        "Rice paddies",
        "Arctic tundra"
      ],
      correct: "c",
      explanation: "Rice paddies typically have the highest methane emissions due to anaerobic conditions and organic matter decomposition."
    },
    {
      question: "How does temperature increase affect wetland methane production?",
      options: [
        "Decreases production",
        "Has no effect",
        "Increases production",
        "Depends on biodiversity"
      ],
      correct: "c",
      explanation: "Higher temperatures accelerate microbial methane production in wetland soils."
    },
    {
      question: "What role do wetland plants play in methane cycling?",
      options: [
        "Only as carbon sources",
        "Transport oxygen to roots affecting oxidation",
        "Have no influence",
        "Block methane release"
      ],
      correct: "b",
      explanation: "Plants transport oxygen through their roots, creating aerobic zones that enhance methane oxidation by bacteria."
    },
    {
      question: "How does biodiversity loss affect wetland carbon sequestration?",
      options: [
        "Increases sequestration",
        "Decreases sequestration",
        "Has no effect",
        "Depends on plant type"
      ],
      correct: "b",
      explanation: "Biodiversity loss typically reduces carbon sequestration capacity as different species have complementary roles in carbon cycling."
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
      feedbackText.textContent = "Excellent! You have a strong understanding of wetland methane-biodiversity interactions.";
    } else if (score >= questions.length * 0.7) {
      feedbackText.textContent = "Good job! You understand most concepts about wetland methane dynamics.";
    } else {
      feedbackText.textContent = "Keep learning! Review the content above to better understand these important wetland processes.";
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