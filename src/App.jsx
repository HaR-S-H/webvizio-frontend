import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TestProvider } from './context/TestContext';
import ProtectedRoute from "./components/ProtectedRoute";
// Pages
import Index from "./pages";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TestDetail from "./pages/teacher/TestDetail";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTestDetail from "./pages/student/TestDetail";
import NotFound from "./pages/NotFound";
import { StudentTestProvider } from "./context/StudentContext";
import StudentTestDetailSuccess from "./pages/student/TestDetailSuccess";
const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TestProvider>
        <StudentTestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Teacher routes */}
              <Route
                path="/teacher"
                element={<ProtectedRoute element={<TeacherDashboard />} requiredRole="teacher" />}
              />
              <Route
                path="/teacher/tests/:testId"
                element={<ProtectedRoute element={<TestDetail />} requiredRole="teacher" />}
              />

              {/* Student routes */}
              <Route
                path="/student"
                element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
              />
              <Route
                path="/student/tests/success/:testId"
                element={<ProtectedRoute element={<StudentTestDetailSuccess />} requiredRole="student" />}
              />
              <Route
                path="/student/tests/:testId"
                element={<ProtectedRoute element={<StudentTestDetail />} requiredRole="student" />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </StudentTestProvider>
      </TestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


