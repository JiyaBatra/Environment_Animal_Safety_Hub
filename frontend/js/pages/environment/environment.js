/**
 * Environment Page JavaScript
 *
 * Initializes animations and interactive features for the environment awareness page.
 * Uses AOS (Animate On Scroll) library for smooth scroll-triggered animations.
 *
 * Features:
 * - Scroll-triggered animations for environmental content
 * - Smooth easing transitions
 * - One-time animation execution for performance
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 * @requires AOS (Animate On Scroll) library
 */

// Initialize AOS (Animate On Scroll) library for environment page animations
AOS.init({
    duration: 1000,    // Animation duration in milliseconds
    once: true,        // Animation occurs only once
    easing: "ease-in-out" // Smooth easing function
});