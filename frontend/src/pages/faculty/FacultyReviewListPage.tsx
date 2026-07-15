import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Card from "@/components/Card";
import Button from "@/components/Button";

import projectService from "@/services/projectService";
import type { Project } from "@/types/project";
import StatusBadge from "@/components/shared/StatusBadge";

export default function FacultyReviewListPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const pending = projects.filter(
    (p) => p.status === "Pending"
  ).length;

  const approved = projects.filter(
    (p) => p.status === "Approved"
  ).length;

  const rejected = projects.filter(
    (p) => p.status === "Rejected"
  ).length;

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await projectService.getReviewQueue();
      setProjects(data as Project[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Loader
        size="lg"
        text="Loading assigned projects..."
      />
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No Projects Assigned"
        description="You don't have any projects to review."
      />
    );
  }

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-3xl font-bold">
          Review Queue
        </h1>

        <p className="text-surface-500 mt-1">
          Projects assigned to you for review.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
            <p className="text-sm text-surface-500">
                Pending
            </p>

            <h2 className="text-3xl font-bold">
                {pending}
            </h2>
        </Card>

        <Card>
            <p className="text-sm text-surface-500">
                Approved
            </p>

            <h2 className="text-3xl font-bold">
                {approved}
            </h2>
        </Card>

        <Card>
            <p className="text-sm text-surface-500">
                Rejected
            </p>

            <h2 className="text-3xl font-bold">
                {rejected}
            </h2>
        </Card>

        <Card>
            <p className="text-sm text-surface-500">
                Total
            </p>

            <h2 className="text-3xl font-bold">
                {projects.length}
            </h2>
        </Card>

    </div>  
      {projects.map((project) => (
        <Card
          key={project.id}
          className="flex justify-between items-center"
        >
          <div>
            <StatusBadge status={project.status} size="md" />
            <h2 className="text-lg font-semibold">
              {project.title}
            </h2>

            <p className="text-sm text-surface-500">
              Student : {project.student_name}
            </p>

            <p className="text-sm text-surface-500">
              Department : {project.department}
            </p>


          </div>

          <Button
            onClick={() =>
              navigate(`/faculty/review/${project.id}`)
            }
          >
            Review
          </Button>

        </Card>
      ))}

    </div>
  );
}