// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check if user previously preferred Light mode
// Default is now DARK (so we check if 'light' is saved)
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
}

themeToggle.addEventListener('click', () => {
    // Toggle the Light Theme class
    body.classList.toggle('light-theme');
    
    // Save preference
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

// Data and Calculator
const feedingData = {
    bird: {
        small: "15-20g seeds (Millet/Sunflower). Clean water.",
        medium: "30g Mixed Seeds + Fruit chunks.",
        large: "N/A",
        xlarge: "N/A"
    },
    squirrel: {
        small: "20g nuts (unsalted) & fruit.",
        medium: "40g corn, apple, walnuts.",
        large: "N/A",
        xlarge: "N/A"
    },
    cat: {
        small: "80g Wet Food / 30g Dry Food.",
        medium: "150g Wet Food / 50g Dry Food.",
        large: "200g+ Wet Food.",
        xlarge: "N/A"
    },
    dog: {
        small: "100g Balanced Meal.",
        medium: "300g Balanced Meal.",
        large: "500g Balanced Meal.",
        xlarge: "800g+ Balanced Meal."
    }
};

const calculateBtn = document.getElementById('calculateBtn');
const resultBox = document.getElementById('resultBox');
const resultContent = document.getElementById('resultContent');

calculateBtn.addEventListener('click', () => {
    const type = document.getElementById('animalType').value;
    const size = document.getElementById('animalSize').value;

    if (!type || !size) {
        // Simple shake effect
        calculateBtn.style.transform = "translateX(5px)";
        setTimeout(() => calculateBtn.style.transform = "translateX(0)", 100);
        return;
    }

    resultBox.classList.remove('show');

    setTimeout(() => {
        let result = "Data unavailable for this combination.";
        if (feedingData[type] && feedingData[type][size]) {
            result = feedingData[type][size];
        }
        resultContent.innerHTML = `<strong>Recommendation:</strong><br>${result}`;
        resultBox.classList.add('show');
    }, 100);
});