import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  pin: {
    type: String,
    required: [true, 'PIN is required'],

    select: false
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
  
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
   
  },
  nid: {
    type: String,
    required: [true, 'NID is required'],
    unique: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  balance: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.accountType === 'user'; 
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
 
}, { timestamps: true });





export const User = mongoose.model('User', userSchema);

