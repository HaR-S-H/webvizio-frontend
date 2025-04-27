import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Login from "./Login";

export default function Index() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    document.title = "WebVizio - Web Code Assessment Platform";
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (user) {
    if (user.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  // If not logged in, show the login page
  return <Login />;
}
