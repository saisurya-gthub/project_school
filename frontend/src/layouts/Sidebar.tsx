import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FolderSearch,

  User,
  LogOut,
  X,
  BookOpen,
  Home,

  FileCheck,

} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { APP_NAME } from "@/utils/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["student", "faculty"] },
  { to: "/browse", icon: FolderSearch, label: "Browse Projects", roles: ["student", "faculty"] },
  { to: "/profile", icon: User, label: "Profile", roles: ["student", "faculty"] },
];

const studentNavItems = [
  { to: "/student/dashboard", icon: Home, label: "My Dashboard", roles: ["student"] },
  { to: "/student/upload", icon: Upload, label: "Submit Project", roles: ["student"] },
  { to: "/student/projects", icon: FolderSearch, label: "All Projects", roles: ["student", "faculty", "admin"] },
];

const facultyNavItems = [
  { to: "/faculty/dashboard", icon: FileCheck, label: "Review Projects", roles: ["faculty", "admin"] },
];


export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filterByRole = (items: typeof mainNavItems) =>
    items.filter((item) => !user?.role || item.roles.includes(user.role));

  const filteredMain = filterByRole(mainNavItems);
  const filteredStudent = filterByRole(studentNavItems);
  const filteredFaculty = filterByRole(facultyNavItems);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-surface-200 flex flex-col transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold text-surface-900">{APP_NAME}</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Main */}
          <p className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">Menu</p>
          {filteredMain.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn("sidebar-link", isActive ? "sidebar-link-active" : "sidebar-link-inactive")
              }
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Student Section */}
          {user?.role === "student" && filteredStudent.length > 0 && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Student
                </p>
              </div>
              {filteredStudent.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn("sidebar-link", isActive ? "sidebar-link-active" : "sidebar-link-inactive")
                  }
                >
                  <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}

          {/* Faculty Section */}
          {user?.role === "faculty"  && filteredFaculty.length > 0 && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-3 py-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Faculty
                </p>
              </div>
              {filteredFaculty.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn("sidebar-link", isActive ? "sidebar-link-active" : "sidebar-link-inactive")
                  }
                >
                  <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}

        </nav>

        {/* User section */}
        <div className="border-t border-surface-200 p-3 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link sidebar-link-inactive w-full text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
