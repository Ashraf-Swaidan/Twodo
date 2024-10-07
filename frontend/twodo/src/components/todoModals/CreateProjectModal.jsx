import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@nextui-org/react';
import { useProjectsContext } from '../../hooks/useProjects';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addProject } = useProjectsContext();

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      await addProject({ name: projectName, description });
      setProjectName('');
      setDescription('');
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="auto"

    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Project
            </ModalHeader>
            <ModalBody className="space-y-4">

                <Input
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  fullWidth
                />
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter project description"
                  rows={4}
                  fullWidth
                />
              
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="default"
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateProjectModal;
