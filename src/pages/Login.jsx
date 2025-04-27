import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    if (user.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient">
      <div className="container mx-auto px-4 h-full">
        <div className="grid md:grid-cols-2 gap-8 items-center h-full">
          <div className="hidden md:block">
            <div className="text-white space-y-6">
              <h1 className="text-4xl font-bold">WebVizio</h1>
              <p className="text-xl">
                The comprehensive web code assessment platform for educators and students
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">For Teachers</h3>
                    <p className="text-white/80">Create and manage assessments, track student progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">For Students</h3>
                    <p className="text-white/80">Submit your code, get feedback, and improve your skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Plagiarism Detection</h3>
                    <p className="text-white/80">Ensure academic integrity with advanced code comparison</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-12">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
