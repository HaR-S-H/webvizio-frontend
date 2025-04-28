import { toast } from "sonner";
import api from "./index";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



export const teacherAuthApi = {
  async signup(email, password) {
    try {
      await delay(300);
        const response = await api.post('/auth/teacher', { email, password });
        toast.success(response.data.message);
        return response.data.data.teacher;
    } catch (error) {
      console.error('Error in login teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to login teacher');
    }
  },

  async logout() {
    try {
      await delay(300);
      
        const response = await api.post('/auth/teacher/logout');
        toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error('Error in logout:', error);
      toast.error(error.response?.data?.message || 'Failed to logout teacher');
      throw error;
    }
  },

};

export const studentAuthApi = {
  async signup(email, password) {
    try {
      await delay(300);
        const response = await api.post('/auth/student', { email, password });
        toast.success(response.data.message);
        return response.data.data.student;
        
    } catch (error) {
      console.error('Error in login student:', error);
      toast.error(error.response?.data?.message || 'Failed to login student');
    }
  },

  async logout() {
    try {
      await delay(300);
      
        const response = await api.post('/auth/student/logout');
        toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
        console.error('Error in logout:', error);
        toast.error(error.response?.data?.message || 'Failed to logout student');
      toast.error('Failed to logout');
      throw error;
    }
  },

};
