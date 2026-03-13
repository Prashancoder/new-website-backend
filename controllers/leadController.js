import Lead from '../models/leadModel.js';
import sendMail from '../configs/Mail.js';

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
export const sendLeadOTP = async (req, res) => {
    try {
        const { email, firstName, lastName, phone, service, message } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate OTP and set expiry (5 minutes)
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Check if lead with this email already exists and is not verified
        let lead = await Lead.findOne({ email, verified: false });
        
        if (lead) {
            // Update existing unverified lead
            lead.firstName = firstName;
            lead.lastName = lastName;
            lead.phone = phone;
            lead.service = service;
            lead.message = message;
            lead.otp = otp;
            lead.otpExpiry = otpExpiry;
        } else {
            // Create new lead with OTP
            lead = new Lead({
                firstName,
                lastName,
                email,
                phone,
                service,
                message,
                otp,
                otpExpiry
            });
        }

        await lead.save();

        // Send OTP email
        await sendMail(email, otp, "Verify Your Contact Form Submission");

        res.status(200).json({ 
            success: true, 
            message: 'OTP sent to your email. Please verify to submit the form.' 
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP. Please try again.' 
        });
    }
};

// Verify OTP
export const verifyLeadOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }

        // Find lead with matching email and OTP
        const lead = await Lead.findOne({ 
            email, 
            otp,
            otpExpiry: { $gt: new Date() } // OTP should not be expired
        });

        if (!lead) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP' 
            });
        }

        // Mark as verified
        lead.verified = true;
        lead.otp = undefined; // Clear OTP
        lead.otpExpiry = undefined; // Clear expiry
        await lead.save();

        res.status(200).json({ 
            success: true, 
            message: 'OTP verified successfully. You can now submit the form.' 
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify OTP. Please try again.' 
        });
    }
};

// Create lead after OTP verification
export const createLead = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }

        // Find verified lead
        const lead = await Lead.findOne({ email, verified: true });

        if (!lead) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please verify your OTP first' 
            });
        }

        // Lead is already created and verified
        res.status(200).json({ 
            success: true, 
            message: 'Lead submitted successfully!', 
            lead: {
                id: lead._id,
                firstName: lead.firstName,
                lastName: lead.lastName,
                email: lead.email,
                phone: lead.phone,
                service: lead.service,
                message: lead.message,
                status: lead.status,
                createdAt: lead.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit lead. Please try again.' 
        });
    }
};

// Get all leads for admin
export const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            leads 
        });

    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch leads' 
        });
    }
};

// Delete lead
export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Lead ID is required' 
            });
        }

        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lead not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Lead deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete lead' 
        });
    }
};

// Update lead (status or notes)
export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Lead ID is required' 
            });
        }

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const lead = await Lead.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!lead) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lead not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Lead updated successfully',
            lead 
        });

    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update lead' 
        });
    }
};
