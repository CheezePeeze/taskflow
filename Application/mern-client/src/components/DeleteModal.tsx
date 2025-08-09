interface DeleteModalProps {
  isOpen: boolean; // Whether the modal is open or not
  onClose: () => void; // Close the modal
  onConfirm: () => void; // Confirm deleting
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Delete Task</h2>
        <p className="mb-4">Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
