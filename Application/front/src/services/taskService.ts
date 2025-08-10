import API from "../API";
import { getAuthToken } from "../utils/authToken";
//Type of task
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

// ===============================
// ===============================
// 📥 Get all tasks
// ===============================
export const getTask = async () => {
  const res = await API.get("/tasks", {
    headers: getAuthToken(),
  });
  return res.data; // array of tasks
};

// ===============================
// ➕ Create a task
// ===============================
export const createTask = async (title: string) => {
  const res = await API.post("/tasks", { title }, { headers: getAuthToken() });
  return res.data; // created task
};

// ===============================
// ✏ Update task
// ===============================
export const updateTask = async (
  id: string,
  data: Partial<Pick<Task, "title" | "completed">>
) => {
  const res = await API.put(`/tasks/${id}`, data, {
    headers: getAuthToken(),
  });
  return res.data; // updated task
};

// ===============================
// 🗑 Delete a task
// ===============================
export const deleteTaskService = async (id: string) => {
  const res = await API.delete(`/tasks/${id}`, {
    headers: getAuthToken(),
  });
  return res.data; //deleted task
};
