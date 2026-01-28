const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const FundraisingEvent = require('../models/FundraisingEvent');
const RecurringDonation = require('../models/RecurringDonation');

// ========== DONOR ENDPOINTS ==========

// Create new donor
router.post('/donors', async (req, res) => {
    try {
        const donor = new Donor(req.body);
        donor.givingCapacity.score = donor.calculateGivingCapacity();
        await donor.save();
        res.status(201).json({ success: true, data: donor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all donors
router.get('/donors', async (req, res) => {
    try {
        const { segment, status, searchTerm, sortBy } = req.query;
        let query = {};
        
        if (segment) query.segment = segment;
        if (status) query.status = status;
        if (searchTerm) {
            query.$or = [
                { name: new RegExp(searchTerm, 'i') },
                { email: new RegExp(searchTerm, 'i') }
            ];
        }
        
        let donors = await Donor.find(query);
        
        // Sorting
        if (sortBy === 'recent') {
            donors.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        } else if (sortBy === 'total-amount-desc') {
            donors.sort((a, b) => b.stats.totalAmount - a.stats.totalAmount);
        }
        
        res.json({ success: true, count: donors.length, data: donors });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get donor by ID
router.get('/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findOne({ donorId: req.params.id });
        if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update donor
router.put('/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findOneAndUpdate({ donorId: req.params.id }, req.body, { new: true });
        if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
        donor.updateSegment();
        await donor.save();
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get donor giving capacity
router.get('/donors/:id/giving-capacity', async (req, res) => {
    try {
        const donor = await Donor.findOne({ donorId: req.params.id });
        if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
        const score = donor.calculateGivingCapacity();
        res.json({ success: true, data: { score, capacity: donor.givingCapacity } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== DONATION ENDPOINTS ==========

// Create donation
router.post('/donations', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        
        // Update donor statistics
        const donor = await Donor.findOne({ donorId: donation.donorId });
        if (donor) {
            donor.stats.numberOfGifts += 1;
            donor.stats.totalAmount += donation.amount;
            donor.stats.averageGift = (donor.stats.totalAmount / donor.stats.numberOfGifts).toFixed(2);
            if (donation.amount > donor.stats.largestGift) {
                donor.stats.largestGift = donation.amount;
            }
            donor.stats.lastDonationDate = new Date();
            if (!donor.stats.firstDonationDate) {
                donor.stats.firstDonationDate = new Date();
            }
            donor.updateSegment();
            await donor.save();
        }
        
        // Update campaign if associated
        if (donation.campaignId) {
            const campaign = await Campaign.findOne({ campaignId: donation.campaignId });
            if (campaign) {
                campaign.currentAmount += donation.amount;
                campaign.donationCount += 1;
                await campaign.save();
            }
        }
        
        res.status(201).json({ success: true, data: donation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all donations
router.get('/donations', async (req, res) => {
    try {
        const { status, method, type, donorId } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (method) query.paymentMethod = method;
        if (type) query.donationType = type;
        if (donorId) query.donorId = donorId;
        
        const donations = await Donation.find(query).sort({ donationDate: -1 });
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get donation by ID
router.get('/donations/:id', async (req, res) => {
    try {
        const donation = await Donation.findOne({ donationId: req.params.id });
        if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
        res.json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Process payment
router.post('/donations/:id/process', async (req, res) => {
    try {
        const donation = await Donation.findOne({ donationId: req.params.id });
        if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
        
        await donation.processPayment();
        res.json({ success: true, message: 'Payment processed', data: donation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Generate tax receipt
router.get('/donations/:id/tax-receipt', async (req, res) => {
    try {
        const donation = await Donation.findOne({ donationId: req.params.id });
        if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
        
        const receipt = donation.generateTaxReceipt();
        res.json({ success: true, data: receipt });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create pledge
router.post('/pledges', async (req, res) => {
    try {
        const donation = new Donation({
            ...req.body,
            type: 'pledge',
            status: 'pledged'
        });
        await donation.save();
        res.status(201).json({ success: true, data: donation });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get pledges by status
router.get('/pledges', async (req, res) => {
    try {
        const pledges = await Donation.find({ type: 'pledge' });
        res.json({ success: true, count: pledges.length, data: pledges });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== CAMPAIGN ENDPOINTS ==========

// Create campaign
router.post('/campaigns', async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const { status, category, sortBy } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (category) query.category = category;
        
        let campaigns = await Campaign.find(query);
        
        // Add calculated fields
        campaigns = campaigns.map(cam => ({
            ...cam.toObject(),
            progressPercentage: cam.getProgressPercentage(),
            daysRemaining: cam.getDaysRemaining()
        }));
        
        if (sortBy === 'progress') {
            campaigns.sort((a, b) => b.progressPercentage - a.progressPercentage);
        }
        
        res.json({ success: true, count: campaigns.length, data: campaigns });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ campaignId: req.params.id });
        if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
        res.json({ success: true, data: campaign });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findOneAndUpdate({ campaignId: req.params.id }, req.body, { new: true });
        if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
        res.json({ success: true, data: campaign });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Create peer-to-peer page
router.post('/campaigns/:id/peer-pages', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ campaignId: req.params.id });
        if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
        
        const newPage = {
            pageId: `P2P-${Date.now()}`,
            ...req.body,
            createdDate: new Date(),
            status: 'active'
        };
        
        campaign.peerPages.push(newPage);
        await campaign.save();
        res.status(201).json({ success: true, data: newPage });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get campaign analytics
router.get('/campaigns/:id/analytics', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ campaignId: req.params.id });
        if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
        
        const analytics = {
            campaignId: campaign.campaignId,
            name: campaign.name,
            progressPercentage: campaign.getProgressPercentage(),
            daysRemaining: campaign.getDaysRemaining(),
            currentAmount: campaign.currentAmount,
            goalAmount: campaign.goalAmount,
            donationCount: campaign.donationCount,
            uniqueDonors: campaign.uniqueDonors,
            averageGift: campaign.calculateAverageGift(),
            conversionRate: campaign.calculateConversionRate(),
            analytics: campaign.analytics
        };
        
        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== FUNDRAISING EVENT ENDPOINTS ==========

// Create event
router.post('/events', async (req, res) => {
    try {
        const event = new FundraisingEvent(req.body);
        await event.save();
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all events
router.get('/events', async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (type) query.type = type;
        
        const events = await FundraisingEvent.find(query).sort({ eventDate: -1 });
        res.json({ success: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOne({ eventId: req.params.id });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update event
router.put('/events/:id', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOneAndUpdate({ eventId: req.params.id }, req.body, { new: true });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Register attendee
router.post('/events/:id/register', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOne({ eventId: req.params.id });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        
        const attendee = {
            registrationId: `REG-${Date.now()}`,
            ...req.body,
            registrationDate: new Date(),
            checked_in: false
        };
        
        event.attendees.push(attendee);
        event.ticketing.ticketsSold += 1;
        event.totalAttendees += (req.body.guestCount || 1);
        await event.save();
        
        res.status(201).json({ success: true, data: attendee });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Check in attendee
router.post('/events/:id/check-in/:registrationId', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOne({ eventId: req.params.id });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        
        const attendee = event.attendees.find(a => a.registrationId === req.params.registrationId);
        if (!attendee) return res.status(404).json({ success: false, error: 'Attendee not found' });
        
        attendee.checked_in = true;
        event.checkedInCount += 1;
        await event.save();
        
        res.json({ success: true, message: 'Checked in', data: attendee });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Place bid on auction item
router.post('/events/:id/auction-items/:itemId/bid', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOne({ eventId: req.params.id });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        
        const item = event.auctionItems.find(i => i.itemId === req.params.itemId);
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        
        if (req.body.bidAmount <= item.currentBid) {
            return res.status(400).json({ success: false, error: 'Bid must be higher than current bid' });
        }
        
        item.bidHistory.push({
            bidder: req.body.bidderName,
            amount: req.body.bidAmount,
            bidTime: new Date()
        });
        
        item.currentBid = req.body.bidAmount;
        item.highestBidder = {
            name: req.body.bidderName,
            bidAmount: req.body.bidAmount,
            bidTime: new Date()
        };
        
        await event.save();
        res.json({ success: true, message: 'Bid placed', data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get event revenue summary
router.get('/events/:id/revenue', async (req, res) => {
    try {
        const event = await FundraisingEvent.findOne({ eventId: req.params.id });
        if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
        
        const summary = {
            eventId: event.eventId,
            name: event.name,
            totalRevenue: event.getTotalRevenue(),
            netRevenue: event.getNetRevenue(),
            revenue: event.revenue,
            expenses: event.expenses,
            ticketCapacityPercentage: event.getTicketCapacityPercentage(),
            attendanceRate: event.getAttendanceRate()
        };
        
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== RECURRING DONATION ENDPOINTS ==========

// Create recurring donation
router.post('/recurring-donations', async (req, res) => {
    try {
        const recurring = new RecurringDonation(req.body);
        recurring.calculateRecognitionLevel();
        await recurring.save();
        res.status(201).json({ success: true, data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all recurring donations
router.get('/recurring-donations', async (req, res) => {
    try {
        const { status, donorId } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (donorId) query.donorId = donorId;
        
        const recurring = await RecurringDonation.find(query);
        res.json({ success: true, count: recurring.length, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get recurring donation by ID
router.get('/recurring-donations/:id', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update recurring donation amount
router.put('/recurring-donations/:id/amount', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        recurring.amountHistory.push({
            date: new Date(),
            previousAmount: recurring.monthlyAmount,
            newAmount: req.body.newAmount,
            reason: req.body.reason || 'Donor requested change'
        });
        
        recurring.monthlyAmount = req.body.newAmount;
        recurring.calculateRecognitionLevel();
        await recurring.save();
        
        res.json({ success: true, message: 'Amount updated', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update frequency
router.put('/recurring-donations/:id/frequency', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        recurring.frequencyHistory.push({
            date: new Date(),
            previousFrequency: recurring.frequency,
            newFrequency: req.body.newFrequency,
            reason: req.body.reason || 'Donor requested change'
        });
        
        recurring.frequency = req.body.newFrequency;
        await recurring.save();
        
        res.json({ success: true, message: 'Frequency updated', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Record payment
router.post('/recurring-donations/:id/record-payment', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        await recurring.recordPayment(req.body.amount, req.body.status, req.body.transactionId);
        res.json({ success: true, message: 'Payment recorded', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Cancel recurring donation
router.post('/recurring-donations/:id/cancel', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        recurring.status = 'cancelled';
        recurring.cancellationDate = new Date();
        recurring.cancellationReason = req.body.reason || 'No reason provided';
        await recurring.save();
        
        res.json({ success: true, message: 'Recurring donation cancelled', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Pause recurring donation
router.post('/recurring-donations/:id/pause', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        recurring.status = 'paused';
        recurring.pausedDate = new Date();
        await recurring.save();
        
        res.json({ success: true, message: 'Recurring donation paused', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Resume recurring donation
router.post('/recurring-donations/:id/resume', async (req, res) => {
    try {
        const recurring = await RecurringDonation.findOne({ recurringId: req.params.id });
        if (!recurring) return res.status(404).json({ success: false, error: 'Recurring donation not found' });
        
        recurring.status = 'active';
        recurring.pausedDate = null;
        await recurring.save();
        
        res.json({ success: true, message: 'Recurring donation resumed', data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// ========== ANALYTICS/REPORTS ENDPOINTS ==========

// Get donation summary
router.get('/reports/donation-summary', async (req, res) => {
    try {
        const totalDonations = await Donation.countDocuments();
        const totalAmount = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const avgGift = totalAmount.length > 0 ? (totalAmount[0].total / totalDonations).toFixed(2) : 0;
        
        res.json({
            success: true,
            data: {
                totalDonations,
                totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
                averageGift: avgGift
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get donor statistics
router.get('/reports/donor-stats', async (req, res) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const activeDonors = await Donor.countDocuments({ status: 'active' });
        const recurringDonors = await Donor.countDocuments({ hasRecurringDonation: true });
        
        const segmentBreakdown = await Donor.aggregate([
            { $group: { _id: '$segment', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            data: {
                totalDonors,
                activeDonors,
                recurringDonors,
                segmentBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get campaign performance
router.get('/reports/campaign-performance', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ status: 'active' });
        
        const performance = campaigns.map(camp => ({
            campaignId: camp.campaignId,
            name: camp.name,
            goalAmount: camp.goalAmount,
            currentAmount: camp.currentAmount,
            progressPercentage: camp.getProgressPercentage(),
            donationCount: camp.donationCount,
            daysRemaining: camp.getDaysRemaining()
        }));
        
        res.json({ success: true, count: performance.length, data: performance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export donations as CSV
router.get('/reports/export-donations-csv', async (req, res) => {
    try {
        const donations = await Donation.find();
        
        let csv = 'Donation ID,Donor Name,Amount,Date,Status,Payment Method,Campaign\n';
        donations.forEach(d => {
            csv += `"${d.donationId}","${d.donorName}","${d.amount}","${d.donationDate}","${d.status}","${d.paymentMethod}","${d.campaignName || 'N/A'}"\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
