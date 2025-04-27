import { toast } from "sonner";
import api from "./index";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



export const tasksApi = {
  async getTasks() {
    try {
      await delay(300);
        const response = await api.get('/tasks');
        return response.data.data.tasks;
        
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  // Create a new task
  async createTask(task) {
    try {
      await delay(300);
      
      const response = await api.post('/tasks', task);
      return response.data.data.task;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  },

  // Update an existing task
  async updateTask(id, updates) {
    try {
      await delay(200);
      
      const response = await api.put(`/tasks/${id}`, updates);
      return response.data.data.task;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      toast.error('Failed to update task');
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id) {
    try {
      await delay(300);
      
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      toast.error('Failed to delete task');
      throw error;
    }
  }
};
