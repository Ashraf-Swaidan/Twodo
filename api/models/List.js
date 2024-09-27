import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
});

const List = mongoose.model('List', ListSchema);

export default List;
