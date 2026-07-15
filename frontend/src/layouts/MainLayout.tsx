import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Outlet />
    </div>
  );
}
