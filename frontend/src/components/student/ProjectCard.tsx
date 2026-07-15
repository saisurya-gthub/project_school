import { useNavigate } from "react-router-dom";
import { Eye, User, Calendar } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";import { cn } from "@/utils/cn";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import type { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({
  project,
  className,
}: ProjectCardProps) {
  const navigate = useNavigate();

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

  const handleViewDetails = () => {
    navigate(`/student/projects/${project.id}`);
  };

  const handleGithub = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (project.github_link) {
      window.open(
        project.github_link,
        "_blank"
      );
    }
  };

  const technologies =
    project.technologies
      ?.split(",")
      .map((t) => t.trim()) ?? [];

  return (
    <div
      className={cn(
        "group bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-lg hover:border-surface-300 transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={handleViewDetails}
    >
      {/* Header */}

      <div className="p-5 border-b border-surface-100">
        <div className="flex items-center justify-between">

          <Badge
            variant={statusVariant(project.status)}
          >
            {project.status}
          </Badge>

          <span className="text-sm text-surface-500 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {project.year}
          </span>

        </div>
      </div>

      {/* Content */}

      <div className="p-5">

        <div className="text-sm text-primary-600 font-medium mb-2">
          {project.department}
        </div>

        <h3 className="text-lg font-semibold mb-3 text-surface-900 group-hover:text-primary-600 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-surface-500 line-clamp-3 mb-4">
          {project.abstract}
        </p>

        <div className="flex items-center gap-2 text-sm text-surface-500 mb-4">
          <User className="h-4 w-4" />
          {project.guide_name}
        </div>

        {/* Technologies */}

        <div className="flex flex-wrap gap-2 mb-5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-md bg-primary-50 text-primary-600 text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}

        <div className="flex justify-between items-center pt-4 border-t border-surface-100">

          <Button
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={handleViewDetails}
          >
            View Details
          </Button>

          {project.github_link && (
            <button
              onClick={handleGithub}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <GitHubIcon className="h-5 w-5" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}