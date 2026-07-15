import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

// Main Pages
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage2 from "@/pages/ProfilePage2";

// Student Module Pages
import StudentDashboardPage from "@/pages/student/StudentDashboardPage";
import StudentUploadPage from "@/pages/student/StudentUploadPage";
import StudentBrowsePage from "@/pages/student/StudentBrowsePage";
import StudentProjectDetailPage from "@/pages/student/StudentProjectDetailPage";

// Faculty Module Pages
import FacultyDashboardPage from "@/pages/faculty/FacultyDashboardPage";
import ReviewProjectPage from "@/pages/faculty/ReviewProjectPage";


import FacultyReviewListPage from "@/pages/faculty/FacultyReviewListPage";
import Studentmyprojects from "@/pages/student/studentmyprojects";


export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Main Dashboard
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      // Profile
      {
        path: "profile",
        element: <ProfilePage2 />,
      },
      // Browse Projects (all roles)
      {
        path: "browse",
        element: <StudentBrowsePage />,
      },
      {
        path: "projects/:id",
        element: <StudentProjectDetailPage />,
      },
      // Student Module
      {
        path: "student/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/upload",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentUploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/projects",
        element: <Studentmyprojects/>,
      },
      {
        path: "student/projects/:id",
        element: <StudentProjectDetailPage />,
      },
      // Faculty Module
      {
        path: "faculty",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "faculty/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "faculty/review",
        element: (
            <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyReviewListPage />
            </ProtectedRoute>
        ),
      },
      {
        path: "faculty/review/:id",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <ReviewProjectPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
