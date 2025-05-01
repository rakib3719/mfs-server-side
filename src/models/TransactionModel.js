import mongoose  from "mongoose";


const transactionSchema = new mongoose.Schema({
 
  sender: {
    type: String,
    ref: 'User',
    required: true
  },
  recipient: {
    type: String,
    ref: 'User'
  },
  agent: {
    type: String,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true,
    min: [50, 'Minimum amount is 50 Taka']
  },
  fee: {
    type: Number,
    default: 0
  },
  adminFee: {
    type: Number,
 
  },
  type: {
    type: String,
    enum: ['send-money', 'cash-out', 'cash-in'],
    required: true
  },
  // status: {
  //   type: String,
  //   enum: ['pending', 'completed', 'failed'],
  //   default: 'pending'
  // },
  // details: String
}, { timestamps: true });



 export const Transaction =  mongoose.model('Transaction', transactionSchema);