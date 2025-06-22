import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  exchangeId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  attachments: [{ type: String }],
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema); 