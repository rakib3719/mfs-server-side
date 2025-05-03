import { User } from "../models/userModel.js";
import WithdrawalRequest from "../models/WithdrawalRequestModel.js";
import bcrypt from 'bcrypt';



export const createWithdraw = async (req, res) => {
    const { agentNumber, amount, pin } = req.body;





    
    try {
 
        const agent = await User.findOne({ mobileNumber: agentNumber }).select('+pin');



        
        if (!agent) {
            return res.status(404).json({
                message: "Agent not found"
            });
        }
        
   
        const isPinValid = await bcrypt.compare(pin, agent.pin);
        
        if (!isPinValid) {
            return res.status(401).json({
                message: "Invalid PIN"
            });
        }
        
  
        const newRequest = new WithdrawalRequest({
            agentNumber,
            amount,
            status: "pending", 
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: "Withdrawal request created successfully",
            data: savedRequest,
            success:true
        });
    } catch (error) {
        res.status(400).json({
            message: error?.message || "Failed to create withdrawal request",
            error
        });
    }
};

export const getAllWithdrawRequests = async (req, res) => {
    try {
        const requests = await WithdrawalRequest.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "All withdrawal requests fetched successfully",
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            message: error?.message || "Failed to fetch withdrawal requests",
            error
        });
    }
};

export const updateWithdrawRequest = async (req, res) => {
    const { _id, status, agentNumber, amount } = req.body;
    console.log(_id, 'id to aslo');

    try {
  
        const updatedRequest = await WithdrawalRequest.findByIdAndUpdate(
            _id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Withdrawal request not found" });
        }

   
        if (status === "approved") {
            const agent = await User.findOne({ mobileNumber: agentNumber });
            const admin = await User.findOne({ accountType: "admin" });

            if (!agent || !admin) {
                return res.status(404).json({ message: "Agent or Admin not found" });
            }

          
           

            // Update balances
            agent.balance -= amount;
            admin.balance += amount;

            await agent.save();
            await admin.save();
        }

        res.status(200).json({
            message: `Withdrawal request ${status} successfully`,
            data: updatedRequest,
            success:true
        });

    } catch (error) {
        res.status(500).json({
            message: error?.message || "Failed to update withdrawal request",
            error
        });
    }
};