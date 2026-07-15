export {
  default as api,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
} from "./api";

export { default as authService } from "./authService";

export { default as projectService } from "./projectService";

export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./authService";

export type {
  Project,
  CreateProjectData,
  FilterOptions,
} from "./projectService";