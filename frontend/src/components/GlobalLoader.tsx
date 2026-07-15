import { Loader2 } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

interface GlobalLoaderProps {
  text?: string;
}

export default function GlobalLoader({ text = "Loading..." }: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo animation */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl font-bold">
              {APP_NAME.charAt(0)}
            </span>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-primary-600/20 animate-ping" />
        </div>

        {/* Loading spinner */}
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />

        {/* Text */}
        <p className="text-sm font-medium text-surface-500">{text}</p>
      </div>
    </div>
  );
}
