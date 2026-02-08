const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donationId: {
        type: String,
        unique: true,
        required: true
    },
    donorId: {
        type: String,
        required: true,
        index: true
    },
    donorName: String,
    donorEmail: String,
    
    // Donation Details
    type: {
        type: String,
        enum: ['one-time', 'recurring', 'pledge'],
        default: 'one-time'
    },
    
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    
    currency: { type: String, default: 'USD' },
    
    // Payment Method
    paymentMethod: {
        type: String,
        enum: ['credit-card', 'paypal', 'check', 'wire', 'ach', 'in-kind', 'stripe', 'paypal-checkout'],
        required: true
    },
    
    // Payment Gateway Info
    paymentGateway: {
        gateway: { type: String, enum: ['stripe', 'paypal', 'manual'] },
        customerId: String,
        paymentMethodId: String,
        subscriptionId: String
    },
    
    // Card Details (if credit card)
    cardInfo: {
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number,
        fingerprint: String
    },
    
    // Check Details (if check)
    checkInfo: {
        checkNumber: String,
        bankName: String,
        routingNumber: String
    },
    
    // Campaign & Event Association
    campaignId: String,
    campaignName: String,
    eventId: String,
    eventName: String,
    
    // Donation Category
    donationType: {
        type: String,
        enum: ['general', 'memorial', 'tribute', 'matching-gift', 'grant', 'in-kind'],
        default: 'general'
    },
    
    // Memorial/Tribute Details
    memorial: {
        honoree: String,
        honoreeType: { type: String, enum: ['memorial', 'tribute', 'honor-roll'] },
        relationshipToHonoree: String
    },
    
    // In-Kind Donation
    inKindDetails: {
        description: String,
        estimatedValue: Number,
        category: String,
        deliveryDate: Date,
        condition: String,
        notes: String
    },
    
    // Matching Gift
    matchingGift: {
        isMatchingGift: { type: Boolean, default: false },
        matcherName: String,
        matchedAmount: Number
    },
    
    // Status & Tracking
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'pledged'],
        default: 'pending'
    },
    
    transactionId: String,
    receiptSent: { type: Boolean, default: false },
    receiptSentDate: Date,
    
    // Refund Information
    refundDetails: {
        refundId: String,
        refundAmount: Number,
        refundDate: Date,
        reason: String
    },
    
    // Pledge Tracking
    pledgeDetails: {
        pledgeAmount: Number,
        pledgeDueDate: Date,
        paymentSchedule: String,
        amountPaid: { type: Number, default: 0 },
        amountRemaining: Number,
        paymentHistory: [{
            date: Date,
            amount: Number,
            method: String
        }]
    },
    
    // Anonymous Option
    isAnonymous: { type: Boolean, default: false },
    
    // Tax Info
    taxDeductible: { type: Boolean, default: true },
    taxReceiptNumber: String,
    
    // Purpose/Note
    purposeStatement: String,
    donorNotes: String,
    
    // Recurring Donation Reference
    recurringDonationId: String,
    
    // Timeline
    donationDate: { type: Date, default: Date.now },
    processedDate: Date,
    
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware
DonationSchema.pre('save', async function(next) {
    if (!this.donationId) {
        const count = await mongoose.model('Donation').countDocuments();
        this.donationId = `DT-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    }
    
    // Calculate remaining pledge amount
    if (this.pledgeDetails) {
        this.pledgeDetails.amountRemaining = this.pledgeDetails.pledgeAmount - this.pledgeDetails.amountPaid;
    }
    
    this.lastUpdated = new Date();
    next();
});

// Method to generate tax receipt
DonationSchema.methods.generateTaxReceipt = function() {
    if (!this.taxDeductible) return null;
    
    return {
        receiptNumber: this.taxReceiptNumber || `TR-${this.donationId}`,
        donorName: this.donorName,
        donationAmount: this.amount,
        donationDate: this.donationDate,
        donationType: this.donationType,
        taxYear: new Date(this.donationDate).getFullYear(),
        organizationName: 'EWOC - Environmental & Wildlife Conservation',
        taxExemptId: '12-3456789',
        generatedDate: new Date()
    };
};

// Method to process payment
DonationSchema.methods.processPayment = async function() {
    // Simulate payment processing
    this.status = 'processing';
    this.processedDate = new Date();
    return await this.save();
};

module.exports = mongoose.model('Donation', DonationSchema);
