import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DatePicker } from "@nextui-org/react"; // Import NextUI modal components
import { useProjectsContext } from "../../hooks/useProjects"; 
import CreateProjectModal from "./CreateProjectModal"; 
import { useAuth } from "../../context/AuthContext";

const CreateTodoModal = ({ isOpen, onClose, onCreate }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const { projects } = useProjectsContext();

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    const newTags = value.match(/@(\w+)/g)?.map((tag) => tag.substring(1)) || [];
    setTags(newTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Title is required.");
      return;
    }

    setLoading(true);

    const formattedDueDate = dueDate ? new Date(dueDate.year, dueDate.month - 1, dueDate.day).toISOString() : null;
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
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        placement="auto"
        fullWidth
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-semibold">Create Todo</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Title; type @tag to tag your todo."
                    value={title}
                    onChange={handleTitleChange}
                    className="border-none outline-none p-2 w-full mb-2"
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-none outline-none p-2 w-full mb-2"
                    rows={1}
                  ></textarea>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                    <DatePicker
                      variant="bordered"
                      className="max-w-[204px] mr-2"
                      onChange={setDueDate}
                      value={dueDate}
                    />

                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="border rounded p-1 mr-2 w-40"
                    >
                      <option value="" disabled={!selectedProject}>
                        {selectedProject ? "Change project" : "Select a project"}
                      </option>
                      <option value="">No Project</option>
                      {projects.map((proj) => {
                        const collaborator = proj.collaborators.find((collab) => collab.user === user.id);
                        const isViewer = collaborator && collaborator.role === "viewer";
                        return (
                          <option key={proj._id} value={proj._id} disabled={isViewer}>
                            {proj.name}
                          </option>
                        );
                      })}
                    </select>

                    <Button
                      variant="flat"
                      onClick={() => setIsProjectModalOpen(true)}
                    >
                      + Create new project
                    </Button>
                  </div>

                  <div className="flex items-center my-4">
                    <span className="mr-2">Tags:</span>
                    {tags.map((tag, index) => (
                      <span key={index} className="bg-gray-600 text-white px-2 py-1 rounded mr-2">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ModalFooter>
                    <Button color="danger" variant="flat" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button color="default" type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Todo"}
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* New Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
};

export default CreateTodoModal;
