import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import Button from "@/components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[120px] sm:text-[160px] font-black text-surface-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-primary-50">
              <SearchX className="h-12 w-12 text-primary-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 mb-2">Page not found</h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. Please check the URL or navigate back.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home className="h-4 w-4" />}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
