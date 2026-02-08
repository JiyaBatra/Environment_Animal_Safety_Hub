/**
 * Payment Processing Routes
 * Handles Stripe and PayPal payment endpoints
 */

const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const paypalService = require('../services/paypalService');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const RecurringDonation = require('../models/RecurringDonation');

// ========== STRIPE ENDPOINTS ==========

/**
 * Create Stripe payment intent for one-time donation
 */
router.post('/stripe/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, donorId, campaignId, metadata } = req.body;

        const paymentMetadata = {
            donorId,
            campaignId,
            ...metadata
        };

        const result = await stripeService.createPaymentIntent(
            amount,
            currency || 'usd',
            paymentMetadata
        );

        if (result.success) {
            res.json({
                success: true,
                clientSecret: result.clientSecret,
                paymentIntentId: result.paymentIntentId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Create Stripe customer
 */
router.post('/stripe/create-customer', async (req, res) => {
    try {
        const donorData = req.body;
        const result = await stripeService.createCustomer(donorData);

        if (result.success) {
            // Save customer ID to donor record
            const donor = await Donor.findOne({ donorId: donorData.donorId });
            if (donor) {
                donor.paymentInfo = donor.paymentInfo || {};
                donor.paymentInfo.stripeCustomerId = result.customerId;
                await donor.save();
            }

            res.json({
                success: true,
                customerId: result.customerId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Create setup intent for saving card
 */
router.post('/stripe/create-setup-intent', async (req, res) => {
    try {
        const { customerId } = req.body;
        const result = await stripeService.createSetupIntent(customerId);

        if (result.success) {
            res.json({
                success: true,
                clientSecret: result.clientSecret,
                setupIntentId: result.setupIntentId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Create Stripe subscription
 */
router.post('/stripe/create-subscription', async (req, res) => {
    try {
        const { customerId, amount, interval, donorId, metadata } = req.body;

        const result = await stripeService.createSubscription(
            customerId,
            null,
            amount,
            interval || 'month'
        );

        if (result.success) {
            // Create recurring donation record
            const recurringDonation = new RecurringDonation({
                donorId,
                amount,
                frequency: interval || 'monthly',
                status: 'active',
                paymentMethod: 'credit-card',
                stripeSubscriptionId: result.subscriptionId,
                nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ...metadata
            });
            await recurringDonation.save();

            res.json({
                success: true,
                subscriptionId: result.subscriptionId,
                recurringDonationId: recurringDonation.recurringDonationId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Cancel Stripe subscription
 */
router.post('/stripe/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId, cancelAtPeriodEnd } = req.body;

        const result = await stripeService.cancelSubscription(
            subscriptionId,
            cancelAtPeriodEnd !== false
        );

        if (result.success) {
            // Update recurring donation status
            await RecurringDonation.findOneAndUpdate(
                { stripeSubscriptionId: subscriptionId },
                { 
                    status: cancelAtPeriodEnd ? 'cancelling' : 'cancelled',
                    cancellationDate: new Date()
                }
            );

            res.json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Process Stripe refund
 */
router.post('/stripe/refund', async (req, res) => {
    try {
        const { paymentIntentId, amount, reason } = req.body;

        const result = await stripeService.processRefund(
            paymentIntentId,
            amount,
            reason
        );

        if (result.success) {
            // Update donation status
            await Donation.findOneAndUpdate(
                { transactionId: paymentIntentId },
                { 
                    status: 'refunded',
                    refundDetails: {
                        refundId: result.refundId,
                        refundAmount: amount,
                        refundDate: new Date(),
                        reason: reason
                    }
                }
            );

            res.json({
                success: true,
                refundId: result.refundId,
                status: result.status
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get payment methods for customer
 */
router.get('/stripe/payment-methods/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const result = await stripeService.listPaymentMethods(customerId);

        if (result.success) {
            res.json({
                success: true,
                paymentMethods: result.paymentMethods
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== PAYPAL ENDPOINTS ==========

/**
 * Create PayPal order
 */
router.post('/paypal/create-order', async (req, res) => {
    try {
        const { amount, currency, metadata } = req.body;

        const result = await paypalService.createOrder(
            amount,
            currency || 'USD',
            metadata
        );

        if (result.success) {
            res.json({
                success: true,
                orderId: result.orderId,
                approvalUrl: result.approvalUrl
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Capture PayPal order
 */
router.post('/paypal/capture-order', async (req, res) => {
    try {
        const { orderId } = req.body;

        const result = await paypalService.captureOrder(orderId);

        if (result.success) {
            res.json({
                success: true,
                captureId: result.captureId,
                status: result.status,
                order: result.order
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Create PayPal subscription
 */
router.post('/paypal/create-subscription', async (req, res) => {
    try {
        const { planId, subscriberData, donorId } = req.body;

        const result = await paypalService.createSubscription(planId, subscriberData);

        if (result.success) {
            // Create recurring donation record
            const recurringDonation = new RecurringDonation({
                donorId,
                frequency: 'monthly',
                status: 'active',
                paymentMethod: 'paypal',
                paypalSubscriptionId: result.subscription.id,
                nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            await recurringDonation.save();

            res.json({
                success: true,
                subscriptionId: result.subscription.id,
                recurringDonationId: recurringDonation.recurringDonationId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Cancel PayPal subscription
 */
router.post('/paypal/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId, reason } = req.body;

        const result = await paypalService.cancelSubscription(subscriptionId, reason);

        if (result.success) {
            // Update recurring donation status
            await RecurringDonation.findOneAndUpdate(
                { paypalSubscriptionId: subscriptionId },
                { 
                    status: 'cancelled',
                    cancellationDate: new Date()
                }
            );

            res.json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Process PayPal refund
 */
router.post('/paypal/refund', async (req, res) => {
    try {
        const { captureId, amount, currency } = req.body;

        const result = await paypalService.processRefund(captureId, amount, currency);

        if (result.success) {
            res.json({
                success: true,
                refundId: result.refundId
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== WEBHOOK ENDPOINTS ==========

/**
 * Stripe webhook handler
 */
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        const result = stripeService.verifyWebhookSignature(req.body, signature);

        if (!result.success) {
            return res.status(400).json({ success: false, error: 'Invalid signature' });
        }

        const event = result.event;

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCancelled(event.data.object);
                break;

            case 'charge.refunded':
                await handleRefund(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ success: true, received: true });
    } catch (error) {
        console.error('Stripe Webhook Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PayPal webhook handler
 */
router.post('/webhooks/paypal', async (req, res) => {
    try {
        const webhookEvent = req.body;
        const headers = req.headers;

        const result = await paypalService.verifyWebhookSignature(webhookEvent, headers);

        if (!result.success) {
            return res.status(400).json({ success: false, error: 'Invalid signature' });
        }

        // Handle different event types
        const eventType = webhookEvent.event_type;

        switch (eventType) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await handlePayPalPaymentSuccess(webhookEvent);
                break;

            case 'PAYMENT.CAPTURE.DENIED':
                await handlePayPalPaymentFailed(webhookEvent);
                break;

            case 'BILLING.SUBSCRIPTION.CREATED':
            case 'BILLING.SUBSCRIPTION.UPDATED':
                await handlePayPalSubscriptionUpdate(webhookEvent);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                await handlePayPalSubscriptionCancelled(webhookEvent);
                break;

            default:
                console.log(`Unhandled PayPal event: ${eventType}`);
        }

        res.json({ success: true, received: true });
    } catch (error) {
        console.error('PayPal Webhook Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PayPal IPN handler
 */
router.post('/ipn/paypal', async (req, res) => {
    try {
        const ipnData = req.body;
        const result = await paypalService.handleIPN(ipnData);

        if (result.success) {
            // Process IPN data
            console.log('IPN Data:', result.data);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('PayPal IPN Error:', error);
        res.status(500).send('Error');
    }
});

// ========== HELPER FUNCTIONS ==========

async function handlePaymentSuccess(paymentIntent) {
    try {
        // Update donation status
        await Donation.findOneAndUpdate(
            { transactionId: paymentIntent.id },
            { 
                status: 'completed',
                processedDate: new Date()
            }
        );
    } catch (error) {
        console.error('Handle Payment Success Error:', error);
    }
}

async function handlePaymentFailed(paymentIntent) {
    try {
        await Donation.findOneAndUpdate(
            { transactionId: paymentIntent.id },
            { status: 'failed' }
        );
    } catch (error) {
        console.error('Handle Payment Failed Error:', error);
    }
}

async function handleSubscriptionUpdate(subscription) {
    try {
        await RecurringDonation.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            { 
                status: subscription.status,
                lastUpdated: new Date()
            }
        );
    } catch (error) {
        console.error('Handle Subscription Update Error:', error);
    }
}

async function handleSubscriptionCancelled(subscription) {
    try {
        await RecurringDonation.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            { 
                status: 'cancelled',
                cancellationDate: new Date()
            }
        );
    } catch (error) {
        console.error('Handle Subscription Cancelled Error:', error);
    }
}

async function handleRefund(charge) {
    try {
        await Donation.findOneAndUpdate(
            { transactionId: charge.payment_intent },
            { status: 'refunded' }
        );
    } catch (error) {
        console.error('Handle Refund Error:', error);
    }
}

async function handlePayPalPaymentSuccess(event) {
    // Similar to Stripe handler
    console.log('PayPal Payment Success:', event);
}

async function handlePayPalPaymentFailed(event) {
    console.log('PayPal Payment Failed:', event);
}

async function handlePayPalSubscriptionUpdate(event) {
    console.log('PayPal Subscription Update:', event);
}

async function handlePayPalSubscriptionCancelled(event) {
    console.log('PayPal Subscription Cancelled:', event);
}

module.exports = router;
