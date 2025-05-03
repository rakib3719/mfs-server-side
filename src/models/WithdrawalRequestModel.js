import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema({
  agentNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,

  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

export default WithdrawalRequest;