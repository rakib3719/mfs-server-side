import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { decodedToken } from "../middleware/middleware.js";

export const register = async (req, res) => {
  const userData = req.body;

  try {
    // check mobile
    const existingUserByMobile = await User.findOne({ mobileNumber: userData.mobileNumber });
    if (existingUserByMobile) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          mobileNumber: "Mobile number already registered"
        }
      });
    }

    // email check
    const existingUserByEmail = await User.findOne({ email: userData.email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          email: "Email already registered"
        }
      });
    }

    // NID check
    const existingUserByNid = await User.findOne({ nid: userData.nid });
    if (existingUserByNid) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: {
          nid: "NID already registered"
        }
      });
    }


    // balance & isApproved
    if (userData.accountType === 'user') {
      userData.balance = 40;
    } else if (userData.accountType === 'agent') {
      userData.balance = 0;
      userData.isApproved = false;
    }

    //  hash the pin
    const salt = await bcrypt.genSalt(10);
    userData.pin = await bcrypt.hash(userData.pin, salt);

    // create user
    const newUser = await User.create(userData);

    // don't expose pin
    newUser.pin = undefined;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error
    });
  }
};





export const login = async (req, res) => {
  const { identifier, pin } = req.body;

  // if (!identifier || !pin) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Login failed",
  //     errors: {
  //       identifier: !identifier ? "Identifier is required" : undefined,
  //       pin: !pin ? "PIN is required" : undefined
  //     }
  //   });
  // }

  if(! identifier){
    return res.status(400).json({
      success:false,
      message:'Identifier is required"'
    })
  }

  if( !pin){
    return res.status(400).json({
      success:false,
      message:'Identifier is required"'
    })
  }


  try {
    const isEmail = identifier.includes("@");
    const user = await User.findOne(
      isEmail ? { email: identifier } : { mobileNumber: identifier }
    ).select("+pin");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        errors: {
          identifier: "User not found"
        }
      });
    }

  

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pin",
        errors: {
          pin: "Invalid PIN"
        }
      });
    }

    // JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
     'Uj3f#kLx8@wZ92!gR4cF^eYqT1Nv$BmP7sHq0Ld9Vx*MzKa6',
      { expiresIn: "7d" }
    );

    // Save to cookie
    res.cookie("token", token, {
   
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // or "Strict" for more security
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Hide pin
    user.pin = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message,
      error: error.message
    });
  }
};





export const logout = (req, res) => {
  try {
    // Clear the cookie that holds the JWT token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message
    });
  }
};




export const getAllUsers = async(req, res)=>{

  try {

    const data = await User.find();
    res.status(200).json({
      success: true,
      data: data
    });
    
  } catch (error) {
    res.status(401).json({
message:'Something went wrong!',
error

    })
  }
}





export const getUserController = async (req, res) => {



  try {
    // 1. Get token from cookies
    const token = req?.cookies?.token

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // 2. Verify token
    const decoded = decodedToken(token);
  
  
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // 3. Get user ID from token (assuming your token contains _id)
    const userId = decoded.userId;


    // 4. Fetch user from database (excluding sensitive fields)
    const user = await User.findOne({_id:userId}).select('-pin -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 5. Return user data
    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error in getUserController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};