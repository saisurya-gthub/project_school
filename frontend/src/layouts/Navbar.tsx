import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/utils/helpers";
import { APP_NAME } from "@/utils/constants";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };




  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-200">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold text-surface-900 hidden sm:block">{APP_NAME}</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search projects, students..."
              className="w-full h-9 pl-10 pr-4 text-sm rounded-lg border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-surface-400 bg-surface-100 border border-surface-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen);}}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                {user ? getInitials(user.name) : "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-surface-900 leading-tight">{user?.name || "User"}</p>
                <p className="text-xs text-surface-500 capitalize">{user?.role || "student"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-surface-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-surface-200 shadow-lg animate-scale-in">
                <div className="px-4 py-3 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
                  <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-surface-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
