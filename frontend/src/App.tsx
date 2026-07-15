import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { router } from "@/routes/AppRouter";
import GlobalLoader from "@/components/GlobalLoader";

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<GlobalLoader text="Loading application..." />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#0f172a",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
            maxWidth: "400px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #22c55e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
