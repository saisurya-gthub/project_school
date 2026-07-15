import { ArrowLeft, RefreshCw, Download, } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";

import useProject from "@/hooks/useProject";
import projectService from "@/services/projectService";

export default function StudentProjectDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    project,
    loading,
    error,
    refresh,
  } = useProject(Number(id));

  const statusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success" as const;

      case "pending":
        return "warning" as const;

      case "rejected":
        return "danger" as const;

      default:
        return "default" as const;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader
          size="lg"
          text="Loading Project..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load project"
        description={error}
        action={
          <Button
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={refresh}
          >
            Try Again
          </Button>
        }
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project Not Found"
        description="The requested project does not exist."
      />
    );
  }

  const technologies = project.technologies
    .split(",")
    .map((tech) => tech.trim());

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      {/* Back */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-surface-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />

        Back
      </button>

      {/* Header */}

      <Card>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <Badge
              variant={statusVariant(project.status)}
            >
              {project.status}
            </Badge>

            <h1 className="mt-3 text-3xl font-bold text-surface-900">
              {project.title}
            </h1>

            <p className="mt-2 text-surface-500">
              {project.department}
            </p>

          </div>

          <div className="flex gap-3">

            <Button
              variant="outline"
              leftIcon={<Download className="h-5 w-5" />}
              onClick={() =>
                projectService.downloadReport(project.id)
              }
            >
              Download Report
            </Button>

            {project.github_link && (
              <Button
                leftIcon={<GitHubIcon className="h-5 w-5" />}
                onClick={() =>
                  window.open(
                    project.github_link,
                    "_blank"
                  )
                }
              >
                GitHub Repository
              </Button>
            )}

          </div>

        </div>

      </Card>

      {/* Project Information */}

      <Card>

        <h2 className="text-xl font-semibold mb-5">
          Project Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-surface-500">
              Department
            </p>

            <p className="font-semibold">
              {project.department}
            </p>
          </div>

          <div>
            <p className="text-sm text-surface-500">
              Guide
            </p>

            <p className="font-semibold">
              {project.guide_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-surface-500">
              Academic Year
            </p>

            <p className="font-semibold">
              {project.year}
            </p>
          </div>

        </div>

      </Card>

      {/* Abstract */}

      <Card>

        <h2 className="text-xl font-semibold mb-4">
          Abstract
        </h2>

        <p className="leading-7 text-surface-600 whitespace-pre-line">
          {project.abstract}
        </p>

      </Card>

      {/* Technologies */}

      <Card>

        <h2 className="text-xl font-semibold mb-4">
          Technologies Used
        </h2>

        <div className="flex flex-wrap gap-2">

          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
            >
              {tech}
            </span>
          ))}

        </div>

      </Card>

    </div>
  );
}