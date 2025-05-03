import { ApprovalRequest } from '../models/ApprovalRequest.js';
import { User } from '../models/User.js';

// Create approval request when agent registers
export const createApprovalRequest = async (agentId) => {
  try {
    const approvalRequest = await ApprovalRequest.create({
      agent: agentId,
      status: 'pending'
    });
    
    return {
      success: true,
      data: approvalRequest
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create approval request',
      error: error.message
    };
  }
};

// Get all pending approval requests (for admin)
export const getPendingApprovals = async () => {
  try {
    const requests = await ApprovalRequest.find({ status: 'pending' })
      .populate('agent', 'name mobileNumber email nid createdAt');
    
    return {
      success: true,
      data: requests
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch approval requests',
      error: error.message
    };
  }
};

// Approve/Reject agent (admin action)
export const processApproval = async (requestId, adminId, action) => {
  try {
    const request = await ApprovalRequest.findById(requestId);
    if (!request) {
      return {
        success: false,
        message: 'Approval request not found'
      };
    }

    if (request.status !== 'pending') {
      return {
        success: false,
        message: 'Request already processed'
      };
    }

    // Update approval request
    request.status = action;
    request.approvedBy = adminId;
    await request.save();

    // If approved, update agent status and balance
    if (action === 'approved') {
      await User.findByIdAndUpdate(request.agent, {
        isApproved: true,
        balance: 100000 // 100,000 Taka for approved agents
      });
    }

    return {
      success: true,
      data: request
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process approval',
      error: error.message
    };
  }
};

// Get approval status (for agent)
export const getApprovalStatus = async (agentId) => {
  try {
    const request = await ApprovalRequest.findOne({ agent: agentId })
      .populate('approvedBy', 'name');
    
    if (!request) {
      return {
        success: false,
        message: 'No approval request found'
      };
    }

    return {
      success: true,
      data: request
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to get approval status',
      error: error.message
    };
  }
};