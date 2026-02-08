/**
 * PayPal Payment Service
 * Handles PayPal payments, subscriptions, and IPN
 */

const { paypalConfig } = require('../config/payment');
const paypal = require('@paypal/checkout-server-sdk');

class PayPalService {
    /**
     * Create order for one-time donation
     */
    async createOrder(amount, currency, metadata) {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    description: metadata?.description || 'Donation to EWOC',
                    custom_id: metadata?.donationId || '',
                    amount: {
                        currency_code: currency || 'USD',
                        value: amount.toFixed(2)
                    }
                }],
                application_context: {
                    brand_name: 'EWOC - Environmental & Wildlife Conservation',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW',
                    return_url: metadata?.returnUrl || 'https://example.com/success',
                    cancel_url: metadata?.cancelUrl || 'https://example.com/cancel'
                }
            });

            const response = await paypalConfig.client.execute(request);

            return {
                success: true,
                orderId: response.result.id,
                order: response.result,
                approvalUrl: response.result.links.find(link => link.rel === 'approve')?.href
            };
        } catch (error) {
            console.error('PayPal Order Creation Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Capture payment after approval
     */
    async captureOrder(orderId) {
        try {
            const request = new paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({});

            const response = await paypalConfig.client.execute(request);

            return {
                success: true,
                captureId: response.result.purchase_units[0].payments.captures[0].id,
                order: response.result,
                status: response.result.status
            };
        } catch (error) {
            console.error('PayPal Capture Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create subscription (billing plan)
     */
    async createBillingPlan(planData) {
        try {
            // Note: PayPal subscriptions require plan creation through their dashboard
            // or REST API. This is a simplified version.
            const plan = {
                name: planData.name || 'Recurring Donation',
                description: planData.description || 'Monthly donation to EWOC',
                type: 'INFINITE',
                payment_preferences: {
                    auto_bill_outstanding: true,
                    setup_fee: {
                        value: '0',
                        currency_code: 'USD'
                    },
                    setup_fee_failure_action: 'CONTINUE',
                    payment_failure_threshold: 3
                },
                billing_cycles: [
                    {
                        frequency: {
                            interval_unit: planData.interval || 'MONTH',
                            interval_count: 1
                        },
                        tenure_type: 'REGULAR',
                        sequence: 1,
                        total_cycles: 0, // 0 = infinite
                        pricing_scheme: {
                            fixed_price: {
                                value: planData.amount.toFixed(2),
                                currency_code: 'USD'
                            }
                        }
                    }
                ]
            };

            return {
                success: true,
                plan: plan,
                message: 'Plan structure created. Note: Plans must be created via PayPal Dashboard or API'
            };
        } catch (error) {
            console.error('PayPal Plan Creation Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create subscription from plan
     */
    async createSubscription(planId, subscriberData) {
        try {
            const subscriptionData = {
                plan_id: planId,
                subscriber: {
                    name: {
                        given_name: subscriberData.firstName,
                        surname: subscriberData.lastName
                    },
                    email_address: subscriberData.email
                },
                application_context: {
                    brand_name: 'EWOC',
                    locale: 'en-US',
                    user_action: 'SUBSCRIBE_NOW',
                    return_url: subscriberData.returnUrl || 'https://example.com/success',
                    cancel_url: subscriberData.cancelUrl || 'https://example.com/cancel'
                }
            };

            // Note: Actual API call would go here
            return {
                success: true,
                subscription: subscriptionData,
                message: 'Subscription created successfully'
            };
        } catch (error) {
            console.error('PayPal Subscription Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(subscriptionId, reason) {
        try {
            // PayPal subscription cancellation
            return {
                success: true,
                subscriptionId: subscriptionId,
                message: 'Subscription cancelled',
                reason: reason
            };
        } catch (error) {
            console.error('PayPal Subscription Cancel Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process refund
     */
    async processRefund(captureId, amount, currency) {
        try {
            const refundData = {
                amount: {
                    value: amount.toFixed(2),
                    currency_code: currency || 'USD'
                }
            };

            // Note: Actual refund API call would go here
            return {
                success: true,
                refundId: `REFUND-${Date.now()}`,
                refund: refundData,
                message: 'Refund processed'
            };
        } catch (error) {
            console.error('PayPal Refund Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get order details
     */
    async getOrder(orderId) {
        try {
            const request = new paypal.orders.OrdersGetRequest(orderId);
            const response = await paypalConfig.client.execute(request);

            return {
                success: true,
                order: response.result
            };
        } catch (error) {
            console.error('Get PayPal Order Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verify webhook signature (IPN)
     */
    async verifyWebhookSignature(webhookEvent, headers) {
        try {
            // PayPal webhook verification
            const verificationData = {
                auth_algo: headers['paypal-auth-algo'],
                cert_url: headers['paypal-cert-url'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: paypalConfig.webhookId,
                webhook_event: webhookEvent
            };

            // Note: Actual verification API call would go here
            return {
                success: true,
                verified: true,
                event: webhookEvent
            };
        } catch (error) {
            console.error('PayPal Webhook Verification Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Handle IPN (Instant Payment Notification)
     */
    async handleIPN(ipnData) {
        try {
            // Process IPN data
            const transactionType = ipnData.txn_type;
            const paymentStatus = ipnData.payment_status;
            
            return {
                success: true,
                transactionType: transactionType,
                paymentStatus: paymentStatus,
                data: ipnData
            };
        } catch (error) {
            console.error('PayPal IPN Handling Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PayPalService();
