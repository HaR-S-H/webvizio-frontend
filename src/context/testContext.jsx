import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const TestContext = createContext(undefined);

export const TestProvider = ({ children }) => {
  const [tests, setTests] = useState(null);
  const [loading, setLoading] = useState(true);

  

  

 
  return (
    <TestContext.Provider value={{tests,setTests}}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within an TestProvider");
  }
  return context;
};