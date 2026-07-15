// ======================================================
// Application
// ======================================================

export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "Project Repository";

export const APP_VERSION =
  import.meta.env.VITE_APP_VERSION || "1.0.0";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


// ======================================================
// User Roles
// ======================================================

export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];

export const ROLE_OPTIONS = [
  {
    value: ROLES.STUDENT,
    label: "Student",
  },
  {
    value: ROLES.FACULTY,
    label: "Faculty",
  },
];


// ======================================================
// Project Status
// ======================================================

export const PROJECT_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const STATUS_OPTIONS = [
  {
    value: PROJECT_STATUS.PENDING,
    label: "Pending",
  },
  {
    value: PROJECT_STATUS.APPROVED,
    label: "Approved",
  },
  {
    value: PROJECT_STATUS.REJECTED,
    label: "Rejected",
  },
];


// ======================================================
// Status Badge Colors
// ======================================================

export const STATUS_COLORS: Record<
  string,
  string
> = {
  Pending:
    "bg-yellow-50 text-yellow-700 border-yellow-200",

  Approved:
    "bg-green-50 text-green-700 border-green-200",

  Rejected:
    "bg-red-50 text-red-700 border-red-200",

  student:
    "bg-blue-50 text-blue-700 border-blue-200",

  faculty:
    "bg-purple-50 text-purple-700 border-purple-200",
};


// ======================================================
// Pagination
// ======================================================

export const DEFAULT_PAGE_SIZE = 6;

export const PAGE_SIZE_OPTIONS = [
  6,
  12,
  24,
];


// ======================================================
// File Upload Limits
// ======================================================

export const MAX_FILE_SIZE = {
  PDF: 20 * 1024 * 1024, // 20 MB
};


// ======================================================
// Allowed File Types
// ======================================================

export const ALLOWED_FILE_TYPES = {
  PDF: [".pdf"],
};