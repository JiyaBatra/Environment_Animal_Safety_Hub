// Pet Travel Tips Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initially hide cards and observe them
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add click tracking for quiz button
    const quizButton = document.querySelector('.btn-primary');
    if (quizButton) {
        quizButton.addEventListener('click', function() {
            // Track quiz engagement
            console.log('Pet Travel Quiz clicked');
            // You could add analytics tracking here
        });
    }

    // Add hover effects for method cards
    const methodCards = document.querySelectorAll('.methods-grid .card, .accommodation-grid .card');
    methodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add interactive checklist functionality
    const checklistItems = document.querySelectorAll('.card li');
    checklistItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
            const checkmark = this.querySelector('::before') || this;
            if (this.classList.contains('checked')) {
                this.style.textDecoration = 'line-through';
                this.style.opacity = '0.7';
            } else {
                this.style.textDecoration = 'none';
                this.style.opacity = '1';
            }
        });
    });

    // Add weather warning alerts
    const weatherCard = document.querySelector('.stress-grid .card:nth-child(2)');
    if (weatherCard) {
        const warningItems = weatherCard.querySelectorAll('li');
        warningItems.forEach(item => {
            if (item.textContent.includes('Never leave pets in parked cars') ||
                item.textContent.includes('heatstroke') ||
                item.textContent.includes('frostbite')) {
                item.style.color = '#E76F51';
                item.style.fontWeight = '600';
            }
        });
    }

    // Add tooltip functionality for legal requirements
    const legalItems = document.querySelectorAll('.legal-grid li');
    legalItems.forEach(item => {
        if (item.textContent.includes('international')) {
            item.title = 'Required for crossing country borders - check specific requirements';
        } else if (item.textContent.includes('rabies')) {
            item.title = 'Mandatory for most international travel - timing is critical';
        } else if (item.textContent.includes('microchip')) {
            item.title = 'ISO standard 15-digit microchip required by many countries';
        }
    });
});