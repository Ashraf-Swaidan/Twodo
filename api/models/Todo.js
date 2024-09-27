import mongoose from 'mongoose';

const SubTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  subTasks: [SubTaskSchema],
  tags: [{ type: String }],
});

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;
