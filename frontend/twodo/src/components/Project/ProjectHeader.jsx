import React, { useState } from "react";
import { Checkbox, DatePicker } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import {Avatar, AvatarGroup} from "@nextui-org/react";
const ProjectHeader = ({
  users,
  userRole,
  project,
  handleStartProject,
  handleCheckboxChange,
  handleTitleSave,
  handleTitleEdit,
  handleDescriptionEdit,
  handleDescriptionSave,
  isEditingTitle,
  isEditingDescription,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  isRescheduling,
  setIsRescheduling,
  dueDate,
  handleDueDateChange,
  onSaveDueDate,
  progress,
  isOpen,
  onOpenChange,
  handleDeleteProject,
}) => {

  return (
    <div className="">
      <div className="flex items-baseline">
        {project?.status !== "pending" && (
          <Checkbox
            radius="full"
            isSelected={project ? project.status === "completed" : ""}
            onChange={handleCheckboxChange}
            color="danger"
            size="lg"
            isDisabled={userRole !== "Owner"}
          />
        )}
        <div>
          {userRole === "Owner" && isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleSave}
              className="text-3xl font-bold border-none outline-none"
            />
          ) : (
            <div className="flex space-y-4 flex-wrap sm:space-y-0 space-x-0 sm:space-x-3">
            <h1
              onClick={userRole === "Owner" ? handleTitleEdit : undefined}
              className="text-3xl font-bold cursor-pointer"
            >
              {project && project.name}
            </h1>

            <AvatarGroup
             isBordered
             max={5}
             >
                {users.map((user) => (
                  <Avatar src={user.avatar}
                  alt={user.username} />
                ))}
            </AvatarGroup>
              </div>

          )}

          <p className="mb-4 text-lg">
            {userRole === "Owner" && isEditingDescription ? (
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                className="border-none outline-none"
              />
            ) : (
              <span onClick={userRole === "Owner" ? handleDescriptionEdit : undefined} className="cursor-pointer">
                {project?.description}
              </span>
            )}
          </p>
        </div>
      </div>

      {project?.status === "pending" && userRole === "Owner" && (
        <button
          onClick={handleStartProject}
          className="px-5 py-1 mb-4 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Start Project
        </button>
      )}

      {project && (
        <div className="flex flex-wrap items-center space-x-2 mb-2">
          <p className="text-sm text-gray-600">
            {project?.dueDate ? (
              <>Due Date: {new Date(project.dueDate).toLocaleDateString()}</>
            ) : (
              "No Due Date Set Yet"
            )}
          </p>

          {!isRescheduling ? (
            // Render Reschedule button when not in rescheduling mode
            userRole === "Owner" && (
              <button
                onClick={() => setIsRescheduling(true)} // Toggle rescheduling mode
                className="rounded px-3 py-1 border-1 text-accent hover:bg-secondary"
              >
                Reschedule
              </button>
            )
          ) : (
            // Render DatePicker and action buttons when in rescheduling mode
            <div className="flex space-x-2 space-y-2 sm:space-y-0 flex-col sm:flex-row">
              {userRole === "Owner" ? (
                <>
                  <DatePicker
                    value={dueDate}
                    onChange={handleDueDateChange}
                    variant="bordered" // Handle date change
                  />
                  <button
                    className="rounded px-3 py-1 border-1 hover:bg-secondary text-accent"
                    onClick={onSaveDueDate} // Save the new date
                  >
                    Save
                  </button>
                </>
              ) : (
                <span className="text-gray-500">You cannot reschedule this project.</span>
              )}
              <button
                className="rounded px-3 py-1 bg-gray-400 text-white"
                onClick={() => setIsRescheduling(false)} // Cancel rescheduling
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mb-3 w-1/2">
        <span className="text-sm">{`Progress: ${Math.round(progress)}%`}</span>
        <div className="relative bg-gray-200 rounded h-2">
          <div
            className="absolute top-0 left-0 h-2 bg-red-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Project Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this project? This action cannot be undone, and all todos associated with this project will be deleted.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteProject(); // Call the delete project function
                    onClose(); // Close the modal
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProjectHeader;
