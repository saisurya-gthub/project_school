import { useCallback, useEffect, useMemo, useState } from "react";
import projectService, {
  Project,
  FilterOptions,
} from "@/services/projectService";

const PAGE_SIZE = 6;

export default function useBrowseProjects() {
  // ============================
  // States
  // ============================

  const [projects, setProjects] = useState<Project[]>([]);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search

  const [search, setSearch] = useState("");

  // Filters

  const [department, setDepartment] = useState("");
  const [technology, setTechnology] = useState("");
  const [guide, setGuide] = useState("");
  const [year, setYear] = useState("");

  // Pagination

  const [page, setPage] = useState(1);

  // ============================
  // Fetch Projects
  // ============================

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [projectsData, filtersData] =
        await Promise.all([
          projectService.browseProjects({
            department: department || undefined,
            technology: technology || undefined,
            guide: guide || undefined,
            year: year ? Number(year) : undefined,
          }),
          projectService.getFilterOptions(),
        ]);

      setProjects(projectsData);
      setFilterOptions(filtersData);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [
    department,
    technology,
    guide,
    year,
  ]);

  // ============================
  // Load whenever filters change
  // ============================

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ============================
  // Frontend Search
  // ============================

  const searchedProjects = useMemo(() => {
    if (!search.trim()) return projects;

    const keyword = search.toLowerCase();

    return projects.filter((project) => {
      return (
        project.title
          .toLowerCase()
          .includes(keyword) ||

        project.abstract
          .toLowerCase()
          .includes(keyword) ||

        project.department
          .toLowerCase()
          .includes(keyword) ||

        project.guide_name
          .toLowerCase()
          .includes(keyword) ||

        project.technologies
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [projects, search]);

  // ============================
  // Pagination
  // ============================

  const totalPages = Math.max(
    1,
    Math.ceil(
      searchedProjects.length /
        PAGE_SIZE
    )
  );

  const paginatedProjects =
    useMemo(() => {
      const start =
        (page - 1) * PAGE_SIZE;

      return searchedProjects.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      searchedProjects,
      page,
    ]);

  // ============================
  // Reset page when filters change
  // ============================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    department,
    technology,
    guide,
    year,
  ]);

  // ============================
  // Keep page valid
  // ============================

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  // ============================
  // Reset Filters
  // ============================

  const resetFilters = () => {
    setDepartment("");
    setTechnology("");
    setGuide("");
    setYear("");
  };

  // ============================
  // Return
  // ============================

  return {
    // Data

    projects: paginatedProjects,
    totalProjects: searchedProjects.length,
    filterOptions,

    // Loading

    loading,
    error,

    // Search

    search,
    setSearch,

    // Filters

    department,
    setDepartment,

    technology,
    setTechnology,

    guide,
    setGuide,

    year,
    setYear,

    resetFilters,

    // Pagination

    page,
    setPage,
    totalPages,

    // Refresh

    refresh: fetchProjects,
  };
}