import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import ProjectForm, { type ProjectFormData } from "@/components/student/ProjectForm";
import { authService, projectService } from "@/services";
import { Faculty } from "@/services/authService";

export default function StudentUploadPage() {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const [departments, setDepartments] = useState<string[]>([]);

  const [years, setYears] = useState<number[]>([]);

  const [technologies, setTechnologies] = useState<string[]>([]);
  useEffect(() => {
    async function loadData() {
        try {
            const [facultyData, filterData] =
                await Promise.all([
                    authService.getFacultyList(),
                    projectService.getFilterOptions(),
                ]);

            setFaculty(facultyData);

            setDepartments(filterData.departments);

            setYears(filterData.years);

            setTechnologies(filterData.technologies);

        } catch (err) {
            console.error(err);

            toast.error("Failed to load form data");
        }
    }

    loadData();
  }, []);
  
  const handleSubmit = async (data: ProjectFormData) => {
    
    try {
      setIsSubmitting(true);

      // Step 1: Create Project
      const project = await projectService.createProject({
        title: data.title,
        abstract: data.abstract,
        department: data.department,
        year: Number(data.year),
        guide_id: Number(data.guide_id),
        technologies: data.technologies.join(", "),
        github_link: data.githubLink || undefined,
      });

      // Step 2: Upload PDF
      if (data.reportPdf) {
        console.log(data.reportPdf);
        console.log(data.reportPdf instanceof File);
        console.log(data.reportPdf?.name);
        await projectService.uploadReport(
          project.id,
          data.reportPdf
        );
      }

      toast.success("Project uploaded successfully!");

      navigate("/student/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Upload Project</h1>
          <p className="text-surface-500 mt-0.5">Submit your project for review and publication</p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 rounded-xl bg-white shadow-sm">
            <Lightbulb className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary-900 mb-2">Submission Guidelines</h3>
            <ul className="space-y-1.5 text-sm text-primary-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                Provide a clear and descriptive project title
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                Abstract should summarize your project in 50-300 words
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                Upload your report in PDF format (required)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                List all technologies used in your project
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <ProjectForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          faculty={faculty}
          departments={departments}
          years={years}
          technologiesList={technologies}
      />
    </div>
  );
}
