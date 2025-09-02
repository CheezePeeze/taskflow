import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTask,
  createTask,
  updateTask,
  deleteTaskService,
} from "../services/taskService";
import { toast } from "react-toastify";
import Tasks from "../components/Tasks";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import FilterButtons, { type FilterType } from "../components/FilterButtons";
import Navbar from "../components/Navbar";

// Type for one task
interface Task {
  _id: string;
  title: string;
  completed: boolean;
}
const Dashboard = () => {
  const navigate = useNavigate();

  // ============================
  //States
  // ============================
  const [tasks, setTasks] = useState<Task[]>([]); //List of all tasks
  const [newTask, setNewTask] = useState(""); // Input field for new task
  const [filter, setFilter] = useState<FilterType>("all"); //Filtration
  const [isModalOpen, setIsModalOpen] = useState(false); // State of modal
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null); //ID tasks for delete

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Editing window
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null); // Current task for editing
  const [editedTitle, setEditedTitle] = useState(""); // New task name
  // ===============================
  //🚪 Logout
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("You have been logged out");
    navigate("/");
  };

  // ===============================
  //📥 Uploading Tasks
  // ===============================
  const fetchTasks = async () => {
    try {
      const data = await getTask();
      setTasks(data);
    } catch {
      toast.error("Error while loading tasks");
    }
  };

  //Uploading tasks while opening the page
  useEffect(() => {
    fetchTasks();
  }, []);

  // ===============================
  // ➕ Creating a Task
  // ===============================
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.warning("Task title cannot be empty");
      return;
    }
    try {
      await createTask(newTask);
      setNewTask("");
      fetchTasks(); //Reloading list of tasks
      toast.success("Task created successfully!");
    } catch {
      toast.error("Error creating task");
    }
  };

  // ===============================
  // ✅ Switching status of a Task
  // ===============================
  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed: !completed });
      fetchTasks();
      toast.info(`Task marked as ${!completed ? "done" : "undone"}`);
    } catch {
      toast.error("Error updating task");
    }
  };

  // ===============================
  // ✏ Opening an edit window
  // ===============================
  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setEditedTitle(task.title);
    setIsEditModalOpen(true);
  };

  // ===============================
  // 💾 Saving an editing task
  // ===============================
  const saveEditedTask = async () => {
    if (!taskToEdit) return;
    try {
      await updateTask(taskToEdit._id, { title: editedTitle });
      fetchTasks();
      setIsEditModalOpen(false);
      toast.success("Task updated successfully");
    } catch {
      toast.error("Error updating task");
    }
  };

  // ===============================
  // 🗑 Confirming task deletion
  // ===============================
  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  // ===============================
  // ❌ Removing Task
  // ===============================
  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskService(taskToDelete);
      fetchTasks();
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Error deleting task");
    } finally {
      setIsModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // ===============================
  // Filtration tasks
  // ===============================
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard!</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-6"
      >
        Exit
      </button>

      <form onSubmit={handleAddTask} className="flex mb-4 w-full max-w-md">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="flex-grow border p-2 rounded-l"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 rounded-r"
        >
          Add
        </button>
      </form>

      <FilterButtons currentFilter={filter} onFilterChange={setFilter} />

      <Tasks
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={confirmDeleteTask}
        onEdit={openEditModal}
      />

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteTask}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={saveEditedTask}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
      />
    </div>
  );
};

export default Dashboard;
