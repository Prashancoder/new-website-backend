import express from 'express';
import {
    sendLeadOTP,
    verifyLeadOTP,
    createLead,
    getAllLeads,
    deleteLead,
    updateLead
} from '../controllers/leadController.js';

const router = express.Router();

// Send OTP for lead verification
router.post('/send-otp', sendLeadOTP);

// Verify OTP
router.post('/verify-otp', verifyLeadOTP);

// Create lead after OTP verification
router.post('/create', createLead);

// Get all leads (admin only - you can add auth middleware if needed)
router.get('/all', getAllLeads);

// Delete lead
router.delete('/:id', deleteLead);

// Update lead
router.put('/:id', updateLead);

export default router;
