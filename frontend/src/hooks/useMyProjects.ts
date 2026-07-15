import { useCallback, useEffect, useMemo, useState } from "react";
import projectService, {
  Project,
  FilterOptions,
} from "@/services/projectService";

const PAGE_SIZE = 6;

export default function useMyProjects() {
  // ==========================
  // State
  // ==========================

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

  // ==========================
  // Load Filter Options
  // ==========================

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await projectService.getFilterOptions();
        setFilterOptions(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadFilters();
  }, []);

  // ==========================
  // Load My Projects
  // ==========================

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await projectService.getMyProjects();

      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ==========================
  // Frontend Filtering
  // ==========================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesDepartment =
        !department || project.department === department;

      const matchesTechnology =
        !technology ||
        project.technologies
          .toLowerCase()
          .includes(technology.toLowerCase());

      const matchesGuide =
        !guide || project.guide_name === guide;

      const matchesYear =
        !year || project.year === Number(year);

      return (
        matchesDepartment &&
        matchesTechnology &&
        matchesGuide &&
        matchesYear
      );
    });
  }, [
    projects,
    department,
    technology,
    guide,
    year,
  ]);

  // ==========================
  // Search
  // ==========================

  const searchedProjects = useMemo(() => {
    if (!search.trim()) return filteredProjects;

    const keyword = search.toLowerCase();

    return filteredProjects.filter((project) => {
      return (
        project.title.toLowerCase().includes(keyword) ||
        project.abstract.toLowerCase().includes(keyword) ||
        project.department.toLowerCase().includes(keyword) ||
        project.technologies.toLowerCase().includes(keyword) ||
        (project.guide_name ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [filteredProjects, search]);

  // ==========================
  // Pagination
  // ==========================

  const totalProjects = searchedProjects.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProjects / PAGE_SIZE)
  );

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return searchedProjects.slice(
      start,
      start + PAGE_SIZE
    );
  }, [searchedProjects, page]);

  // ==========================
  // Reset Page
  // ==========================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    department,
    technology,
    guide,
    year,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==========================
  // Reset Filters
  // ==========================

  const resetFilters = () => {
    setDepartment("");
    setTechnology("");
    setGuide("");
    setYear("");
  };

  // ==========================
  // Return
  // ==========================

  return {
    projects: paginatedProjects,

    totalProjects,
    totalPages,

    loading,
    error,

    filterOptions,

    search,
    setSearch,

    department,
    setDepartment,

    technology,
    setTechnology,

    guide,
    setGuide,

    year,
    setYear,

    page,
    setPage,

    resetFilters,

    refresh: fetchProjects,
  };
}