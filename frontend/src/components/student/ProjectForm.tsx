import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Upload,
  X,
  Plus,
  FileText,
  Link,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import Card from "@/components/Card";

export interface ProjectFormData {
  title: string;
  abstract: string;
  department: string;
  year: string;
  guide_id: number;
  technologies: string[];
  githubLink: string;
  reportPdf: File | null;

}

interface Guide {
  id: number;
  name: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isSubmitting?: boolean;

  faculty?: Guide[];

  departments?: string[];

  years?: number[];

  technologiesList?: string[];
}

interface FileUploadProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onRemove: () => void;
}

function FileUpload({ icon, label, description, accept, file, onFileSelect, onRemove }: FileUploadProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  if (file) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800 truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-surface-300 rounded-xl hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group"
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-100 text-surface-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-surface-700 mb-1">{label}</p>
      <p className="text-xs text-surface-400">{description}</p>
    </label>
  );
}

export default function ProjectForm({
    onSubmit,
    isSubmitting = false,
    faculty = [],
    departments = [],
    years = [],
    technologiesList = [],
}: ProjectFormProps) {
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [reportPdf, setReportPdf] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: "",
      abstract: "",
      department: "",
      year: "",
      guide_id:0,
      githubLink: "",
    },
  });

  const addTechnology = () => {
    const tech = techInput.trim();
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    if (technologies.length === 0) {
      toast.error("Please add at least one technology");
      return;
    }
    
    await onSubmit({
      ...data,
      technologies,
      reportPdf,
    });
  };

  const departmentOptions = departments.map((d) => ({
    value: d,
    label: d,
  }));

  const yearOptions = years.map((y) => ({
    value: String(y),
    label: String(y),
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary-50">
            <FileText className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900">Basic Information</h2>
            <p className="text-xs text-surface-500">Enter your project details</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="Project Title *"
            placeholder="Enter a descriptive title for your project"
            error={errors.title?.message}
            {...register("title", {
              required: "Project title is required",
              minLength: { value: 10, message: "Title must be at least 10 characters" },
            })}
          />

          <TextArea
            label="Abstract *"
            placeholder="Provide a brief summary of your project (minimum 50 characters)..."
            rows={4}
            error={errors.abstract?.message}
            {...register("abstract", {
              required: "Abstract is required",
              minLength: { value: 50, message: "Abstract must be at least 50 characters" },
            })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Department *"
              options={departmentOptions}
              placeholder="Select department"
              error={errors.department?.message}
              {...register("department", { required: "Department is required" })}
            />

            <Select
              label="Year *"
              options={yearOptions}
              placeholder="Select year"
              error={errors.year?.message}
              {...register("year", { required: "Year is required" })}
            />
          </div>

          <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                    Project Guide *
                </label>

                <select
                    {...register("guide_id", {
                        required: "Please select a guide",
                        valueAsNumber: true,
                    })}
                    className="w-full h-10 rounded-lg border border-surface-300 px-3"
                >
                    <option value="">
                        Select Guide
                    </option>

                    {faculty.map((guide) => (
                        <option
                            key={guide.id}
                            value={guide.id}
                        >
                            {guide.name}
                        </option>
                    ))}
                </select>

                {errors.guide_id && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.guide_id.message}
                    </p>
                )}
            </div>
        </div>
      </Card>

      {/* Technologies */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Plus className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900">Technologies Used</h2>
            <p className="text-xs text-surface-500">Add all technologies used in your project</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a technology and press Enter..."
                className="w-full h-10 px-4 rounded-lg border border-surface-300 bg-white text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                list="tech-suggestions"
              />
              <datalist id="tech-suggestions">
                {technologiesList
                    .filter((t) => !technologies.includes(t))
                    .map((tech) => (
                        <option
                            key={tech}
                            value={tech}
                        />
                ))}
              </datalist>
            </div>
            <Button type="button" variant="outline" onClick={addTechnology} leftIcon={<Plus className="h-4 w-4" />}>
              Add
            </Button>
          </div>

          {technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="p-0.5 rounded-full hover:bg-primary-200 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400 italic">No technologies added yet</p>
          )}
        </div>
      </Card>

      {/* Links */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <Link className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900">Project Links</h2>
            <p className="text-xs text-surface-500">Add your repository link</p>
          </div>
        </div>

        <Input
          label="GitHub Repository Link"
          placeholder="https://github.com/username/project-name"
          error={errors.githubLink?.message}
          {...register("githubLink", {
            pattern: {
              value: /^https?:\/\/(www\.)?github\.com\/.+/i,
              message: "Please enter a valid GitHub URL",
            },
          })}
        />
      </Card>

      {/* File Uploads */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-green-50">
            <Upload className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900">Project Files</h2>
            <p className="text-xs text-surface-500">Upload your project documentation and files</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Report PDF */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Project Report (PDF) *
            </label>
            <FileUpload
              icon={<FileText className="h-6 w-6" />}
              label="Upload Report"
              description="PDF up to 20MB"
              accept=".pdf"
              file={reportPdf}
              onFileSelect={setReportPdf}
              onRemove={() => setReportPdf(null)}
            />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Upload className="h-4 w-4" />}
          size="lg"
        >
          Submit Project
        </Button>
      </div>
    </form>
  );
}
