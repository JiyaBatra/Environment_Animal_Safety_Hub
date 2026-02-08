/**
 * Enhanced Donation Payment Processing
 * Stripe Elements and PayPal integration
 */

class PaymentProcessor {
    constructor() {
        this.stripe = null;
        this.stripeElements = null;
        this.cardElement = null;
        this.selectedPaymentMethod = 'stripe';
        this.savedPaymentMethods = [];
        this.currentDonor = null;
    }

    /**
     * Initialize Stripe
     */
    async initializeStripe(publishableKey) {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }

        this.stripe = Stripe(publishableKey);
        this.stripeElements = this.stripe.elements();
        return true;
    }

    /**
     * Create Stripe card element
     */
    createCardElement(elementId) {
        const style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        this.cardElement = this.stripeElements.create('card', { style });
        this.cardElement.mount(`#${elementId}`);

        // Handle real-time validation
        this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
                displayError.style.display = 'block';
            } else {
                displayError.textContent = '';
                displayError.style.display = 'none';
            }
        });
    }

    /**
     * Process one-time donation with Stripe
     */
    async processOneTimeDonation(amount, donorData, metadata = {}) {
        try {
            // Create payment intent
            const response = await fetch('/api/payments/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency: 'usd',
                    donorId: donorData.donorId,
                    metadata
                })
            });

            const { clientSecret, paymentIntentId } = await response.json();

            // Confirm payment with card element
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: donorData.name,
                        email: donorData.email,
                        phone: donorData.phone,
                        address: {
                            line1: donorData.address?.street,
                            city: donorData.address?.city,
                            state: donorData.address?.state,
                            postal_code: donorData.address?.zip,
                            country: donorData.address?.country || 'US'
                        }
                    }
                }
            });

            if (result.error) {
                return {
                    success: false,
                    error: result.error.message
                };
            }

            return {
                success: true,
                paymentIntent: result.paymentIntent,
                transactionId: paymentIntentId
            };
        } catch (error) {
            console.error('One-time donation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Setup recurring donation with Stripe
     */
    async setupRecurringDonation(amount, interval, donorData, saveCard = true) {
        try {
            // Create or get customer
            let customerId = donorData.stripeCustomerId;
            
            if (!customerId) {
                const customerResponse = await fetch('/api/payments/stripe/create-customer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donorData)
                });
                const customerData = await customerResponse.json();
                customerId = customerData.customerId;
            }

            // Create setup intent if saving card
            if (saveCard) {
                const setupResponse = await fetch('/api/payments/stripe/create-setup-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customerId })
                });
                const { clientSecret } = await setupResponse.json();

                // Confirm setup
                const setupResult = await this.stripe.confirmCardSetup(clientSecret, {
                    payment_method: {
                        card: this.cardElement,
                        billing_details: {
                            name: donorData.name,
                            email: donorData.email
                        }
                    }
                });

                if (setupResult.error) {
                    return {
                        success: false,
                        error: setupResult.error.message
                    };
                }
            }

            // Create subscription
            const subscriptionResponse = await fetch('/api/payments/stripe/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    amount,
                    interval,
                    donorId: donorData.donorId
                })
            });

            const subscriptionData = await subscriptionResponse.json();

            return {
                success: true,
                subscriptionId: subscriptionData.subscriptionId,
                recurringDonationId: subscriptionData.recurringDonationId
            };
        } catch (error) {
            console.error('Recurring donation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process one-click donation (saved payment method)
     */
    async processOneClickDonation(amount, customerId, paymentMethodId, metadata = {}) {
        try {
            const response = await fetch('/api/payments/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    currency: 'usd',
                    metadata,
                    customer: customerId,
                    payment_method: paymentMethodId,
                    confirm: true
                })
            });

            const data = await response.json();
            return {
                success: data.success,
                transactionId: data.paymentIntentId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Load saved payment methods
     */
    async loadSavedPaymentMethods(customerId) {
        try {
            const response = await fetch(`/api/payments/stripe/payment-methods/${customerId}`);
            const data = await response.json();
            
            if (data.success) {
                this.savedPaymentMethods = data.paymentMethods;
                return data.paymentMethods;
            }
            return [];
        } catch (error) {
            console.error('Load payment methods error:', error);
            return [];
        }
    }

    /**
     * Initialize PayPal buttons
     */
    initializePayPalButtons(elementId, amount, donorData, onSuccess, onError) {
        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded');
            return;
        }

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'donate'
            },
            
            createOrder: async (data, actions) => {
                try {
                    const response = await fetch('/api/payments/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount,
                            currency: 'USD',
                            metadata: {
                                donorId: donorData.donorId,
                                donorName: donorData.name,
                                donorEmail: donorData.email
                            }
                        })
                    });

                    const orderData = await response.json();
                    return orderData.orderId;
                } catch (error) {
                    console.error('Create PayPal order error:', error);
                    if (onError) onError(error);
                }
            },

            onApprove: async (data, actions) => {
                try {
                    const response = await fetch('/api/payments/paypal/capture-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID })
                    });

                    const captureData = await response.json();
                    
                    if (captureData.success) {
                        if (onSuccess) {
                            onSuccess({
                                orderId: data.orderID,
                                captureId: captureData.captureId
                            });
                        }
                    } else {
                        if (onError) onError(captureData.error);
                    }
                } catch (error) {
                    console.error('Capture PayPal order error:', error);
                    if (onError) onError(error);
                }
            },

            onError: (err) => {
                console.error('PayPal error:', err);
                if (onError) onError(err);
            }
        }).render(`#${elementId}`);
    }

    /**
     * Get giving level presets
     */
    getGivingLevelPresets() {
        return [
            { amount: 25, label: '$25', description: 'Feeds 5 animals for a day' },
            { amount: 50, label: '$50', description: 'Provides medical care for 1 animal' },
            { amount: 100, label: '$100', description: 'Supports 1 animal for a week' },
            { amount: 250, label: '$250', description: 'Sponsors an endangered species' },
            { amount: 500, label: '$500', description: 'Funds habitat restoration' },
            { amount: 1000, label: '$1000', description: 'Major conservation impact' }
        ];
    }

    /**
     * Calculate donation impact
     */
    calculateImpact(amount) {
        const impacts = [];
        
        if (amount >= 25) {
            const animals = Math.floor(amount / 5);
            impacts.push(`Feed ${animals} animals for a day`);
        }
        
        if (amount >= 50) {
            const treatments = Math.floor(amount / 50);
            impacts.push(`Provide medical care for ${treatments} animal(s)`);
        }
        
        if (amount >= 100) {
            const weeks = Math.floor(amount / 100);
            impacts.push(`Support ${weeks} animal(s) for a week`);
        }
        
        return impacts;
    }

    /**
     * Validate donation form
     */
    validateDonationForm(formData) {
        const errors = [];

        if (!formData.amount || formData.amount < 1) {
            errors.push('Donation amount must be at least $1');
        }

        if (!formData.donorName || formData.donorName.trim().length < 2) {
            errors.push('Please enter your name');
        }

        if (!formData.donorEmail || !this.isValidEmail(formData.donorEmail)) {
            errors.push('Please enter a valid email address');
        }

        if (formData.donationType === 'tribute' || formData.donationType === 'memorial') {
            if (!formData.honoree || formData.honoree.trim().length < 2) {
                errors.push('Please enter the honoree name');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    /**
     * Show payment processing indicator
     */
    showProcessing(message = 'Processing payment...') {
        const overlay = document.createElement('div');
        overlay.id = 'payment-processing-overlay';
        overlay.innerHTML = `
            <div class="payment-processing-modal">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Hide payment processing indicator
     */
    hideProcessing() {
        const overlay = document.getElementById('payment-processing-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Show success message
     */
    showSuccess(message, details = {}) {
        const modal = document.createElement('div');
        modal.className = 'payment-success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">✓</div>
                <h2>Thank You!</h2>
                <p>${message}</p>
                ${details.transactionId ? `<p class="transaction-id">Transaction ID: ${details.transactionId}</p>` : ''}
                ${details.receiptEmail ? `<p>A receipt has been sent to ${details.receiptEmail}</p>` : ''}
                <button class="btn btn-primary" onclick="this.closest('.payment-success-modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Show error message
     */
    showError(message) {
        const modal = document.createElement('div');
        modal.className = 'payment-error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="error-icon">✕</div>
                <h2>Payment Error</h2>
                <p>${message}</p>
                <button class="btn btn-secondary" onclick="this.closest('.payment-error-modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize global payment processor
window.paymentProcessor = new PaymentProcessor();
