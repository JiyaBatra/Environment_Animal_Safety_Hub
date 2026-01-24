/**
 * Community Page JavaScript
 *
 * Handles login, OTP verification, countdown timer, and animated background effects
 * for the environmental and animal safety community platform.
 *
 * Features:
 * - User authentication (login/OTP)
 * - OTP countdown timer
 * - Animated eco-friendly background with floating emojis
 * - Particle animation system
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

/**
 * Handle user login - redirects to posts page
 */
function login() {
    window.location.href = "post.html";
}

/**
 * Handle OTP verification - redirects to posts page
 */
function verifyOtp() {
    window.location.href = "post.html";
}

// Countdown timer for OTP
let time = 120;
const timerEl = document.getElementById("time");

if (timerEl) {
    const timer = setInterval(() => {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        time--;

        if (time < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

// Animated eco-friendly background with floating emojis
const ecoBg = document.getElementById("eco-bg");

if (ecoBg) {
    const emojis = [
        "🌱", "🍃", "🌍", "☀️", "🌿", "🌸", "🐦", "🐱", "🐻", "🐨", "🦋", "🐝"
    ];

    const COUNT = 35;
    const particles = [];

    /**
     * Get current window width
     * @returns {number} Window width in pixels
     */
    const width = () => window.innerWidth;

    /**
     * Get current window height
     * @returns {number} Window height in pixels
     */
    const height = () => window.innerHeight;

    /**
     * Create a new floating emoji particle
     * @returns {Object} Particle object with element and movement properties
     */
    function createParticle() {
        const el = document.createElement("span");
        el.className = "eco-emoji";
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const size = Math.random() * 16 + 18;
        el.style.fontSize = size + "px";

        ecoBg.appendChild(el);

        return {
            el,
            size,
            x: Math.random() * (width() - size),
            y: Math.random() * (height() - size),
            dx: (Math.random() - 0.5) * 1.8,
            dy: (Math.random() - 0.5) * 1.8
        };
    }

    // Create particles
    for (let i = 0; i < COUNT; i++) {
        particles.push(createParticle());
    }

    /**
     * Animate all particles with bouncing movement
     */
    function animate() {
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;

            // Bounce from edges
            if (p.x <= 0 || p.x >= width() - p.size) p.dx *= -1;
            if (p.y <= 0 || p.y >= height() - p.size) p.dy *= -1;

            p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
        particles.forEach(p => {
            p.x = Math.min(p.x, width() - p.size);
            p.y = Math.min(p.y, height() - p.size);
        });
    });
}