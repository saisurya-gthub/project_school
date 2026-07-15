/**
 * Validation utility functions
 */

// Email validation
export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
  },
};

// Password validation
export const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: "Password must contain uppercase, lowercase, and number",
  },
};

// Simple password validation (for login)
export const simplePasswordValidation = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters",
  },
};

// Name validation
export const nameValidation = {
  required: "Name is required",
  minLength: {
    value: 2,
    message: "Name must be at least 2 characters",
  },
  maxLength: {
    value: 100,
    message: "Name cannot exceed 100 characters",
  },
};

// Title validation (for projects)
export const titleValidation = {
  required: "Title is required",
  minLength: {
    value: 5,
    message: "Title must be at least 5 characters",
  },
  maxLength: {
    value: 200,
    message: "Title cannot exceed 200 characters",
  },
};

// Description/Abstract validation
export const descriptionValidation = {
  required: "Description is required",
  minLength: {
    value: 20,
    message: "Description must be at least 20 characters",
  },
  maxLength: {
    value: 5000,
    message: "Description cannot exceed 5000 characters",
  },
};

// URL validation
export const urlValidation = {
  pattern: {
    value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    message: "Please enter a valid URL",
  },
};

// GitHub URL validation
export const githubUrlValidation = {
  pattern: {
    value: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
    message: "Please enter a valid GitHub repository URL",
  },
};

// Phone validation
export const phoneValidation = {
  pattern: {
    value: /^\+?[\d\s-]{10,}$/,
    message: "Please enter a valid phone number",
  },
};

// Required field helper
export const required = (fieldName: string) => ({
  required: `${fieldName} is required`,
});

// Min length helper
export const minLength = (length: number, fieldName: string) => ({
  minLength: {
    value: length,
    message: `${fieldName} must be at least ${length} characters`,
  },
});

// Max length helper
export const maxLength = (length: number, fieldName: string) => ({
  maxLength: {
    value: length,
    message: `${fieldName} cannot exceed ${length} characters`,
  },
});

// File size validation
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(extension);
};
