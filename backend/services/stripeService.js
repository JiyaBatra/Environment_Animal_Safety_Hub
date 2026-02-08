/**
 * Stripe Payment Service
 * Handles credit/debit card processing, tokenization, subscriptions, and refunds
 */

const { stripeConfig } = require('../config/payment');
const stripe = stripeConfig.stripe;

class StripeService {
    /**
     * Create a payment intent for one-time donations
     */
    async createPaymentIntent(amount, currency, metadata) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency || 'usd',
                metadata: metadata || {},
                automatic_payment_methods: {
                    enabled: true
                }
            });
            
            return {
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error('Stripe Payment Intent Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a customer for recurring donations
     */
    async createCustomer(donorData) {
        try {
            const customer = await stripe.customers.create({
                email: donorData.email,
                name: donorData.name,
                phone: donorData.phone,
                address: donorData.address ? {
                    line1: donorData.address.street,
                    city: donorData.address.city,
                    state: donorData.address.state,
                    postal_code: donorData.address.zip,
                    country: donorData.address.country || 'US'
                } : undefined,
                metadata: {
                    donorId: donorData.donorId
                }
            });
            
            return {
                success: true,
                customerId: customer.id,
                customer: customer
            };
        } catch (error) {
            console.error('Stripe Customer Creation Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Attach payment method to customer (for tokenization)
     */
    async attachPaymentMethod(paymentMethodId, customerId) {
        try {
            const paymentMethod = await stripe.paymentMethods.attach(
                paymentMethodId,
                { customer: customerId }
            );

            // Set as default payment method
            await stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });

            return {
                success: true,
                paymentMethod: paymentMethod
            };
        } catch (error) {
            console.error('Payment Method Attach Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create subscription for recurring donations
     */
    async createSubscription(customerId, priceId, amount, interval) {
        try {
            // Create a price if not provided
            let finalPriceId = priceId;
            if (!priceId && amount) {
                const price = await stripe.prices.create({
                    currency: 'usd',
                    unit_amount: Math.round(amount * 100),
                    recurring: {
                        interval: interval || 'month'
                    },
                    product_data: {
                        name: 'Recurring Donation'
                    }
                });
                finalPriceId = price.id;
            }

            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: finalPriceId }],
                expand: ['latest_invoice.payment_intent']
            });

            return {
                success: true,
                subscriptionId: subscription.id,
                subscription: subscription,
                status: subscription.status
            };
        } catch (error) {
            console.error('Stripe Subscription Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update subscription
     */
    async updateSubscription(subscriptionId, updates) {
        try {
            const subscription = await stripe.subscriptions.update(
                subscriptionId,
                updates
            );

            return {
                success: true,
                subscription: subscription
            };
        } catch (error) {
            console.error('Stripe Subscription Update Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
        try {
            const subscription = await stripe.subscriptions.update(
                subscriptionId,
                { cancel_at_period_end: cancelAtPeriodEnd }
            );

            return {
                success: true,
                subscription: subscription,
                message: cancelAtPeriodEnd 
                    ? 'Subscription will cancel at period end' 
                    : 'Subscription cancelled immediately'
            };
        } catch (error) {
            console.error('Stripe Subscription Cancel Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process refund
     */
    async processRefund(paymentIntentId, amount, reason) {
        try {
            const refundData = {
                payment_intent: paymentIntentId
            };

            if (amount) {
                refundData.amount = Math.round(amount * 100); // Partial refund
            }

            if (reason) {
                refundData.reason = reason; // 'duplicate', 'fraudulent', 'requested_by_customer'
            }

            const refund = await stripe.refunds.create(refundData);

            return {
                success: true,
                refundId: refund.id,
                refund: refund,
                status: refund.status
            };
        } catch (error) {
            console.error('Stripe Refund Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Retrieve payment intent details
     */
    async getPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            return {
                success: true,
                paymentIntent: paymentIntent
            };
        } catch (error) {
            console.error('Retrieve Payment Intent Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * List customer payment methods
     */
    async listPaymentMethods(customerId) {
        try {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: 'card'
            });

            return {
                success: true,
                paymentMethods: paymentMethods.data
            };
        } catch (error) {
            console.error('List Payment Methods Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create setup intent for saving card without charging
     */
    async createSetupIntent(customerId) {
        try {
            const setupIntent = await stripe.setupIntents.create({
                customer: customerId,
                payment_method_types: ['card']
            });

            return {
                success: true,
                clientSecret: setupIntent.client_secret,
                setupIntentId: setupIntent.id
            };
        } catch (error) {
            console.error('Setup Intent Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload, signature) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                stripeConfig.webhookSecret
            );
            return { success: true, event };
        } catch (error) {
            console.error('Webhook Signature Verification Failed:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new StripeService();
