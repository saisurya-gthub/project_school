import { FileText, Presentation, FolderArchive, Image, Download, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/Button";

interface ProjectFilesProps {
  reportPdf?: string;
  pptFile?: string;
  zipFile?: string;
  screenshots: string[];
  className?: string;
}

interface FileItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  fileUrl?: string;
  available: boolean;
}

function FileItem({ icon, label, description, fileUrl, available }: FileItemProps) {
  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all",
        available
          ? "bg-white border-surface-200 hover:border-primary-300 hover:shadow-sm cursor-pointer"
          : "bg-surface-50 border-surface-100 opacity-60"
      )}
      onClick={available ? handleDownload : undefined}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg",
            available ? "bg-primary-50 text-primary-600" : "bg-surface-100 text-surface-400"
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-surface-900">{label}</p>
          <p className="text-xs text-surface-500">{description}</p>
        </div>
      </div>
      {available ? (
        <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
          Download
        </Button>
      ) : (
        <span className="text-xs text-surface-400 px-2 py-1 bg-surface-100 rounded-md">
          Not Available
        </span>
      )}
    </div>
  );
}

export default function ProjectFiles({
  reportPdf,
  pptFile,
  zipFile,
  screenshots,
  className,
}: ProjectFilesProps) {
  const files = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Project Report",
      description: "PDF Document",
      fileUrl: reportPdf,
      available: !!reportPdf,
    },
    {
      icon: <Presentation className="h-5 w-5" />,
      label: "Presentation",
      description: "PowerPoint File",
      fileUrl: pptFile,
      available: !!pptFile,
    },
    {
      icon: <FolderArchive className="h-5 w-5" />,
      label: "Source Code",
      description: "ZIP Archive",
      fileUrl: zipFile,
      available: !!zipFile,
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: "Screenshots",
      description: `${screenshots.length} Images`,
      available: screenshots.length > 0,
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-surface-900 mb-4">Project Files</h3>
      {files.map((file, index) => (
        <FileItem key={index} {...file} />
      ))}
    </div>
  );
}

export function DownloadButtons({
  reportPdf,
  pptFile,
  zipFile,
  githubLink,
  className,
}: {
  reportPdf?: string;
  pptFile?: string;
  zipFile?: string;
  githubLink?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {reportPdf && (
        <Button
          variant="primary"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={() => window.open(reportPdf, "_blank")}
        >
          Download Report
        </Button>
      )}
      {pptFile && (
        <Button
          variant="outline"
          leftIcon={<Presentation className="h-4 w-4" />}
          onClick={() => window.open(pptFile, "_blank")}
        >
          Download PPT
        </Button>
      )}
      {zipFile && (
        <Button
          variant="outline"
          leftIcon={<FolderArchive className="h-4 w-4" />}
          onClick={() => window.open(zipFile, "_blank")}
        >
          Download ZIP
        </Button>
      )}
      {githubLink && (
        <Button
          variant="secondary"
          leftIcon={<ExternalLink className="h-4 w-4" />}
          onClick={() => window.open(githubLink, "_blank")}
        >
          View on GitHub
        </Button>
      )}
    </div>
  );
}
