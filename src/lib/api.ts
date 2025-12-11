// API Client for Django Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mansa-backend-1rr8.onrender.com/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  detail?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      console.log('Making API request to:', url);
      
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit',
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return { error: 'Server returned invalid response' };
      }

      if (!response.ok) {
        console.error('API error response:', data);
        return { 
          error: data.detail || data.message || data.error || JSON.stringify(data) || 'Request failed',
          detail: data.detail 
        };
      }

      console.log('API request successful:', data);
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return { 
          error: 'Unable to connect to server. Please check if the backend is running or try again later.' 
        };
      }
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Project methods
  async getProjects(params?: {
    page?: number;
    search?: string;
    status?: string;
    approval_status?: string;
  }): Promise<ApiResponse<PaginatedResponse<Project>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.approval_status) searchParams.set('approval_status', params.approval_status);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Project>>(`/projects/${query ? `?${query}` : ''}`);
  }

  async getProject(id: number): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}/`);
  }

  async applyToProject(projectId: number, applicationData: {
    user?: number;
    application_data: any;
  }): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}/apply/`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Platform data methods (for existing Supabase data)
  async getPlatformProjects(params?: {
    page?: number;
    search?: string;
    status?: string;
    project_type?: string;
    domain?: string;
    priority?: string;
  }): Promise<ApiResponse<PaginatedResponse<PlatformProject>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.project_type) searchParams.set('project_type', params.project_type);
    if (params?.domain) searchParams.set('domain', params.domain);
    if (params?.priority) searchParams.set('priority', params.priority);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<PlatformProject>>(`/platform/projects/${query ? `?${query}` : ''}`);
  }

  async getPlatformProject(id: number): Promise<ApiResponse<PlatformProject>> {
    return this.request<PlatformProject>(`/platform/projects/${id}/`);
  }

  async getPlatformMembers(params?: {
    page?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Member>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<PaginatedResponse<Member>>(`/platform/members/${query ? `?${query}` : ''}`);
  }

  async submitMemberApplication(memberData: any): Promise<ApiResponse<any>> {
    return this.request('/platform/members/', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async submitProjectApplication(applicationData: {
    project_id: number;
    applicant_name: string;
    applicant_email: string;
    skills?: string;
    motivation?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/platform/applications/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Member verification (check if email exists in community)
  async verifyMemberEmail(email: string): Promise<ApiResponse<{ exists: boolean; member?: Member }>> {
    return this.request(`/platform/members/verify/?email=${encodeURIComponent(email)}`);
  }

  // Check existing application
  async checkExistingApplication(projectId: number, email: string): Promise<ApiResponse<{ exists: boolean; application?: any }>> {
    return this.request(`/platform/applications/check/?project_id=${projectId}&email=${encodeURIComponent(email)}`);
  }
}

// Type definitions
export interface Project {
  id: number;
  title: string;
  description?: string;
  detailed_description?: string;
  image?: string;
  admission_start_date?: string;
  admission_end_date?: string;
  status?: string;
  approval_status?: string;
  created_by?: number;
  approved_by?: number;
  max_participants?: number;
  current_participants?: number;
  created_at: string;
  updated_at?: string;
}

export interface PlatformProject {
  id: number;
  title: string;
  description?: string;

  // Required metadata
  objectives?: string[];
  expected_deliverables?: string[];
  focal_person?: string;
  focal_person_email?: string;

  // Classification
  domains?: string[];
  priority?: 'high' | 'medium' | 'low';
  status?: string;

  // Resources
  resources?: Array<{
    type: string;
    name: string;
    description?: string;
    required: boolean;
    available: boolean;
  }>;
  skills_required?: string[];

  // Timeline
  start_date?: string;
  end_date?: string;
  launch_date?: string;
  duration?: string;

  // Additional info
  location?: string;
  max_participants?: number;
  current_participants?: number;
  image_url?: string;
  progress?: number;

  // Legacy fields for compatibility
  project_type?: string;
  tags?: string[];
  participants_count?: number;
  member_id?: string;

  // Timestamps
  created_at: string;
  updated_at?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  linkedin?: string;
  experience?: string;
  areaOfExpertise?: string;
  school?: string;
  level?: string;
  occupation?: string;
  jobtitle?: string;
  industry?: string;
  major?: string;
  gender?: string;
  membershiptype?: string;
  skills?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);
export default api;