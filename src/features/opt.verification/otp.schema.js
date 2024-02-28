import mongoose from 'mongoose';

export const optSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otp: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    otpExpiration: {
        type: Date, 
        required: true,
    },
});
