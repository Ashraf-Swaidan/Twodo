import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Checkbox } from "@nextui-org/react";
import { FaPen, FaTimes } from 'react-icons/fa';
import { DatePicker } from "@nextui-org/react"; // Import NextUI's DatePicker
import { useTodos } from '../../hooks/useTodos'; // Adjust the import path if needed

const TodoDetailsModal = ({ isOpen, onClose, todo, onUpdate }) => {
    const { updateTodo } = useTodos(); // Use the updateTodo function from the hook
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingSubtask, setIsEditingSubtask] = useState({});
    const [dueDate, setDueDate] = useState(new Date());
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState('');

    useEffect(() => {
        if (isOpen && todo) {
            setDueDate(new Date(todo.dueDate));
            setSubtasks(todo.subtasks || []);
        }
    }, [isOpen, todo]);

    const handleToggleEditTitle = () => setIsEditingTitle(!isEditingTitle);
    const handleToggleEditDescription = () => setIsEditingDescription(!isEditingDescription);

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setSubtasks([...subtasks, { id: Date.now(), text: newSubtask }]);
            setNewSubtask('');
        }
    };

    const handleEditSubtask = (id) => {
        setIsEditingSubtask((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteSubtask = (id) => {
        setSubtasks(subtasks.filter(subtask => subtask.id !== id));
    };

    const handleUpdateTodo = async () => {
        if (todo) {
            await updateTodo(todo.id, { ...todo, dueDate, subtasks }); // Update todo using the hook
            onUpdate({ ...todo, dueDate, subtasks }); // Update the state in the parent component
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg"> {/* Larger modal size */}
            <DialogTitle>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Todo Details</span>
                    <Button onClick={onClose} color="inherit">X</Button>
                </div>
            </DialogTitle>
            <DialogContent className="flex p-6"> {/* Increased padding */}
                {/* Content Section */}
                <div className="flex flex-col space-y-4 w-2/3"> {/* Stack content vertically with space */}
                    <div className="flex items-center">
                        <Checkbox
                            isSelected={todo?.completed || false}
                            onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
                        />
                        {isEditingTitle ? (
                            <TextField
                                defaultValue={todo?.title || ""}
                                onBlur={handleToggleEditTitle}
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <span className="font-bold cursor-pointer text-lg" onClick={handleToggleEditTitle}>
                                {todo?.title || "No Title"}
                                <FaPen className="ml-2" />
                            </span>
                        )}
                    </div>
                    {isEditingDescription ? (
                        <TextField
                            defaultValue={todo?.description || ""}
                            onBlur={handleToggleEditDescription}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    ) : (
                        <div>
                            <p className="text-gray-700">{todo?.description || "No Description"}</p>
                            <FaPen className="cursor-pointer" onClick={handleToggleEditDescription} />
                        </div>
                    )}

                    {/* Subtasks */}
                    <div className="mt-4">
                        <h4 className="font-semibold text-lg">Subtasks:</h4>
                        {subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center">
                                {isEditingSubtask[subtask.id] ? (
                                    <TextField
                                        defaultValue={subtask.text}
                                        onBlur={() => handleEditSubtask(subtask.id)}
                                        variant="outlined"
                                        size="small"
                                    />
                                ) : (
                                    <span className="mr-2">{subtask.text}</span>
                                )}
                                <FaPen className="cursor-pointer" onClick={() => handleEditSubtask(subtask.id)} />
                                <FaTimes className="cursor-pointer text-red-500 ml-2" onClick={() => handleDeleteSubtask(subtask.id)} />
                            </div>
                        ))}
                        <div className="mt-2 flex items-center">
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Add new subtask..."
                                className="border rounded p-1 mr-2"
                            />
                            <button onClick={handleAddSubtask} className="bg-blue-500 text-white px-2 rounded">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col w-1/3 pl-6"> {/* Give space to the right */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-lg">Due Date:</h4>
                        <DatePicker
                            selected={dueDate}
                            onChange={(date) => setDueDate(date)}
                            className="border rounded p-1 w-full"
                        />
                    </div>
                    <div className="border-t border-gray-300 my-4" />
                    <div>
                        <h4 className="font-semibold text-lg">Tags:</h4>
                        <div className="flex flex-wrap">
                            {todo?.tags?.map((tag) => (
                                <span key={tag} className="bg-gray-200 rounded px-2 py-1 mr-2 mb-2 flex items-center">
                                    {tag}
                                    <FaTimes className="cursor-pointer ml-1 text-red-500" onClick={() => {}} /> {/* Add delete functionality */}
                                </span>
                            )) || <span>No Tags</span>}
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdateTodo} color="primary" className="bg-blue-500 text-white">Save</Button>
                <Button onClick={onClose} color="secondary" className="text-gray-700">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TodoDetailsModal;
