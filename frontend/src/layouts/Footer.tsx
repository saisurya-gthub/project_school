import { APP_NAME } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-surface-500">
        <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-surface-700 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-surface-700 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-surface-700 cursor-pointer transition-colors">Help</span>
        </div>
      </div>
    </footer>
  );
}
