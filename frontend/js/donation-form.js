/**
 * Donation Form Handler
 * Manages multi-step donation form and payment processing
 */

// Form state
let donationData = {
    amount: 100,
    type: 'one-time',
    interval: 'month',
    donor: {},
    purpose: 'general',
    tribute: {},
    paymentMethod: 'stripe'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    initializeDonationForm();
    await initializePaymentGateways();
    setupEventListeners();
    updateImpactDisplay();
});

/**
 * Initialize donation form
 */
function initializeDonationForm() {
    // Set default amount
    const defaultCard = document.querySelector('.giving-level-card[data-amount="100"]');
    if (defaultCard) {
        defaultCard.classList.add('active');
    }
}

/**
 * Initialize payment gateways
 */
async function initializePaymentGateways() {
    try {
        // Initialize Stripe (Replace with your publishable key)
        const stripeKey = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';
        await window.paymentProcessor.initializeStripe(stripeKey);
        window.paymentProcessor.createCardElement('card-element');

        // Initialize PayPal buttons (will be rendered when PayPal is selected)
        console.log('Payment gateways initialized');
    } catch (error) {
        console.error('Payment gateway initialization error:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Donation type selector
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            donationData.type = e.currentTarget.dataset.type;
            updateSummary();
            
            // Show/hide save card option for recurring
            const saveCardOption = document.getElementById('saveCardOption');
            if (donationData.type !== 'one-time') {
                saveCardOption.style.display = 'block';
                document.getElementById('saveCard').checked = true;
            } else {
                saveCardOption.style.display = 'none';
            }
        });
    });

    // Giving level cards
    document.querySelectorAll('.giving-level-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.giving-level-card').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            donationData.amount = parseFloat(e.currentTarget.dataset.amount);
            document.getElementById('customAmount').value = '';
            updateImpactDisplay();
            updateSummary();
        });
    });

    // Custom amount input
    document.getElementById('customAmount').addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value);
        if (amount && amount > 0) {
            document.querySelectorAll('.giving-level-card').forEach(c => c.classList.remove('active'));
            donationData.amount = amount;
            updateImpactDisplay();
            updateSummary();
        }
    });

    // Donation purpose
    document.getElementById('donationPurpose').addEventListener('change', (e) => {
        donationData.purpose = e.target.value;
        const tributeSection = document.getElementById('tributeSection');
        
        if (e.target.value === 'memorial' || e.target.value === 'tribute') {
            tributeSection.style.display = 'block';
        } else {
            tributeSection.style.display = 'none';
        }
        updateSummary();
    });

    // Notify honoree checkbox
    document.getElementById('notifyHonoree').addEventListener('change', (e) => {
        const notification = document.getElementById('honoreeNotification');
        notification.style.display = e.target.checked ? 'block' : 'none';
    });

    // Payment method selector
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            donationData.paymentMethod = e.currentTarget.dataset.method;
            
            // Show/hide payment forms
            if (donationData.paymentMethod === 'stripe') {
                document.getElementById('stripePaymentForm').style.display = 'block';
                document.getElementById('paypalPaymentForm').style.display = 'none';
            } else {
                document.getElementById('stripePaymentForm').style.display = 'none';
                document.getElementById('paypalPaymentForm').style.display = 'block';
                renderPayPalButtons();
            }
        });
    });

    // Submit payment button
    document.getElementById('submitPayment').addEventListener('click', handlePaymentSubmission);
}

/**
 * Navigate to step
 */
function goToStep(stepNumber) {
    // Validate current step before proceeding
    const currentStep = document.querySelector('.step-content.active');
    const currentStepNumber = parseInt(currentStep.id.split('-')[1]);

    if (stepNumber > currentStepNumber) {
        if (!validateStep(currentStepNumber)) {
            return;
        }
    }

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');

    // Update summary when entering payment step
    if (stepNumber === 3) {
        updateSummary();
        collectDonorData();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Validate step
 */
function validateStep(stepNumber) {
    if (stepNumber === 1) {
        if (!donationData.amount || donationData.amount < 1) {
            alert('Please select or enter a donation amount');
            return false;
        }
    } else if (stepNumber === 2) {
        const name = document.getElementById('donorName').value.trim();
        const email = document.getElementById('donorEmail').value.trim();
        
        if (!name) {
            alert('Please enter your name');
            return false;
        }
        
        if (!email || !window.paymentProcessor.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        const purpose = document.getElementById('donationPurpose').value;
        if ((purpose === 'memorial' || purpose === 'tribute') && !document.getElementById('honoreeName').value.trim()) {
            alert('Please enter the honoree name');
            return false;
        }
    } else if (stepNumber === 3) {
        if (!document.getElementById('agreeTerms').checked) {
            alert('Please agree to the terms and conditions');
            return false;
        }
    }
    
    return true;
}

/**
 * Collect donor data from form
 */
function collectDonorData() {
    donationData.donor = {
        name: document.getElementById('donorName').value.trim(),
        email: document.getElementById('donorEmail').value.trim(),
        phone: document.getElementById('donorPhone').value.trim(),
        company: document.getElementById('donorCompany').value.trim(),
        address: {
            street: document.getElementById('donorAddress').value.trim(),
            city: document.getElementById('donorCity').value.trim(),
            state: document.getElementById('donorState').value.trim(),
            zip: document.getElementById('donorZip').value.trim(),
            country: 'US'
        }
    };

    // Tribute/Memorial info
    const purpose = document.getElementById('donationPurpose').value;
    if (purpose === 'memorial' || purpose === 'tribute') {
        donationData.tribute = {
            honoree: document.getElementById('honoreeName').value.trim(),
            type: purpose,
            notify: document.getElementById('notifyHonoree').checked,
            recipientEmail: document.getElementById('honoreeEmail').value.trim(),
            message: document.getElementById('honoreeMessage').value.trim()
        };
    }

    donationData.isAnonymous = document.getElementById('anonymousDonation').checked;
    donationData.comments = document.getElementById('donorComments').value.trim();
}

/**
 * Update impact display
 */
function updateImpactDisplay() {
    const impacts = window.paymentProcessor.calculateImpact(donationData.amount);
    const impactList = document.getElementById('impactList');
    
    if (impacts.length > 0) {
        impactList.innerHTML = impacts.map(impact => `<li>${impact}</li>`).join('');
        document.getElementById('impactDisplay').style.display = 'block';
    } else {
        document.getElementById('impactDisplay').style.display = 'none';
    }
}

/**
 * Update donation summary
 */
function updateSummary() {
    const typeMap = {
        'one-time': 'One-Time',
        'monthly': 'Monthly Recurring',
        'annual': 'Annual Recurring'
    };
    
    const purposeMap = {
        'general': 'General Fund',
        'wildlife-rescue': 'Wildlife Rescue',
        'habitat-conservation': 'Habitat Conservation',
        'education': 'Education Programs',
        'medical-care': 'Medical Care',
        'memorial': 'In Memory Of',
        'tribute': 'In Honor Of'
    };

    document.getElementById('summaryType').textContent = typeMap[donationData.type];
    document.getElementById('summaryAmount').textContent = window.paymentProcessor.formatCurrency(donationData.amount);
    document.getElementById('summaryPurpose').textContent = purposeMap[donationData.purpose] || donationData.purpose;
    document.getElementById('summaryTotal').textContent = window.paymentProcessor.formatCurrency(donationData.amount);
    document.getElementById('paymentButtonAmount').textContent = window.paymentProcessor.formatCurrency(donationData.amount);
}

/**
 * Render PayPal buttons
 */
function renderPayPalButtons() {
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = ''; // Clear existing buttons

    const donorData = donationData.donor;
    
    window.paymentProcessor.initializePayPalButtons(
        'paypal-button-container',
        donationData.amount,
        donorData,
        handlePayPalSuccess,
        handlePayPalError
    );
}

/**
 * Handle payment submission
 */
async function handlePaymentSubmission() {
    if (!validateStep(3)) {
        return;
    }

    // Only process Stripe payments here (PayPal handled by buttons)
    if (donationData.paymentMethod === 'stripe') {
        await processStripePayment();
    }
}

/**
 * Process Stripe payment
 */
async function processStripePayment() {
    try {
        window.paymentProcessor.showProcessing('Processing your donation...');

        let result;
        
        if (donationData.type === 'one-time') {
            // One-time donation
            result = await window.paymentProcessor.processOneTimeDonation(
                donationData.amount,
                donationData.donor,
                {
                    purpose: donationData.purpose,
                    comments: donationData.comments,
                    isAnonymous: donationData.isAnonymous
                }
            );
        } else {
            // Recurring donation
            const saveCard = document.getElementById('saveCard').checked;
            const interval = donationData.type === 'monthly' ? 'month' : 'year';
            
            result = await window.paymentProcessor.setupRecurringDonation(
                donationData.amount,
                interval,
                donationData.donor,
                saveCard
            );
        }

        window.paymentProcessor.hideProcessing();

        if (result.success) {
            // Save donation to database
            await saveDonation(result);
            
            // Show confirmation
            showConfirmation(result);
        } else {
            window.paymentProcessor.showError(result.error || 'Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        window.paymentProcessor.hideProcessing();
        window.paymentProcessor.showError('An error occurred. Please try again.');
    }
}

/**
 * Handle PayPal success
 */
async function handlePayPalSuccess(data) {
    try {
        window.paymentProcessor.showProcessing('Finalizing your donation...');
        
        // Save donation to database
        await saveDonation({
            orderId: data.orderId,
            captureId: data.captureId,
            paymentMethod: 'paypal'
        });
        
        window.paymentProcessor.hideProcessing();
        
        // Show confirmation
        showConfirmation({
            transactionId: data.captureId,
            paymentMethod: 'paypal'
        });
    } catch (error) {
        console.error('PayPal success handler error:', error);
        window.paymentProcessor.hideProcessing();
    }
}

/**
 * Handle PayPal error
 */
function handlePayPalError(error) {
    console.error('PayPal error:', error);
    window.paymentProcessor.showError('PayPal payment failed. Please try again.');
}

/**
 * Save donation to database
 */
async function saveDonation(paymentResult) {
    try {
        const donationRecord = {
            donorName: donationData.donor.name,
            donorEmail: donationData.donor.email,
            amount: donationData.amount,
            type: donationData.type,
            paymentMethod: donationData.paymentMethod,
            transactionId: paymentResult.transactionId || paymentResult.captureId,
            purpose: donationData.purpose,
            status: 'completed',
            isAnonymous: donationData.isAnonymous,
            comments: donationData.comments,
            tribute: donationData.tribute
        };

        const response = await fetch('/api/donations/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donationRecord)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Save donation error:', error);
    }
}

/**
 * Show confirmation page
 */
function showConfirmation(result) {
    // Update confirmation details
    document.getElementById('confirmTransactionId').textContent = result.transactionId || result.subscriptionId || '-';
    document.getElementById('confirmAmount').textContent = window.paymentProcessor.formatCurrency(donationData.amount);
    document.getElementById('confirmDate').textContent = new Date().toLocaleDateString();
    document.getElementById('confirmEmail').textContent = donationData.donor.email;
    
    const purposeMap = {
        'general': 'General Fund',
        'wildlife-rescue': 'Wildlife Rescue',
        'habitat-conservation': 'Habitat Conservation',
        'education': 'Education Programs',
        'medical-care': 'Medical Care',
        'memorial': 'In Memory Of',
        'tribute': 'In Honor Of'
    };
    document.getElementById('confirmPurpose').textContent = purposeMap[donationData.purpose];

    // Go to confirmation step
    goToStep(4);
}

/**
 * Social sharing functions
 */
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('I just donated to EWOC to help protect wildlife and preserve our environment!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('I just donated to @EWOC to help protect wildlife! Join me in making a difference.');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

// Make functions globally accessible
window.goToStep = goToStep;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;
