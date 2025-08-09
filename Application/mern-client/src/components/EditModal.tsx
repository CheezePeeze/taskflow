import React from "react";

// Describe types of props for modal
interface EditModalProps {
  isOpen: boolean; //Whether the modal is open or not
  onClose: () => void;
  onSave: () => void; // Saving changes
  editedTitle: string; // Current value
  setEditedTitle: (value: string) => void; // Callback for updating title
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editedTitle,
  setEditedTitle,
}) => {
  //if modal is closed - nothing to render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

        {/* Поле для ввода нового названия */}
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button> 
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
