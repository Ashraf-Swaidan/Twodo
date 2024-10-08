import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  attachments: [{ fileUrl: String, fileName: String, mimetype: String, }] // File attachment info
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  subTasks: [{ title: String, completed: Boolean }],
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null }, // Reference to the Project
  comments: [CommentSchema],
});

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;
