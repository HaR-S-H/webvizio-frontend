import { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export function TestProvider({ children }) {
  const [tests, setTests] = useState([]);

  return (
    <TestContext.Provider value={{ tests, setTests }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTests() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
}