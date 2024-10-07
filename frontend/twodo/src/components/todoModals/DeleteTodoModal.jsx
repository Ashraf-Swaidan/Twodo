import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

function DeleteTodoModal({ isOpen, onOpenChange, onDelete }) {
  return (
    <Modal placement="auto" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Todo</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this todo?</p>
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={onDelete}>
                Delete
              </Button>
              
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteTodoModal;
