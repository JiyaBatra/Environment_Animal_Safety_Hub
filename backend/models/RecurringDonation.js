const mongoose = require('mongoose');

const RecurringDonationSchema = new mongoose.Schema({
    recurringId: {
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
    monthlyAmount: {
        type: Number,
        required: true,
        min: 1
    },
    
    currency: { type: String, default: 'USD' },
    
    // Payment Schedule
    frequency: {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'annually'],
        default: 'monthly'
    },
    
    dayOfMonth: { type: Number, min: 1, max: 31, default: 15 },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    
    // Payment Method
    paymentMethod: {
        type: String,
        enum: ['credit-card', 'ach', 'paypal'],
        required: true
    },
    
    // Payment Information
    paymentInfo: {
        accountLast4: String,
        accountType: String,
        expiryDate: Date,
        cardBrand: String
    },
    
    // Campaign Association
    campaignId: String,
    campaignName: String,
    
    // Status
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'failed'],
        default: 'active'
    },
    
    pausedDate: Date,
    cancellationDate: Date,
    
    // Cancellation Reasons & Retention
    cancellationReason: String,
    retentionAttempts: [{
        date: Date,
        method: String, // email, phone, special-offer
        outcome: String, // success, declined
        incentiveOffered: String
    }],
    
    // Payment Tracking
    payments: [{
        paymentId: String,
        paymentDate: Date,
        amount: Number,
        status: { type: String, enum: ['completed', 'pending', 'failed'] },
        transactionId: String,
        failureReason: String,
        retryCount: { type: Number, default: 0 },
        nextRetryDate: Date
    }],
    
    totalPaymentsCompleted: { type: Number, default: 0 },
    totalAmountDonated: { type: Number, default: 0 },
    consecutiveSuccessfulPayments: { type: Number, default: 0 },
    
    // Payment Failure Handling
    failureTracking: {
        consecutiveFailures: { type: Number, default: 0 },
        maxConsecutiveFailures: { type: Number, default: 3 },
        lastFailureDate: Date,
        failureAlertSent: { type: Boolean, default: false }
    },
    
    // Upgrade/Downgrade History
    amountHistory: [{
        date: Date,
        previousAmount: Number,
        newAmount: Number,
        reason: String
    }],
    
    frequencyHistory: [{
        date: Date,
        previousFrequency: String,
        newFrequency: String,
        reason: String
    }],
    
    // Anniversary & Recognition
    anniversaryDate: { type: Date, default: Date.now },
    nextAnniversaryDate: Date,
    anniversaryNotificationSent: { type: Boolean, default: false },
    
    // Recognition
    sustainerBenefits: [String],
    recognitionLevel: { type: String, enum: ['basic', 'silver', 'gold', 'platinum'] },
    
    // Communication Preferences
    sendReceipts: { type: Boolean, default: true },
    receiptFrequency: { type: String, enum: ['monthly', 'quarterly', 'annually'], default: 'monthly' },
    announcements: { type: Boolean, default: true },
    impactReports: { type: Boolean, default: true },
    taxReceiptMonth: { type: Number, default: 12 }, // December for annual receipt
    
    // Notes
    donorNotes: String,
    internalNotes: String,
    
    createdDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save middleware
RecurringDonationSchema.pre('save', async function(next) {
    if (!this.recurringId) {
        const count = await mongoose.model('RecurringDonation').countDocuments();
        this.recurringId = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    
    // Calculate next anniversary date
    if (this.status === 'active' && !this.nextAnniversaryDate) {
        const nextAnniversary = new Date(this.anniversaryDate);
        nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
        this.nextAnniversaryDate = nextAnniversary;
    }
    
    this.lastUpdated = new Date();
    next();
});

// Calculate recognition level based on duration and amount
RecurringDonationSchema.methods.calculateRecognitionLevel = function() {
    const monthlyAmount = this.monthlyAmount;
    const durationMonths = this.totalPaymentsCompleted;
    const score = (monthlyAmount * durationMonths);
    
    if (score > 36000) {
        this.recognitionLevel = 'platinum';
    } else if (score > 18000) {
        this.recognitionLevel = 'gold';
    } else if (score > 6000) {
        this.recognitionLevel = 'silver';
    } else {
        this.recognitionLevel = 'basic';
    }
};

// Get annual giving amount
RecurringDonationSchema.methods.getAnnualGivingAmount = function() {
    const frequencyMultipliers = {
        'weekly': 52,
        'biweekly': 26,
        'monthly': 12,
        'quarterly': 4,
        'annually': 1
    };
    
    return this.monthlyAmount * (frequencyMultipliers[this.frequency] || 12);
};

// Record payment
RecurringDonationSchema.methods.recordPayment = function(amount, status, transactionId) {
    const payment = {
        paymentId: `PAY-${Date.now()}`,
        paymentDate: new Date(),
        amount: amount,
        status: status,
        transactionId: transactionId,
        failureReason: status === 'failed' ? 'Payment declined' : null,
        retryCount: 0
    };
    
    this.payments.push(payment);
    
    if (status === 'completed') {
        this.totalPaymentsCompleted += 1;
        this.totalAmountDonated += amount;
        this.consecutiveSuccessfulPayments += 1;
        this.failureTracking.consecutiveFailures = 0;
    } else if (status === 'failed') {
        this.failureTracking.consecutiveFailures += 1;
        this.failureTracking.lastFailureDate = new Date();
        this.consecutiveSuccessfulPayments = 0;
        
        if (this.failureTracking.consecutiveFailures >= this.failureTracking.maxConsecutiveFailures) {
            this.status = 'failed';
            this.failureTracking.failureAlertSent = true;
        }
    }
    
    return this.save();
};

// Check if anniversary is this month
RecurringDonationSchema.methods.isAnniversaryMonth = function() {
    const today = new Date();
    const nextAnniversary = this.nextAnniversaryDate;
    
    return today.getMonth() === nextAnniversary.getMonth() &&
           today.getFullYear() === nextAnniversary.getFullYear() &&
           !this.anniversaryNotificationSent;
};

module.exports = mongoose.model('RecurringDonation', RecurringDonationSchema);
