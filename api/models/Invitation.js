import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Invitation = mongoose.model('Invitation', InvitationSchema);

export default Invitation;
