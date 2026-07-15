import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Eye,
  Heart,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { formatDate, truncate } from "@/utils/helpers";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const projects: any[] = [];

  const statusVariant = (status: string) => {
    switch (status) {
      case "approved": return "success" as const;
      case "pending": return "warning" as const;
      case "rejected": return "danger" as const;
      case "in_review": return "info" as const;
      default: return "default" as const;
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-surface-500 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        {user?.role === "student" && (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate("/student/upload")}>
            New Project
          </Button>
        )}
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900">Recent Projects</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/projects")} rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                View all
              </Button>
            </div>
            <div className="divide-y divide-surface-100">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/student/projects/${project.id}`)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">{project.title}</p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {project.author.name} · {project.department}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <Badge variant={statusVariant(project.status)}>
                      {project.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-surface-400">{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

  

          {projects[0] && (
            <Card hover className="cursor-pointer" onClick={() => navigate(`/student/projects/${projects[0].id}`)}>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">🔥 Trending</p>
              <h4 className="text-sm font-semibold text-surface-900">{truncate(projects[0].title, 50)}</h4>
              <p className="text-xs text-surface-500 mt-1">{projects[0].author.name}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-surface-400">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{projects[0].views}</span>
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{projects[0].likes}</span>
              </div>
            </Card>
          )}
        </div>
      </div>
  );
}
