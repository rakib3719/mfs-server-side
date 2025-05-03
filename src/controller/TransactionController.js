import { Transaction } from '../models/TransactionModel.js';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel.js';
export const createTransaction = async (req, res) => {
    try {
      const { type, recipientMobile, senderMobile, amount, pin } = req.body;
  
      // Input validation
      if (amount < 50) return res.status(400).json({ error: 'Minimum amount is 50 Taka' });
  
      const sender = await User.findOne({ mobileNumber: senderMobile }).select('+pin');
      if (!sender) return res.status(404).json({ error: 'Sender account not found' });
  
      const isPinValid = await bcrypt.compare(pin, sender.pin);
      if (!isPinValid) return res.status(401).json({ error: 'Invalid PIN' });
  
      let transaction;
      let recipient;
  
      switch (type) {
        case 'send-money':
          recipient = await User.findOne({ mobileNumber: recipientMobile });
          if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
  
          const sendFee = amount > 100 ? 5 : 0;
          const totalSendAmount = amount + sendFee;
  
          if (sender.balance < totalSendAmount) {
            return res.status(400).json({ error: 'Insufficient balance' });
          }
  
          // Update balances
          await User.updateOne(
            { mobileNumber: senderMobile },
            { $inc: { balance: -totalSendAmount } }
          );
          await User.updateOne(
            { mobileNumber: recipientMobile },
            { $inc: { balance: amount } }
          );
          await User.updateOne(
            { accountType: 'admin' },
            { $inc: { balance: sendFee } }
          );
  
          transaction = await Transaction.create({
            sender: senderMobile,
            recipient: recipientMobile,
            amount,
            fee: sendFee,
            adminFee: sendFee,
            type
          });
          break;
  
        case 'cash-out':
          const agent = await User.findOne({ 
            mobileNumber: recipientMobile,
            accountType: 'agent',
            isApproved: true
          });
          if (!agent) return res.status(404).json({ error: 'Approved agent not found' });
  
          const cashOutFee = amount * 0.015;
          const agentFee = amount * 0.01;
          const adminFee = amount * 0.005;
          const totalCashOutAmount = amount + cashOutFee;
  
          if (sender.balance < totalCashOutAmount) {
            return res.status(400).json({ error: 'Insufficient balance' });
          }
  
          // Update balances
          await User.updateOne(
            { mobileNumber: senderMobile },
            { $inc: { balance: -totalCashOutAmount } }
          );
          await User.updateOne(
            { mobileNumber: recipientMobile },
            { $inc: { balance: agentFee + amount } }
          );
          await User.updateOne(
            { accountType: 'admin' },
            { $inc: { balance: adminFee } }
          );
  
          transaction = await Transaction.create({
            sender: senderMobile,
            agent: recipientMobile,
            amount,
            fee: cashOutFee,
            adminFee,
            type
          });
          break;
  
        case 'cash-in':
          const user = await User.findOne({ mobileNumber: recipientMobile });
          if (!user) return res.status(404).json({ error: 'User account not found' });
  
          if (sender.accountType !== 'agent' || !sender.isApproved) {
            return res.status(403).json({ error: 'Only approved agents can cash-in' });
          }
  
          if (sender.balance < amount) {
            return res.status(400).json({ error: 'Agent has insufficient balance' });
          }
  
          // Update balances
          await User.updateOne(
            { mobileNumber: senderMobile },
            { $inc: { balance: -amount } }
          );
          await User.updateOne(
            { mobileNumber: recipientMobile },
            { $inc: { balance: amount } }
          );
  
          transaction = await Transaction.create({

            sender: senderMobile,
            recipient: recipientMobile,
            amount,
            fee: 0,
            adminFee: 0,
            type
          });
          break;
  
        default:
          return res.status(400).json({ error: 'Invalid transaction type' });
      }
  
      // Ensure transaction was created
      if (!transaction) {
        throw new Error('Transaction creation failed');
      }
  
      res.status(201).json({
        success: true,
        message: `${type} successful`,
        transaction: {
            id: transaction?._id || '0',
          reference: `TXN-${senderMobile.slice(-4)}-${Date.now().toString().slice(-4)}`,
          from: senderMobile,
          to: type === 'cash-out' ? `Agent: ${recipientMobile}` : recipientMobile,
          amount,
          fee: transaction.fee,
          ...(type === 'cash-out' && {
            agentFee: amount * 0.01,
            adminFee: amount * 0.005
          }),
          timestamp: transaction.createdAt
        }
      });
  
    } catch (error) {
      console.error('Transaction error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Transaction processing failed'
      });
    }
  };



  export const getAllTransaction = async(req, res)=>{
    try {
      const data = await Transaction.find();
      res.json({
        success:true,
        data:data
      })
      
    } catch (error) {
      res.status(400).json({
        message:error?.message,
        error:error
      })
    }
  }