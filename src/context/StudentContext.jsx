import { createContext, useContext, useState } from 'react';

// Context should be Capitalized
const StudentTestContext = createContext();

export function StudentTestProvider({ children }) {
  const [tests, setTests] = useState([]);
  const [submittedTests, setSubmittedTests] = useState([]);

  return (
    <StudentTestContext.Provider value={{ tests, setTests, submittedTests, setSubmittedTests }}>
      {children}
    </StudentTestContext.Provider>
  );
}

// Hook should also be correctly named
export function useStudentTests() {
  const context = useContext(StudentTestContext);
  if (!context) {
    throw new Error('useStudentTests must be used within a StudentTestProvider');
  }
  return context;
}
