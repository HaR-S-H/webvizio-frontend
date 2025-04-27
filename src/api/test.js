import api from "./index";
import { toast } from "sonner";

// Helper function to handle file uploads with proper FormData
const createFormDataWithFiles = (testData) => {
  const formData = new FormData();
  
  // Add all text/JSON fields
  formData.append("name", testData.name);
  formData.append("language", testData.language);
  formData.append("maxMarks", testData.maxMarks);
  formData.append("course", testData.course);
  formData.append("startingTime", testData.startTime);
  formData.append("endingTime", testData.endTime);
  formData.append("tips", JSON.stringify(testData.tips));
  formData.append("githubLink", testData.repoUrl);
  
  // Add files if they exist
  if (testData.instructionsPdf) {
    formData.append("pdf", testData.instructionsPdf);
  }
  
  if (testData.instructionVideo) {
    formData.append("video", testData.instructionVideo);
  }
  
  if (testData.studentExcel) {
    formData.append("excel", testData.studentExcel);
  }
  
  return formData;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const testApi = {
  async createTest(testData) {
    try {
      const formData = createFormDataWithFiles(testData);
      
      const response = await api.post('/test/teacher', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data.test;
    } catch (error) {
      console.error('Error creating test:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create test';
      toast.error(errorMessage);
      throw error;
    }
  },
  
  async getAllTests() {
    try {
      await delay(300); // Small delay to show loading states
      
      const response = await api.get('/test/teacher');
      return response.data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to fetch tests');
      throw error;
    }
  },
  
  async updateTest(testId, testData) {
    try {
      const formData = createFormDataWithFiles(testData);
      
      const response = await api.put(`/test/teacher/${testId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.data.test;
    } catch (error) {
      console.error('Error updating test:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update test';
      toast.error(errorMessage);
      throw error;
    }
  },
  
  async deleteTest(testId) {
    try {
      await delay(300); // Small delay to show loading states
      
      const response = await api.delete(`/test/teacher/${testId}`);
      
      toast.success('Test deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
      throw error;
    }
  }
};