import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import SystemMetrics from '../models/SystemMetrics.js';

export const generateTransactionId = () => {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TXN${timestamp.slice(-5)}${randomSuffix}`;
};

export const calculateFees = (amount, type) => {
  const feeRules = {
    'send-money': amount > 100 ? 5 : 0,
    'cash-out': amount * 0.015,
    'cash-in': 0,
    default: 0
  };
  
  return feeRules[type] || feeRules.default;
};

export const updateSystemMetrics = async () => {
  try {
    const [totalUsers, totalAgents, totalTransactions] = await Promise.all([
      User.countDocuments({ accountType: 'user' }),
      User.countDocuments({ accountType: 'agent', isApproved: true }),
      Transaction.countDocuments()
    ]);

    await SystemMetrics.findOneAndUpdate(
      {},
      {
        $set: {
          totalUsers,
          totalAgents,
          totalTransactions,
          lastUpdated: new Date()
        }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Failed to update system metrics:', error);
    throw new Error('System metrics update failed');
  }
};


export default {
  generateTransactionId,
  calculateFees,
  updateSystemMetrics
};