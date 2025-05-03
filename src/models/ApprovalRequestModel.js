import mongoose  from "mongoose";

const approvalRequestSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}, { timestamps: true });

export const ApprovalRequest =  mongoose.model('ApprovalRequest', approvalRequestSchema);