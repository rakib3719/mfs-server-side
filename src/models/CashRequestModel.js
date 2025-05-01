import mongoose from "mongoose";

const cashRequestSchema = new mongoose.Schema({
  agent: {
    type: String,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['recharge', 'withdraw'],
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
  }
}, { timestamps: true });

export const CashRequest =  mongoose.model('CashRequest', cashRequestSchema);