// src/models/ChatMessage.js
import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model('ChatMessage', ChatMessageSchema);
