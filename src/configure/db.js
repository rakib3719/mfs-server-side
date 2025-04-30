
import dotenv from 'dotenv'

import mongoose from "mongoose"
dotenv.config();

const connectDB = async()=>{


try {
   const connect =await mongoose.connect(process.env.MONGO_URI )
   console.log(`moongdo db connected `);
    
} catch (error) {
    console.log(error.message, "error");
}
}

export default connectDB;