import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[100px] sm:text-[140px] font-black text-surface-100 leading-none select-none">
            403
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-red-50">
              <ShieldOff className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 mb-2">Access Denied</h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
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
