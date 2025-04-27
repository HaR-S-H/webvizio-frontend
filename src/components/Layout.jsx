
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";



export function Layout({ children }) {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
            <span className="bg-white text-primary p-1 rounded-md">WV</span>
            <span>WebVizio</span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center gap-2">
                <User size={16} />
                <span>{user.name}</span>
                <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs uppercase">
                  {user.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-white hover:text-primary">
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} WebVizio - Code Assessment Platform
        </div>
      </footer>
    </div>
  );
}
