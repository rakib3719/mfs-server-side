import { User } from "../models/userModel.js";


export const getBalanceSummary = async (req, res) => {
    try {
  
        const users = await User.find({});
   
        const summary = users.reduce((acc, user) => {
            if (user.accountType === 'admin') {
                acc.adminAllBalance += user.balance || 0;
                acc.adminCount++;
            } else if (user.accountType === 'agent') {
                acc.agentAllBalance += user.balance || 0;
                acc.agentCount++;
            } else if (user.accountType === 'user') {
                acc.userAllBalance += user.balance || 0;
                acc.userCount++;
            }
            return acc;
        }, {
            adminAllBalance: 0,
            agentAllBalance: 0,
            userAllBalance: 0,
            allMoney: 0,
            adminCount: 0,
            agentCount: 0,
            userCount: 0
        });

       
        summary.allMoney = summary.adminAllBalance + summary.agentAllBalance + summary.userAllBalance;

        res.status(200).json({
            message: "Balance summary retrieved successfully",
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message || "Failed to get balance summary",
            error
        });
    }
};