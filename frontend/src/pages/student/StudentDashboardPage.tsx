import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  Upload,
  Search,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { DashboardSkeleton } from "@/components/student/LoadingSkeleton";

import  projectService  from "@/services/projectService";

interface StudentProject {
    id: number;
    title: string;
    abstract: string;
    department: string;
    year: number;
    guide: string;
    technologies: string;
    github_link?: string;
    status: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [recentProjects, setRecentProjects] = useState<StudentProject[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalViews: 0,
    totalDownloads: 0,
  });


  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {

      try {

          const projects: StudentProject[] = await projectService.getMyProjects();

          setRecentProjects(projects);

          setStats({
              total: projects.length,

              approved: projects.filter(
                  p => p.status.toLowerCase() === "approved"
              ).length,

              pending: projects.filter(
                  p => p.status.toLowerCase() === "pending"
              ).length,

              rejected: projects.filter(
                  p => p.status.toLowerCase() === "rejected"
              ).length,

              totalViews: 0,
              totalDownloads: 0,
          });

      } catch (err) {

          console.log(err);

      } finally {

          setLoading(false);

      }
  };

  const statCards = [
    {
      label: "Total Projects",
      value: stats.total,
      icon: FolderOpen,
      color: "bg-primary-50 text-primary-600",
      change: "+3 this month",
      changeColor: "text-green-600",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      change:
        stats.total > 0
          ? `${Math.round((stats.approved / stats.total) * 100)}% rate`
          : "No projects",
      changeColor: "text-green-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      change: "Awaiting review",
      changeColor: "text-yellow-600",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      change: stats.rejected > 0 ? "Needs revision" : "None",
      changeColor: "text-red-600",
    },
  ];

  const statusVariant = (
      status: string
  ): "success" | "warning" | "danger" | "default" => {

      switch (status.toLowerCase()) {

          case "approved":
              return "success";

          case "pending":
              return "warning";

          case "rejected":
              return "danger";

          default:
              return "default";
      }
  };


  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-surface-500 mt-1">
            Manage and track your project submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Search className="h-4 w-4" />}
            onClick={() => navigate("/browse")}
          >
            Browse Projects
          </Button>
          <Button
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => navigate("/student/upload")}
          >
            Upload Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} hover className="cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Uploads Table */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-base font-semibold text-surface-900">Recent Uploads</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/student/projects")}
                rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
              >
                View all
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase hidden sm:table-cell">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-surface-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {recentProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-surface-100">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate max-w-[200px]">
                              {project.title}
                            </p>
                            <p className="text-xs text-surface-500">{project.guide}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-surface-600">{project.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(project.status)}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-surface-500">{project.year}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/student/projects/${project.id}`)}
                          leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-start"
                size="lg"
                leftIcon={<Upload className="h-5 w-5" />}
                onClick={() => navigate("/student/upload")}
              >
                Upload New Project
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                leftIcon={<Search className="h-5 w-5" />}
                onClick={() => navigate("/browse")}
              >
                Browse Projects
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="text-center py-6 text-surface-500">
                  No recent activity
              </div>
            </div>
          </Card>

          {/* Stats Overview */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">Overall Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <Eye className="h-4 w-4 text-surface-400" />
                  Total Views
                </div>
                <span className="text-sm font-semibold text-surface-900">
                  {stats.totalViews.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-surface-600">
                  <Download className="h-4 w-4 text-surface-400" />
                  Total Downloads
                </div>
                <span className="text-sm font-semibold text-surface-900">
                  {stats.totalDownloads.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t border-surface-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500">Approval Rate</span>
                  <span className="text-xs font-semibold text-green-600">
                    {stats.total > 0
                      ? `${Math.round((stats.approved / stats.total) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{
                        width:
                            stats.total > 0
                                ? `${(stats.approved / stats.total) * 100}%`
                                : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
