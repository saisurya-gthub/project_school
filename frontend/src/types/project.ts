export interface Project {
  id: number;

  title: string;
  abstract: string;

  department: string;
  year: number;

  technologies: string;

  github_link?: string;

  status: "Pending" | "Approved" | "Rejected";

  guide_id: number;
  guide_name: string;

  student_name: string;
}