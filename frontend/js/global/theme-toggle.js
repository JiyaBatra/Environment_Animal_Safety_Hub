/**
 * Theme Toggle Logic
 * Handles switching between light and dark modes
 */

function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Toggle event listener
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(newTheme);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // Toggle body class for legacy support
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
    
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    const icon = themeToggle.querySelector("i");
    if (icon) {
        if (theme === "dark") {
            icon.className = "fa-solid fa-sun";
            themeToggle.style.color = "#ffd700"; // Sun color
        } else {
            icon.className = "fa-solid fa-moon";
            themeToggle.style.color = "#ffffff"; // Moon color
        }
    }
}

// Initial check (non-blocking)
(function() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    // Note: body might not exist yet if this runs in head
    document.addEventListener("DOMContentLoaded", () => {
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }
    });
})();
