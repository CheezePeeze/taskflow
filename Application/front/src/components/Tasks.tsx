// 📂 src/components/Tasks.tsx
import React from "react";

// ============================
// Typing for one task
// ============================
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

// ============================
// Typing for component props
// ============================
interface TasksProps {
  tasks: Task[]; // список задач
  onToggle: (id: string, completed: boolean) => void; // переключить статус
  onDelete: (id: string) => void; // delete task
  onEdit: (task: Task) => void; // edit modal
}

// ============================
// Clean UI component of Tasks
// ============================
const Tasks: React.FC<TasksProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet</p>;
  }

  return (
    <ul className="space-y-2 ">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex items-center justify-between border-b pb-2"
        >
          <span
            onClick={() => onToggle(task._id, task.completed)}
            className={`cursor-pointer mr-3 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Tasks;
