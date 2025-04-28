import { toast } from "sonner";
import api from "./index";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const resultApi = {    
  async getResult(testId) {
    try {
      await delay(300);
      
      const response = await api.get(`/result/${testId}`);
      const marks = response.data?.data?.result?.marks;
      
      // Always make sure it's an array
      return Array.isArray(marks) ? marks : [];
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  }
};
