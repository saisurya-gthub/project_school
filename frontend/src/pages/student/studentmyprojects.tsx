import { AlertCircle } from "lucide-react";

import SearchBar from "@/components/student/SearchBar";
import Filters from "@/components/student/Filters";
import ProjectCard from "@/components/student/ProjectCard";
import Pagination from "@/components/student/Pagination";
import LoadingSkeleton from "@/components/student/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

import useMyProjects from "@/hooks/useMyProjects";

export default function StudentMyProjects() {
  const {
    projects,
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

    resetFilters,

    page,
    setPage,

    totalPages,
    totalProjects,

    refresh,
  } = useMyProjects();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">
          My Projects
        </h1>

        <p className="mt-2 text-surface-600">
          Projects submitted by you
        </p>

        <p className="mt-3 text-sm font-medium text-primary-600">
          {totalProjects} project{totalProjects !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search */}

      <SearchBar
        value={search}
        onChange={setSearch}
        className="mb-6"
      />

      {/* Filters */}

      <Filters
        className="mb-8"
        filterOptions={filterOptions}

        department={department}
        technology={technology}
        guide={guide}
        year={year}

        onDepartmentChange={setDepartment}
        onTechnologyChange={setTechnology}
        onGuideChange={setGuide}
        onYearChange={setYear}

        onReset={resetFilters}
      />

      {/* Loading */}

      {loading && <LoadingSkeleton />}

      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />

          <h2 className="text-lg font-semibold text-red-700">
            Failed to load projects
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Button
            className="mt-5"
            onClick={refresh}
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <EmptyState
              title="No Projects Found"
              description="You haven't uploaded any projects yet."
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}