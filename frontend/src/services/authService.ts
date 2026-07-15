import api, {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from "./api";
import axios from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "faculty";
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "faculty";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface Faculty {
  id: number;
  name: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);

      const response = await api.post<AuthResponse>(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setAuthToken(response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail ||
            "Invalid email or password."
        );
      }

      throw new Error("Unable to login.");
    }
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>(
        "/auth/register",
        data
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail ||
            "Registration failed."
        );
      }

      throw new Error("Unable to register.");
    }
  }

  async getFacultyList(): Promise<Faculty[]> {
    try {
      const response = await api.get<Faculty[]>(
        "/auth/faculty"
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail ??
          "Failed to load faculty list."
        );
      }

      throw new Error("Unable to load faculty list.");
    }
  }

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/me");

    localStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );

    return response.data;
  }

  async updateProfile(
    data: UpdateProfileData
  ) {
    const response = await api.put(
      "/auth/profile",
      data
    );

    return response.data;
  }

  async changePassword(
    data: ChangePasswordData
  ) {
    const response = await api.put(
      "/auth/change-password",
      data
    );

    return response.data;
  }

  logout(): void {
    removeAuthToken();
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!getAuthToken();
  }
}

export default new AuthService();