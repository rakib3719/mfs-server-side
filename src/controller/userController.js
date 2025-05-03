import { Transaction } from "../models/TransactionModel.js";
import { User } from "../models/userModel.js";



export const updateUserActiveStatus = async (req, res) => {
    
    
    try {
       
        const { isActive, userId } = req.body;

        // Validate input
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isActive value (must be boolean)'
            });
        }

     
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true, runValidators: true }
        ).select('-pin -password -__v');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedUser
        });

    } catch (error) {
        console.error('Update user active status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};


export const updateAgentApprovalStatus = async (req, res) => {
    try {
        const { isApproved, userId } = req.body;

        // Validate input
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isApproved value (must be boolean)'
            });
        }

        // Find the user first to check account type
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is an agent
        if (user.accountType !== 'agent') {
            return res.status(400).json({
                success: false,
                message: 'Approval status can only be updated for agents'
            });
        }

        // Prepare update data
        const updateData = { isApproved };
        
        // Add balance if being approved and wasn't approved before
        if (isApproved && !user.isApproved) {
            updateData.$inc = { balance: 100000 };
        }

        // Update agent
        const updatedAgent = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-pin -password -__v');

        // Create transaction record if approved
        if (isApproved && !user.isApproved) {
            const transaction = new Transaction({
                   amount: 100000,
                                agent: user.mobileNumber,
                                sender:'Admin',
                                type:"agent-bonus"
                
            });
            await transaction.save();
        }

        res.status(200).json({
            success: true,
            message: `Agent ${isApproved ? 'approved' : 'disapproved'} successfully`,
            data: updatedAgent,
            balanceAdded: isApproved && !user.isApproved ? 100000 : 0
        });

    } catch (error) {
        console.error('Update agent approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update agent approval status',
            error: error.message
        });
    }
};