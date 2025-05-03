import { decodedToken } from "../middleware/middleware.js";
import { CashRequest } from "../models/CashRequestModel.js";
import { Transaction } from "../models/TransactionModel.js";
import { User } from "../models/userModel.js";

export const createCashRequest = async (req, res) => {
  const { agentMobile, type } = req.body;
  console.log(agentMobile, 'agent mobile');
  
  try {
    // Find agent details from User model
    const agent = await User.findOne({ mobileNumber: agentMobile });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    // Create cash request with agent details
    const newRequest = await CashRequest.create({
      agentMobile,
      agentDetails: {
        email: agent.email,
        name: agent.name,
        nid: agent.nid,
        accountType: agent.accountType
      },
      type
    });

    res.status(201).json({
      success: true,
      message: "Cash request created successfully",
      data: newRequest
    });

  } catch (error) {
    console.error("Create cash request error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
};

// Get All Cash Requests (for admin)
export const getAllCashRequests = async (req, res) => {
  try {
    const token = req?.cookies?.token;
    const decoded = decodedToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const userId = decoded.userId;
    const user = await User.findOne({_id: userId}).select('-pin -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let requests;
    
    if (user.accountType === 'agent') {
      // For agents, only show their own requests
      requests = await CashRequest.find({ agentMobile: user.mobileNumber })
        .sort({ createdAt: -1 });
    } else if (user.accountType === 'admin') {
      // For admins, show all requests
      requests = await CashRequest.find().sort({ createdAt: -1 });
    } else {
      // For other account types (if any)
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    
    res.status(200).json({
      success: true,
      data: requests
    });
    
  } catch (error) {
    console.error("Get cash requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cash requests",
      error: error.message
    });
  }
};


// export const updateCashRequest = async(req, res)=>{



// }



export const updateCashRequest = async (req, res) => {
  try {
      const { _id, status} = req.body;

      // Find the cash request first
      const cashRequest = await CashRequest.findById(_id);
      if (!cashRequest) {
          return res.status(404).json({
              success: false,
              message: 'Cash request not found'
          });
      }

 
      const agentMobile = cashRequest.agentMobile;


      if (status === 'approved') {
        
          const updatedUser = await User.findOneAndUpdate(
              { mobileNumber: agentMobile },
              { $inc: { balance: 100000 } },
              { new: true }
          );

          if (!updatedUser) {
              return res.status(404).json({
                  success: false,
                  message: 'Agent not found'
              });
          }

      
          const transaction = new Transaction({
              user: updatedUser._id,
              sender:'admin',
              recipient: agentMobile,
              agent:agentMobile,
              amount: 100000,
              type: 'cash-request',
        
             
          });
          await transaction.save();
      }

      // Now update the cash request status
      const updatedRequest = await CashRequest.findByIdAndUpdate(
          _id,
          { status },
          { new: true, runValidators: true }
      );

      res.status(200).json({
          success: true,
          message: 'Cash request status updated successfully',
          data: {
              request: updatedRequest,
              newBalance: status === 'approved' ? (await User.findOne({ mobileNumber: agentMobile })).balance : undefined
          }
      });

  } catch (error) {
      console.error('Update cash request error:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to update cash request',
          error: error.message
      });
  }
};