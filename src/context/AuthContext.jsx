import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { teacherAuthApi, studentAuthApi } from "@/api/auth"; // Import your auth APIs

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on page load
    const token = Cookies.get("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      let userData;
      
      if (role === "teacher") {
        // Use your teacherAuthApi for teacher login
        userData = await teacherAuthApi.signup(email, password);
      } else {
        // Use your studentAuthApi for student login
        userData = await studentAuthApi.signup(email, password);
      }
      
      if (userData) {
        // Store user data with role information
        const userToStore = {
          ...userData,
          role
        };
        
        localStorage.setItem("user", JSON.stringify(userToStore));
        setUser(userToStore);
        // toast.success(`Logged in successfully as ${role}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      // toast.error(`Failed to login as ${role}`);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        // Use the appropriate logout API based on user role
        if (user.role === "teacher") {
          await teacherAuthApi.logout();
        } else {
          await studentAuthApi.logout();
        }
      }
      
      // Clear stored data
      Cookies.remove("token");
      localStorage.removeItem("user");
      setUser(null);
      // toast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // toast.error("Failed to logout properly");
      
      // Still clear local data even if API call fails
      Cookies.remove("token");
      localStorage.removeItem("user");
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};