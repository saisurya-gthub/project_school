import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";


import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { type Column } from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { projectService } from "@/services";
import type { Project } from "@/services/projectService";


export default function FacultyDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectService.getReviewQueue();

        console.log(data);

        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const pendingProjects = projects.filter((p) => p.status === "Pending");
  const approvedProjects = projects.filter(
  (p) => p.status === "Approved"
  ).length;

  const rejectedProjects = projects.filter(
    (p) => p.status === "Rejected"
  ).length;

  const stats = [
    {
      label: "Pending Review",
      value: pendingProjects.length,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      trend: `${pendingProjects.length} awaiting`,
    },
    {
      label: "Approved Projects",
      value: approvedProjects,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      trend: "Approved",
    },
    {
      label: "Rejected Projects",
      value: rejectedProjects,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      trend: "Rejected",
    },
    {
      label: "Total Projects",
      value: projects.length,
      icon: FileText,
      color: "bg-primary-50 text-primary-600",
      trend: "+5 this month",
    },
  ];

  const handleAction = async () => {
  if (!selectedProject || !actionType) return;

  try {
    setActionLoading(true);

    await projectService.updateStatus(
      selectedProject.id,
      actionType === "approve"
        ? "Approved"
        : "Rejected"
    );

    const updatedProjects =
      await projectService.getAllProjects()

    setProjects(updatedProjects);

    toast.success(
      `Project ${
        actionType === "approve"
          ? "approved"
          : "rejected"
      } successfully!`
    );

    setSelectedProject(null);
    setActionType(null);

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to update project status."
    );

  } finally {

    setActionLoading(false);

  }
};

  const columns: Column<Project>[] = [
  {
    key: "title",
    header: "Project",
    sortable: true,
    render: (project) => (
      <div>
        <p className="font-medium text-surface-900">
          {project.title}
        </p>

        <p className="text-sm text-surface-500 truncate max-w-xs">
          {project.technologies}
        </p>
      </div>
    ),
  },

  {
    key: "department",
    header: "Department",
    sortable: true,
  },

  {
    key: "guide",
    header: "Guide",
    sortable: true,
  },

  {
    key: "year",
    header: "Year",
    sortable: true,
  },

  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (project) => (
      <StatusBadge status={project.status} />
    ),
  },

  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",

    render: (project) => (
      <div className="flex justify-end gap-2">

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Navigating to", `/faculty/review/${project.id}`);
            navigate(`/faculty/review/${project.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>

        {project.status === "Pending" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProject(project);
                setActionType("approve");
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProject(project);
                setActionType("reject");
              }}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    ),
  },
];
console.log("Projects state:", projects);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Faculty Dashboard</h1>
          <p className="text-surface-500 mt-1">Review and manage student project submissions</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
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
              <TrendingUp className="h-3.5 w-3.5 text-surface-400" />
              <span className="text-xs text-surface-500">{stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Review Queue Button */}

      <div className="flex justify-end">
          <Button
              onClick={() => navigate("/faculty/review")}
          >
              Open Review Queue
          </Button>
      </div>

      {/* Pending Alert */}
      {pendingProjects.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">{pendingProjects.length} projects</span> are waiting for your review.
            Please review them at your earliest convenience.
          </p>
        </div>
      )}

      {/* Projects Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-900">Project Submissions</h2>
          <Badge variant="primary">{projects.length} Total</Badge>
        </div>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="border rounded p-4">
              <h3>{project.title}</h3>
              <p>{project.department}</p>
              <p>{project.status}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!selectedProject && !!actionType}
        onClose={() => {
          setSelectedProject(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        title={actionType === "approve" ? "Approve Project" : "Reject Project"}
        message={
          actionType === "approve"
            ? `Are you sure you want to approve "${selectedProject?.title}"? This action will make the project visible to all users.`
            : `Are you sure you want to reject "${selectedProject?.title}"? The student will be notified to make revisions.`
        }
        confirmText={actionType === "approve" ? "Approve" : "Reject"}
        variant={actionType === "approve" ? "success" : "danger"}
        isLoading={actionLoading}
      />
    </div>
  );
}
