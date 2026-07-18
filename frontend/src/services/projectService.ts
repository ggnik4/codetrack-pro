import httpClient from '@/lib/http-client';

// Define your types based on your backend schema
export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  owner: string;
  owner_username: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type CreateProjectData = Pick<Project, 'name'> &
  Partial<Pick<Project, 'description' | 'color' | 'visibility'>>;

export type UpdateProjectData = Partial<CreateProjectData>;

export interface GetProjectsParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  visibility?: 'PRIVATE' | 'PUBLIC';
}

class ProjectService {
  private readonly BASE_URL = '/projects/projects/';

  /**
   * Retrieves a paginated list of projects
   */
  public async getProjects(
    params?: GetProjectsParams
  ): Promise<PaginatedResponse<Project>> {
    const response = await httpClient.get<PaginatedResponse<Project>>(this.BASE_URL, {
      params,
    });
    return response.data;
  }

  /**
   * Retrieves a specific project by ID
   */
  public async getProject(id: string): Promise<Project> {
    const response = await httpClient.get<Project>(`${this.BASE_URL}${id}/`);
    return response.data;
  }

  /**
   * Creates a new project
   */
  public async createProject(data: CreateProjectData): Promise<Project> {
    const response = await httpClient.post<Project>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Updates an existing project partially
   */
  public async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await httpClient.patch<Project>(`${this.BASE_URL}${id}/`, data);
    return response.data;
  }

  /**
   * Deletes a project by ID
   */
  public async deleteProject(id: string): Promise<void> {
    await httpClient.delete(`${this.BASE_URL}${id}/`);
  }
}

export const projectService = new ProjectService();
