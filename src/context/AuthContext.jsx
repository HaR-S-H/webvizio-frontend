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
    const token = Cookies.get("token"); // Retrieve token from cookies
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser); // Set user state if token and user data exist
      }
    }
    setLoading(false); // Stop loading once checked
  }, []);

  const login = async (email, password, role) => {
    try {
      let userData;

      // Use the correct auth API based on role
      if (role === "teacher") {
        userData = await teacherAuthApi.login(email, password); // Changed signup to login
      } else {
        userData = await studentAuthApi.login(email, password); // Changed signup to login
      }

      if (userData) {
        // Store token in cookies (expires in 7 days)
        Cookies.set("token", userData.token, { expires: 7 });

        // Store user data in localStorage
        const userToStore = {
          ...userData,
          role,
        };
        localStorage.setItem("user", JSON.stringify(userToStore));

        setUser(userToStore); // Set the user state
        toast.success(`Logged in successfully as ${role}`);
        return true;
      }
      toast.error(`Login failed for ${role}`);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Failed to login as ${role}`);
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

      // Clear stored data on logout
      Cookies.remove("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout properly");

      // Still clear local data even if the API call fails
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



