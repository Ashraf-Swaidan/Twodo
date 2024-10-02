import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // Optional description field
  dueDate: { type: Date }, // Optional due date
  status: { type: String, enum: ['pending', 'completed', 'in-progress'], default: 'pending' }, // Status of the project
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }], // Reference to Todo items
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
