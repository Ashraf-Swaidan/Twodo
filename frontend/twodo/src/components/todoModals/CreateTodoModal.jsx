import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { DatePicker } from "@nextui-org/react";
import { useProjectsContext } from "../../hooks/useProjects"; // Import the useProjects hook
import CreateProjectModal from "./CreateProjectModal"; // Import the new project modal
import "./CreateTodoModal.css"; // Import your CSS file

const CreateTodoModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // State for Project Modal

  const { projects } = useProjectsContext();

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    const newTags =
      value.match(/@(\w+)/g)?.map((tag) => tag.substring(1)) || [];
    setTags(newTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Title is required.");
      return;
    }

    setLoading(true);

    const formattedDueDate = dueDate
      ? new Date(dueDate.year, dueDate.month - 1, dueDate.day).toISOString()
      : null;

    const cleanedTitle = title.replace(/@(\w+)/g, "").trim();

    const todoData = {
      title: cleanedTitle,
      description,
      dueDate: formattedDueDate,
      tags,
      project: selectedProject || null,
    };

    try {
      await onCreate(todoData);
      resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTags([]);
    setSelectedProject("");
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
      fullScreen={isFullScreen}
    >
      <DialogContent sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Title; type @tag to tag your todo."
            value={title}
            onChange={handleTitleChange}
            variant="filled"
            fullWidth
            required
            sx={{
              marginBottom: 0,
              "& .MuiFilledInput-root": {
                backgroundColor: "transparent",
                border: "none",
                "&:hover": { backgroundColor: "transparent" },
                "&.Mui-focused": { backgroundColor: "transparent" },
                "&:before, &:after": { display: "none" },
              },
            }}
          />
          <TextField
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="filled"
            fullWidth
            multiline
            rows={1}
            sx={{
              marginBottom: 2,
              "& .MuiFilledInput-root": {
                backgroundColor: "transparent",
                border: "none",
                "&:hover": { backgroundColor: "transparent" },
                "&.Mui-focused": { backgroundColor: "transparent" },
                "&:before, &:after": { display: "none" },
              },
            }}
          />

          <div className="flex items-center ">
            <DatePicker
              className="max-w-[204px] mr-2"
              onChange={setDueDate}
              value={dueDate}
            />

            <select
              id="project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-2 py-1 mr-2 bg-gray-100 rounded "
            >
              <option value="">No Project</option>
              {projects &&
                projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
            </select>

            <button
              type="button" // Ensure this is a button, not a submit
              className="px-2 py-1 rounded bg-secondary text-accent"
              onClick={() => setIsProjectModalOpen(true)} // Only opens the project modal
            >
              + Create new project
            </button>
          </div>

          <div className="flex items-center my-4 ml-1">
            <span className="mr-2 text-md">Tags:</span>
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 mr-2 text-white bg-gray-600 rounded opacity-40"
              >
                {tag}
              </span>
            ))}
          </div>

          <DialogActions>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1 text-gray-800 bg-gray-300 rounded hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Todo"}
            </button>
          </DialogActions>
        </form>
      </DialogContent>

      {/* New Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </Dialog>
  );
};

export default CreateTodoModal;
