// Animal Behavior Training Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimalBehaviorTraining();
});

function initializeAnimalBehaviorTraining() {
    // Initialize components
    setupCategoryNavigation();
    setupProgramButtons();
    setupToolButtons();
    setupCommunityForum();
    loadUserProgress();

    // Setup modals
    setupGuideModal();
    setupToolModal();
}

// Training guides data
const trainingGuides = {
    'basic-obedience': {
        title: 'Basic Obedience Training',
        content: `
            <div class="guide-content">
                <div class="guide-intro">
                    <h4>Essential Commands Every Pet Should Know</h4>
                    <p>Basic obedience training forms the foundation for all other training. These fundamental commands help establish communication and build trust between you and your pet.</p>
                </div>

                <div class="guide-section">
                    <h5>1. Sit Command</h5>
                    <p>Hold a treat above your pet's head and slowly move it back. As their head follows the treat, their bottom will naturally lower. Say "Sit" and reward immediately when they sit.</p>
                    <div class="training-tip">
                        <strong>Tip:</strong> Practice 5-10 times per session, 2-3 times daily.
                    </div>
                </div>

                <div class="guide-section">
                    <h5>2. Stay Command</h5>
                    <p>Start with your pet in a sit position. Hold your hand up like a stop sign and say "Stay." Take one step back, then immediately return and reward. Gradually increase distance and duration.</p>
                    <div class="training-tip">
                        <strong>Tip:</strong> Keep sessions short and end on a positive note.
                    </div>
                </div>

                <div class="guide-section">
                    <h5>3. Come When Called</h5>
                    <p>Use a happy, excited voice to say your pet's name followed by "Come!" Reward generously when they reach you. Never punish for coming to you.</p>
                    <div class="training-tip">
                        <strong>Tip:</strong> Practice in a safe, enclosed area first.
                    </div>
                </div>

                <div class="guide-section">
                    <h5>4. Leave It / Drop It</h5>
                    <p>Teach your pet to ignore tempting items. Place a treat on the floor, cover it with your hand, and say "Leave it." When they stop trying to get it, reward with a different treat.</p>
                    <div class="training-tip">
                        <strong>Tip:</strong> This command can save lives - practice regularly!
                    </div>
                </div>

                <div class="guide-actions">
                    <button class="btn-primary" onclick="startPractice('basic-obedience')">Start Practice Session</button>
                    <button class="btn-secondary" onclick="downloadGuide('basic-obedience')">Download PDF Guide</button>
                </div>
            </div>
        `
    },
    'behavior-problems': {
        title: 'Common Behavior Problems & Solutions',
        content: `
            <div class="guide-content">
                <div class="guide-intro">
                    <h4>Understanding and Solving Common Pet Behavior Issues</h4>
                    <p>Many behavior problems stem from unmet needs, fear, or lack of training. Understanding the root cause is key to finding effective solutions.</p>
                </div>

                <div class="guide-section">
                    <h5>Excessive Barking</h5>
                    <p>Identify triggers (boredom, anxiety, territorial behavior). Provide mental stimulation, exercise, and teach "quiet" command. Consider anti-anxiety aids if needed.</p>
                </div>

                <div class="guide-section">
                    <h5>Separation Anxiety</h5>
                    <p>Gradually acclimate your pet to alone time. Create positive associations with your departure. Use puzzle toys and calming aids. Consult a professional trainer for severe cases.</p>
                </div>

                <div class="guide-section">
                    <h5>Jumping on People</h5>
                    <p>Turn away and ignore jumping behavior. Reward calm greetings with all four paws on the floor. Teach "sit" and "stay" commands for greetings.</p>
                </div>

                <div class="guide-section">
                    <h5>Chewing Inappropriate Items</h5>
                    <p>Provide appropriate chew toys. Use bitter sprays on forbidden items. Supervise and redirect chewing behavior. Ensure adequate exercise and mental stimulation.</p>
                </div>

                <div class="guide-actions">
                    <button class="btn-primary" onclick="startPractice('behavior-problems')">Get Behavior Assessment</button>
                    <button class="btn-secondary" onclick="scheduleConsultation()">Schedule Consultation</button>
                </div>
            </div>
        `
    },
    'puppy-training': {
        title: 'Puppy Training Essentials',
        content: `
            <div class="guide-content">
                <div class="guide-intro">
                    <h4>Setting Your Puppy Up for Success</h4>
                    <p>The first few months of a puppy's life are crucial for learning. Focus on socialization, basic commands, and establishing routines.</p>
                </div>

                <div class="guide-section">
                    <h5>Socialization (7-16 weeks)</h5>
                    <p>Expose your puppy to various people, animals, sounds, and environments. Keep experiences positive and low-stress. This critical period shapes future behavior.</p>
                </div>

                <div class="guide-section">
                    <h5>House Training</h5>
                    <p>Establish a routine with regular feeding and potty breaks. Use positive reinforcement for outdoor elimination. Clean accidents with enzymatic cleaners.</p>
                </div>

                <div class="guide-section">
                    <h5>Bite Inhibition</h5>
                    <p>Teach gentle mouthing through play. If puppy bites too hard, yelp and stop play. This teaches bite pressure control.</p>
                </div>

                <div class="guide-section">
                    <h5>Basic Commands</h5>
                    <p>Start with sit, down, and come. Keep sessions short (5 minutes) and fun. Use high-value treats and plenty of praise.</p>
                </div>

                <div class="guide-actions">
                    <button class="btn-primary" onclick="startProgram('puppy-basics')">Start Puppy Program</button>
                    <button class="btn-secondary" onclick="getPuppyChecklist()">Download Checklist</button>
                </div>
            </div>
        `
    },
    'positive-reinforcement': {
        title: 'Positive Reinforcement Training Methods',
        content: `
            <div class="guide-content">
                <div class="guide-intro">
                    <h4>Effective, Humane Training Techniques</h4>
                    <p>Positive reinforcement focuses on rewarding desired behaviors rather than punishing unwanted ones. This method builds trust and creates a positive learning experience.</p>
                </div>

                <div class="guide-section">
                    <h5>Timing is Everything</h5>
                    <p>Reward within 1-2 seconds of the desired behavior. Use a clicker or verbal marker like "Yes!" to precisely mark the moment of correct behavior.</p>
                </div>

                <div class="guide-section">
                    <h5>Choose Effective Rewards</h5>
                    <p>Find what motivates your pet - treats, praise, play, or favorite toys. Use a variety of rewards to keep training engaging.</p>
                </div>

                <div class="guide-section">
                    <h5>Shaping Behavior</h5>
                    <p>Reward successive approximations toward the desired behavior. Break complex behaviors into small, achievable steps.</p>
                </div>

                <div class="guide-section">
                    <h5>Avoid Punishment</h5>
                    <p>Punishment can create fear and damage trust. Instead, focus on preventing unwanted behaviors and reinforcing alternatives.</p>
                </div>

                <div class="guide-actions">
                    <button class="btn-primary" onclick="startPractice('positive-methods')">Practice Techniques</button>
                    <button class="btn-secondary" onclick="watchDemonstration()">Watch Demonstration</button>
                </div>
            </div>
        `
    }
};

// Training tools
const trainingTools = {
    timer: {
        title: 'Training Session Timer',
        content: `
            <div class="tool-content">
                <div class="timer-display">
                    <div class="timer-circle">
                        <span id="timer-display">05:00</span>
                    </div>
                    <div class="timer-controls">
                        <button id="start-timer" class="btn-primary">Start</button>
                        <button id="pause-timer" class="btn-secondary">Pause</button>
                        <button id="reset-timer" class="btn-secondary">Reset</button>
                    </div>
                </div>
                <div class="timer-settings">
                    <label for="session-length">Session Length (minutes):</label>
                    <select id="session-length">
                        <option value="5">5 minutes</option>
                        <option value="10" selected>10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="20">20 minutes</option>
                    </select>
                </div>
                <div class="timer-tips">
                    <h5>Training Timer Tips:</h5>
                    <ul>
                        <li>Keep sessions short and focused</li>
                        <li>End on a positive note</li>
                        <li>Take breaks between sessions</li>
                        <li>Consistency is more important than duration</li>
                    </ul>
                </div>
            </div>
        `
    },
    tracker: {
        title: 'Training Progress Tracker',
        content: `
            <div class="tool-content">
                <div class="progress-overview">
                    <h4>Your Training Progress</h4>
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="stat-number" id="total-sessions">0</span>
                            <span class="stat-label">Sessions Completed</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number" id="current-streak">0</span>
                            <span class="stat-label">Day Streak</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number" id="commands-mastered">0</span>
                            <span class="stat-label">Commands Mastered</span>
                        </div>
                    </div>
                </div>

                <div class="command-progress">
                    <h5>Command Mastery</h5>
                    <div class="command-list">
                        <div class="command-item">
                            <span>Sit</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 80%"></div>
                            </div>
                            <span>80%</span>
                        </div>
                        <div class="command-item">
                            <span>Stay</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 60%"></div>
                            </div>
                            <span>60%</span>
                        </div>
                        <div class="command-item">
                            <span>Come</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 90%"></div>
                            </div>
                            <span>90%</span>
                        </div>
                    </div>
                </div>

                <div class="log-session">
                    <h5>Log Today's Session</h5>
                    <form id="session-log-form">
                        <div class="form-group">
                            <label for="commands-practiced">Commands Practiced:</label>
                            <select id="commands-practiced" multiple>
                                <option value="sit">Sit</option>
                                <option value="stay">Stay</option>
                                <option value="come">Come</option>
                                <option value="down">Down</option>
                                <option value="heel">Heel</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="session-notes">Notes:</label>
                            <textarea id="session-notes" placeholder="How did the session go?"></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Log Session</button>
                    </form>
                </div>
            </div>
        `
    },
    quiz: {
        title: 'Animal Behavior Quiz',
        content: `
            <div class="tool-content">
                <div class="quiz-container">
                    <div class="quiz-header">
                        <h4>Test Your Knowledge</h4>
                        <div class="quiz-progress">
                            <span id="current-question">1</span> of <span id="total-questions">10</span>
                        </div>
                    </div>

                    <div class="quiz-question" id="quiz-question">
                        <p>What does it mean when a dog wags its tail?</p>
                    </div>

                    <div class="quiz-options" id="quiz-options">
                        <button class="quiz-option" data-answer="a">Always means the dog is happy</button>
                        <button class="quiz-option" data-answer="b">Can indicate various emotions depending on context</button>
                        <button class="quiz-option" data-answer="c">Only happens when meeting new people</button>
                        <button class="quiz-option" data-answer="d">Is a sign of aggression</button>
                    </div>

                    <div class="quiz-result" id="quiz-result" style="display: none;">
                        <div class="result-message">
                            <h5>Correct!</h5>
                            <p>Tail wagging can indicate happiness, excitement, nervousness, or even agitation depending on the speed, height, and context.</p>
                        </div>
                        <button id="next-question" class="btn-primary">Next Question</button>
                    </div>

                    <div class="quiz-score" id="quiz-score" style="display: none;">
                        <h4>Quiz Complete!</h4>
                        <div class="score-display">
                            <span class="score-number">8</span>/<span class="total-number">10</span>
                        </div>
                        <p>Great job! You're well on your way to becoming a pet behavior expert.</p>
                        <button class="btn-primary" onclick="retakeQuiz()">Retake Quiz</button>
                    </div>
                </div>
            </div>
        `
    },
    videos: {
        title: 'Training Video Library',
        content: `
            <div class="tool-content">
                <div class="video-categories">
                    <button class="video-category active" data-category="all">All Videos</button>
                    <button class="video-category" data-category="beginner">Beginner</button>
                    <button class="video-category" data-category="intermediate">Intermediate</button>
                    <button class="video-category" data-category="advanced">Advanced</button>
                </div>

                <div class="video-grid">
                    <div class="video-card" data-category="beginner">
                        <div class="video-thumbnail">
                            <img src="https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Teaching+SIT" alt="Teaching Sit">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h5>Teaching Your Dog to Sit</h5>
                            <p>Step-by-step guide for beginners</p>
                            <span class="video-duration">5:32</span>
                        </div>
                    </div>

                    <div class="video-card" data-category="beginner">
                        <div class="video-thumbnail">
                            <img src="https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Positive+Reinforcement" alt="Positive Reinforcement">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h5>Positive Reinforcement Basics</h5>
                            <p>Why rewards work better than punishment</p>
                            <span class="video-duration">8:15</span>
                        </div>
                    </div>

                    <div class="video-card" data-category="intermediate">
                        <div class="video-thumbnail">
                            <img src="https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Loose+Leash+Walking" alt="Loose Leash Walking">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h5>Mastering Loose Leash Walking</h5>
                            <p>Stop pulling and enjoy walks together</p>
                            <span class="video-duration">12:45</span>
                        </div>
                    </div>

                    <div class="video-card" data-category="advanced">
                        <div class="video-thumbnail">
                            <img src="https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Advanced+Tricks" alt="Advanced Tricks">
                            <div class="play-button">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h5>Advanced Trick Training</h5>
                            <p>Teach roll over, play dead, and more</p>
                            <span class="video-duration">15:20</span>
                        </div>
                    </div>
                </div>

                <div class="video-note">
                    <p><i class="fas fa-info-circle"></i> Videos are coming soon! Sign up for our newsletter to be notified when new content is available.</p>
                </div>
            </div>
        `
    }
};

function setupCategoryNavigation() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            // In a real implementation, this would navigate to a category page
            showNotification(`Opening ${getCategoryName(category)} training lessons...`, 'info');
        });
    });
}

function getCategoryName(category) {
    const names = {
        obedience: 'Obedience Training',
        behavior: 'Behavior Modification',
        socialization: 'Socialization',
        advanced: 'Advanced Training',
        puppy: 'Puppy Training',
        communication: 'Pet Communication'
    };
    return names[category] || category;
}

function setupProgramButtons() {
    // Program start buttons are handled individually
}

function startProgram(programId) {
    showNotification(`Starting ${getProgramName(programId)} program...`, 'success');
    // In a real implementation, this would redirect to the program page
}

function getProgramName(programId) {
    const names = {
        'dog-mastery': 'Complete Dog Training Mastery',
        'cat-behavior': 'Cat Behavior & Training',
        'problem-solving': 'Problem Behavior Solutions'
    };
    return names[programId] || programId;
}

function setupToolButtons() {
    // Tool buttons are handled individually
}

function openTool(toolId) {
    const tool = trainingTools[toolId];
    if (!tool) return;

    const modal = document.getElementById('tool-modal');
    const modalTitle = document.getElementById('tool-title');
    const modalBody = document.getElementById('tool-content');

    modalTitle.textContent = tool.title;
    modalBody.innerHTML = tool.content;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Initialize tool-specific functionality
    if (toolId === 'timer') {
        initializeTimer();
    } else if (toolId === 'tracker') {
        initializeTracker();
    } else if (toolId === 'quiz') {
        initializeQuiz();
    } else if (toolId === 'videos') {
        initializeVideoLibrary();
    }
}

function closeToolModal() {
    const modal = document.getElementById('tool-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openGuide(guideId) {
    const guide = trainingGuides[guideId];
    if (!guide) return;

    const modal = document.getElementById('guide-modal');
    const modalTitle = document.getElementById('guide-title');
    const modalBody = document.getElementById('guide-content');

    modalTitle.textContent = guide.title;
    modalBody.innerHTML = guide.content;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGuideModal() {
    const modal = document.getElementById('guide-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setupGuideModal() {
    // Close modal when clicking outside
    document.getElementById('guide-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGuideModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeGuideModal();
        }
    });
}

function setupToolModal() {
    // Close modal when clicking outside
    document.getElementById('tool-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeToolModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeToolModal();
        }
    });
}

function initializeTimer() {
    let timerInterval;
    let timeLeft = 10 * 60; // 10 minutes in seconds
    let isRunning = false;

    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const lengthSelect = document.getElementById('session-length');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showNotification('Training session complete!', 'success');
                    // Play completion sound or show celebration
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = parseInt(lengthSelect.value) * 60;
        updateDisplay();
    }

    lengthSelect.addEventListener('change', resetTimer);
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateDisplay();
}

function initializeTracker() {
    // Load progress from localStorage
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');

    // Update stats
    document.getElementById('total-sessions').textContent = progress.totalSessions || 0;
    document.getElementById('current-streak').textContent = progress.currentStreak || 0;
    document.getElementById('commands-mastered').textContent = progress.commandsMastered || 0;

    // Setup session logging
    const form = document.getElementById('session-log-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const commands = Array.from(document.getElementById('commands-practiced').selectedOptions)
            .map(option => option.value);
        const notes = document.getElementById('session-notes').value;

        // Save session
        const sessions = JSON.parse(localStorage.getItem('trainingSessions') || '[]');
        sessions.push({
            date: new Date().toISOString(),
            commands: commands,
            notes: notes
        });
        localStorage.setItem('trainingSessions', JSON.stringify(sessions));

        // Update progress
        progress.totalSessions = (progress.totalSessions || 0) + 1;
        localStorage.setItem('trainingProgress', JSON.stringify(progress));

        showNotification('Session logged successfully!', 'success');
        form.reset();
        initializeTracker(); // Refresh stats
    });
}

function initializeQuiz() {
    // Simple quiz implementation
    let currentQuestionIndex = 0;
    let score = 0;
    const questions = [
        {
            question: "What does it mean when a dog wags its tail?",
            options: [
                "Always means the dog is happy",
                "Can indicate various emotions depending on context",
                "Only happens when meeting new people",
                "Is a sign of aggression"
            ],
            correct: 1,
            explanation: "Tail wagging can indicate happiness, excitement, nervousness, or even agitation depending on the speed, height, and context."
        },
        {
            question: "What's the best way to house train a puppy?",
            options: [
                "Punish accidents immediately",
                "Establish a consistent routine with positive reinforcement",
                "Limit access to the entire house",
                "Use adult dog food to speed up the process"
            ],
            correct: 1,
            explanation: "Consistency and positive reinforcement are key to successful house training."
        }
    ];

    function showQuestion(index) {
        if (index >= questions.length) {
            showResults();
            return;
        }

        const question = questions[index];
        document.getElementById('current-question').textContent = index + 1;
        document.getElementById('quiz-question').innerHTML = `<p>${question.question}</p>`;

        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = question.options.map((option, i) =>
            `<button class="quiz-option" data-answer="${i}">${option}</button>`
        ).join('');

        // Add event listeners to options
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', function() {
                const selectedAnswer = parseInt(this.dataset.answer);
                const correct = selectedAnswer === question.correct;

                if (correct) score++;

                showAnswer(correct, question.explanation);
            });
        });

        document.getElementById('quiz-result').style.display = 'none';
    }

    function showAnswer(isCorrect, explanation) {
        const resultDiv = document.getElementById('quiz-result');
        const messageDiv = resultDiv.querySelector('.result-message');

        messageDiv.innerHTML = `
            <h5>${isCorrect ? 'Correct!' : 'Not quite right'}</h5>
            <p>${explanation}</p>
        `;

        resultDiv.style.display = 'block';

        document.getElementById('next-question').onclick = () => {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        };
    }

    function showResults() {
        document.getElementById('quiz-score').style.display = 'block';
        document.querySelector('.score-number').textContent = score;
        document.querySelector('.total-number').textContent = questions.length;
    }

    showQuestion(0);
}

function initializeVideoLibrary() {
    const categoryButtons = document.querySelectorAll('.video-category');
    const videoCards = document.querySelectorAll('.video-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.dataset.category;

            // Filter videos
            videoCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function setupCommunityForum() {
    // Community forum functionality
}

function joinForum() {
    showNotification('Redirecting to community forum...', 'info');
    // In a real implementation, this would redirect to the forum
}

function loadUserProgress() {
    // Load user's training progress
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');

    // Update UI based on progress
    if (progress.completedPrograms) {
        // Show completed programs
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #4CAF50;
    }

    .notification-success i {
        color: #4CAF50;
    }

    .notification-error {
        border-left: 4px solid #F44336;
    }

    .notification-error i {
        color: #F44336;
    }

    .notification-info {
        border-left: 4px solid #2196F3;
    }

    .notification-info i {
        color: #2196F3;
    }

    .training-tip {
        background: #E8F5E8;
        border-left: 4px solid #4CAF50;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
    }

    .training-tip strong {
        color: #2E7D32;
    }

    .guide-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }

    .timer-display {
        text-align: center;
        margin-bottom: 2rem;
    }

    .timer-circle {
        width: 150px;
        height: 150px;
        border: 4px solid #4CAF50;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        font-size: 2rem;
        font-weight: bold;
    }

    .timer-controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .progress-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat {
        text-align: center;
    }

    .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #4CAF50;
    }

    .stat-label {
        font-size: 0.9rem;
        color: #666;
    }

    .command-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .command-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .progress-bar {
        flex: 1;
        height: 8px;
        background: #E0E0E0;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #DDD;
        border-radius: 4px;
        font-family: inherit;
    }

    .form-group textarea {
        min-height: 80px;
        resize: vertical;
    }

    .quiz-container {
        max-width: 500px;
        margin: 0 auto;
    }

    .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .quiz-question {
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .quiz-option {
        padding: 1rem;
        border: 2px solid #E0E0E0;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }

    .quiz-option:hover {
        border-color: #4CAF50;
        background: #F5F5F5;
    }

    .video-categories {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .video-category {
        padding: 0.5rem 1rem;
        border: 2px solid #E0E0E0;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .video-category.active,
    .video-category:hover {
        border-color: #4CAF50;
        background: #4CAF50;
        color: white;
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .video-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        cursor: pointer;
    }

    .video-card:hover {
        transform: translateY(-5px);
    }

    .video-thumbnail {
        position: relative;
        height: 150px;
        overflow: hidden;
    }

    .video-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }

    .video-info {
        padding: 1rem;
    }

    .video-info h5 {
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }

    .video-info p {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .video-duration {
        color: #999;
        font-size: 0.8rem;
    }

    .video-note {
        background: #FFF3E0;
        border: 1px solid #FF9800;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        color: #E65100;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);