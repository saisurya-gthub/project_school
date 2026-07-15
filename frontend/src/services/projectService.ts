import api from "./api";

export interface Project {

    id:number;

    title:string;

    abstract:string;

    department:string;

    year:number;

    technologies:string;

    github_link?:string;

    status:string;

    guide_id:number;

    guide_name:string;

    student_name:string;
}

export interface CreateProjectData {
  title: string;
  abstract: string;
  department: string;
  year: number;
  guide_id : number;
  technologies: string;
  github_link?: string;
}

export interface FilterOptions {
  departments: string[];
  years: number[];
  guides: string[];
  technologies: string[];
}

const projectService = {

  // Upload Project
  createProject: async (data: CreateProjectData) => {
    const response = await api.post(
      "/projects/upload",
      data
    );

    return response.data;
  },

  // My Projects
  getMyProjects: async (): Promise<any[]> => {
    const response = await api.get<any[]>(
      "/projects/all-my-projects"
    );

    return response.data;
  },

  //get all projects
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>(
      "/projects/all"
    );

    return response.data;
  },

  // Browse Approved Projects
  browseProjects: async (filters?: {
    department?: string;
    year?: number;
    guide?: string;
    technology?: string;
  }) => {

    const response = await api.get(
      "/projects/browse",
      {
        params: filters
      }
    );

    return response.data;
  },

  // Project By ID
  getProject: async (id: number) => {

    const response = await api.get(
      `/projects/${id}`
    );

    return response.data;
  },

  // Edit
  editProject: async (
    id: number,
    data: CreateProjectData
  ) => {

    const response = await api.put(
      `/projects/edit/${id}`,
      data
    );

    return response.data;
  },

  // Delete
  deleteProject: async (id: number) => {

    const response = await api.delete(
      `/projects/delete/${id}`
    );

    return response.data;
  },

  // Faculty Approval
  updateStatus: async (
    id: number,
    status: "Pending" | "Approved" | "Rejected"
  ) => {

    const response = await api.put(
      `/projects/${id}/status`,
      {
        status
      }
    );

    return response.data;
  },

  // Upload Report
  uploadReport: async (
    id: number,
    file: File
  ) => {

    const formData = new FormData();

    formData.append(
      "report",
      file
    );

    const response = await api.post(
      `/projects/upload-report/${id}`,
      formData
    );

    return response.data;
  },

  // Download Report
  downloadReport: (
    id: number
  ) => {

    window.open(
      `${api.defaults.baseURL}/projects/download-report/${id}`,
    "_blank"
    );
  },

  // Filters
  getFilterOptions: async () => {

    const response = await api.get(
      "/projects/filter-options"
    );

    return response.data;
  },

  //review project
  getReviewQueue: async (): Promise<Project[]> => {

    const response =
        await api.get<Project[]>(
            "/projects/review"
        );

    return response.data;

  },

};

export default projectService;


