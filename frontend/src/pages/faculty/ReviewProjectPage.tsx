console.log("ReviewProjectPage rendered");
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";

import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { projectService } from "@/services";
import type { Project } from "@/services/projectService";


export default function ReviewProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        if (!id) return;

        const data = await projectService.getProject(Number(id));

        setProject(data);
      } catch (err) {
        console.error(err);

        toast.error("Failed to load project.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  const handleAction = async () => {
    if (!project || !actionType) return;

    try {
      setActionLoading(true);

      await projectService.updateStatus(
        project.id,
        actionType === "approve"
          ? "Approved"
          : "Rejected"
      );

      toast.success(
        actionType === "approve"
          ? "Project approved successfully!"
          : "Project rejected successfully!"
      );

      navigate("/faculty/review");

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to update project status."
      );

    } finally {

      setActionLoading(false);

      setActionType(null);

    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" text="Loading project..." />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you're looking for doesn't exist."
        action={<Button onClick={() => navigate("/faculty/review")}>Back to Review Queue</Button>}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        <StatusBadge status={project.status} size="md"/>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-surface-900 mb-4">
            Student
        </h3>

        <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-lg bg-primary-50">
                <User className="h-5 w-5 text-primary-600" />
            </div>

            <div>
                <p className="text-sm font-medium">
                    {project.student_name}
                </p>

                <p className="text-xs text-surface-500">
                    {project.department}
                </p>
            </div>

        </div>
    </Card>
      {/* Project Header */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-surface-900 mb-2">
              {project.title}
            </h1>

            <p className="text-sm text-surface-500 mb-5 leading-relaxed">
              {project.abstract}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-surface-600">

              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {project.department}
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {project.year}
              </span>

              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {project.guide_name}
              </span>

            </div>

            {project.technologies && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter(Boolean)
                  .map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>  
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <h2 className="text-base font-semibold text-surface-900 mb-4">
              Project Abstract
            </h2>

            <div className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
              {project.abstract}
            </div>
          </Card>

          {/* Files */}
          <Card>
            <h2 className="text-base font-semibold text-surface-900 mb-4">
              GitHub Repository
            </h2>

            {project.github_link ? (
              <Button
                variant="outline"
                leftIcon={<GitHubIcon className="h-5 w-5" />}
                onClick={() =>
                  window.open(project.github_link!, "_blank")
                }
              >
                Open Repository
              </Button>
            ) : (
              <p className="text-sm text-surface-500">
                No GitHub repository submitted.
              </p>
            )}
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          {project.status === "Pending" && (
            <Card className="bg-gradient-to-br from-surface-50 to-surface-100/50">
              <h3 className="text-base font-semibold text-surface-900 mb-4">Review Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  size="lg"
                  leftIcon={<CheckCircle2 className="h-5 w-5" />}
                  onClick={() => setActionType("approve")}
                >
                  Approve Project
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  size="lg"
                  leftIcon={<XCircle className="h-5 w-5" />}
                  onClick={() => setActionType("reject")}
                >
                  Reject Project
                </Button>
              </div>
              <p className="text-xs text-surface-400 mt-4 text-center">
                Student will be notified of your decision
              </p>
            </Card>
          )}


          {/* Project Guide */}
          <Card>
            <h3 className="text-base font-semibold text-surface-900 mb-4">
              Project Guide
            </h3>

            <div className="flex items-center gap-3">

              <div className="p-2.5 rounded-lg bg-purple-50">
                <User className="h-5 w-5 text-purple-600" />
              </div>

              <div>

                <p className="text-sm font-medium">
                  {project.guide_name}
                </p>

                <p className="text-xs text-surface-500">
                  {project.department}
                </p>

              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!actionType}
        onClose={() => setActionType(null)}
        onConfirm={handleAction}
        title={actionType === "approve" ? "Approve Project" : "Reject Project"}
        message={
          actionType === "approve"
            ? "Are you sure you want to approve this project? It will be visible to all users."
            : "Are you sure you want to reject this project? The student will be notified to make revisions."
        }
        confirmText={actionType === "approve" ? "Yes, Approve" : "Yes, Reject"}
        variant={actionType === "approve" ? "success" : "danger"}
        isLoading={actionLoading}
      />
    </div>
  );
}
