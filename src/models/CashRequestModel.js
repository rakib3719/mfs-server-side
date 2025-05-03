import mongoose from "mongoose";

const cashRequestSchema = new mongoose.Schema({
  agentMobile: {
    type: String,
    required: true
  },
  agentDetails: {
    email: String,
    
    name: String,
    nid: String,
    accountType: String
  },
  type: {
    type: String,
    enum: ['recharge', 'cashRequest'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

}, { timestamps: true });

export const CashRequest = mongoose.model('CashRequest', cashRequestSchema);