import { useCallback, useEffect, useState } from "react";
import projectService, { Project } from "@/services/projectService";

export default function useProject(id?: number) {
  const [project, setProject] = useState<Project | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchProject = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await projectService.getProject(id);

      setProject(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refresh: fetchProject,
  };
}