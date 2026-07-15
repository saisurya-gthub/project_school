import { useState } from "react";
import { Filter, X, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/Button";
import type { FilterOptions } from "@/services/projectService";

interface FiltersProps {
  filterOptions: FilterOptions | null;

  department: string;
  technology: string;
  year: string;
  guide: string;

  onDepartmentChange: (value: string) => void;
  onTechnologyChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onGuideChange: (value: string) => void;

  onReset: () => void;
  className?: string;
}

export default function Filters({
  filterOptions,
  department,
  technology,
  year,
  guide,
  onDepartmentChange,
  onTechnologyChange,
  onYearChange,
  onGuideChange,
  onReset,
  className,
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);


  const activeFilters =
  [department, technology, year, guide].filter(Boolean).length;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-surface-500" />

          <span className="text-sm font-medium text-surface-700">
            Filters
          </span>

          {activeFilters > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
              {activeFilters}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-surface-400 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 pt-0 space-y-4 border-t border-surface-100">

          
            <>
              {/* Department */}

              <div>
                <label className="block text-xs font-semibold text-surface-500 uppercase mb-2">
                  Department
                </label>

                <select
                  value={department}
                  onChange={(e) =>
                    onDepartmentChange(e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-surface-300"
                >
                  <option value="">
                    All Departments
                  </option>

                  {filterOptions?.departments.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technology */}

              <div>
                <label className="block text-xs font-semibold text-surface-500 uppercase mb-2">
                  Technology
                </label>

                <select
                  value={technology}
                  onChange={(e) =>
                    onTechnologyChange(e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-surface-300"
                >
                  <option value="">
                    All Technologies
                  </option>

                  {filterOptions?.technologies.map((tech) => (
                    <option
                      key={tech}
                      value={tech}
                    >
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guide */}

              <div>
                <label className="block text-xs font-semibold text-surface-500 uppercase mb-2">
                  Guide
                </label>

                <select
                  value={guide}
                  onChange={(e) => onGuideChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-surface-300"
                >
                  <option value="">
                    All Guides
                  </option>

                  {filterOptions?.guides.map((guideName) => (
                    <option
                      key={guideName}
                      value={guideName}
                    >
                      {guideName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}

              <div>
                <label className="block text-xs font-semibold text-surface-500 uppercase mb-2">
                  Year
                </label>

                <select
                  value={year}
                  onChange={(e) =>
                    onYearChange(e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-lg border border-surface-300"
                >
                  <option value="">
                    All Years
                  </option>

                  {filterOptions?.years.map((y) => (
                    <option
                      key={y}
                      value={String(y)}
                    >
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </>
          

          {activeFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              leftIcon={
                <RotateCcw className="h-4 w-4" />
              }
              onClick={onReset}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}

      {activeFilters > 0 && !isExpanded && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">

          {department && (
            <FilterTag
              label={department}
              onRemove={() =>
                onDepartmentChange("")
              }
            />
          )}

          {technology && (
            <FilterTag
              label={technology}
              onRemove={() =>
                onTechnologyChange("")
              }
            />
          )}

          {guide && (
            <FilterTag
              label={guide}
              onRemove={() =>
                onGuideChange("")
              }
            />
          )}

          {year && (
            <FilterTag
              label={year}
              onRemove={() =>
                onYearChange("")
              }
            />
          )}

        </div>
      )}
    </div>
  );
}

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-50 border border-primary-200 text-xs text-primary-700">
      {label}

      <button
        onClick={onRemove}
        className="hover:bg-primary-200 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}