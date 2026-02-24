/**
 * Coastal Upwelling Weakening - Fisheries Productivity Analysis Tool
 * Calculates productivity decline based on nutrient reduction
 */

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('results');

    const baselineInput = document.getElementById('baselineNutrients');
    const reductionInput = document.getElementById('reductionPercent');
    const factorInput = document.getElementById('productivityFactor');

    const reducedNutrientsSpan = document.getElementById('reducedNutrients');
    const productivityDeclineSpan = document.getElementById('productivityDecline');
    const catchReductionSpan = document.getElementById('catchReduction');

    // Calculate productivity decline
    function calculateProductivity() {
        const baseline = parseFloat(baselineInput.value);
        const reductionPercent = parseFloat(reductionInput.value);
        const factor = parseFloat(factorInput.value);

        if (isNaN(baseline) || isNaN(reductionPercent) || isNaN(factor)) {
            alert('Please enter valid numbers for all inputs.');
            return;
        }

        // Calculate reduced nutrient level
        const reductionDecimal = reductionPercent / 100;
        const reducedNutrients = baseline * (1 - reductionDecimal);

        // Calculate productivity decline using logarithmic relationship
        // Productivity often follows a logarithmic response to nutrient changes
        const nutrientRatio = reducedNutrients / baseline;
        const productivityRatio = Math.pow(nutrientRatio, factor);

        // Convert to percentage decline
        const productivityDeclinePercent = (1 - productivityRatio) * 100;

        // Estimate fish catch reduction (typically 1.5-2x productivity decline)
        const catchReductionFactor = 1.8; // Conservative estimate
        const catchReductionPercent = productivityDeclinePercent * catchReductionFactor;

        // Update display
        reducedNutrientsSpan.textContent = reducedNutrients.toFixed(1) + ' μmol/L';
        productivityDeclineSpan.textContent = productivityDeclinePercent.toFixed(1) + '%';
        catchReductionSpan.textContent = Math.min(catchReductionPercent, 100).toFixed(1) + '%';

        // Show results with animation
        resultsContainer.style.display = 'block';
        resultsContainer.style.opacity = '0';
        resultsContainer.style.transform = 'translateY(20px)';

        setTimeout(() => {
            resultsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculateProductivity);

    // Allow Enter key to trigger calculation
    [baselineInput, reductionInput, factorInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateProductivity();
            }
        });
    });

    // Input validation and real-time feedback
    function validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || Infinity;

        if (isNaN(value) || value < min || value > max) {
            input.style.borderColor = '#ef4444';
            return false;
        } else {
            input.style.borderColor = '#10b981';
            return true;
        }
    }

    [baselineInput, reductionInput, factorInput].forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            if (!validateInput(this)) {
                // Reset to default if invalid
                if (this.id === 'baselineNutrients') this.value = '20';
                else if (this.id === 'reductionPercent') this.value = '25';
                else if (this.id === 'productivityFactor') this.value = '0.8';
                validateInput(this);
            }
        });
    });

    // Initialize with default values
    validateInput(baselineInput);
    validateInput(reductionInput);
    validateInput(factorInput);

    // Add tooltips for better UX
    const tooltips = {
        'baselineNutrients': 'Typical coastal upwelling nutrient levels range from 10-30 μmol/L',
        'reductionPercent': 'Climate models predict 15-40% reduction in upwelling intensity',
        'productivityFactor': 'Lower values (0.5-0.8) indicate stronger nutrient limitation effects'
    };

    Object.keys(tooltips).forEach(id => {
        const input = document.getElementById(id);
        const label = input.previousElementSibling;

        label.innerHTML += ' <i class="fas fa-info-circle" title="' + tooltips[id] + '" style="color: #6b7280; cursor: help;"></i>';
    });

    // Add smooth scrolling for results
    calculateBtn.addEventListener('click', function() {
        setTimeout(() => {
            resultsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 600);
    });

    // Add loading state to button
    calculateBtn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Calculating...';
        this.disabled = true;

        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 1000);
    });
});