// API Client for Mansa Platform - Supabase Integration
// This client connects to Supabase to fetch real-time project data

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adnteftmqytcnieqmlma.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbnRlZnRtcXl0Y25pZXFtbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM0NTUsImV4cCI6MjA2ODY2OTQ1NX0.w4oLhu7sVeMvXGbr0oX1MtWk3CEdS97Saonwz7WENrw';

interface ApiResponse<T = any> {
  data?: T;
  error?: string | null;
  message?: string;
}

interface SupabaseProject {
  id: number;
  title: string;
  description: string | null;
  project_type: string | null;
  status: string | null;
  location: string | null;
  launch_date: string | null;
  max_participants: number | null;
  participants_count: number | null;
  tags: any;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  launchDate: string;
  location: string;
  maxParticipants?: number;
  currentParticipants?: number;
  tags?: string[];
  category?: string;
}

class ApiClient {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.supabaseUrl = SUPABASE_URL;
    this.supabaseKey = SUPABASE_ANON_KEY;
  }

  private getStorageUrl(imagePath: string | null): string {
    if (!imagePath) return '/images/default-project.jpg';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Construct full Supabase storage URL
    // Format: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket-name>/<file-path>
    return `${this.supabaseUrl}/storage/v1/object/public/project-images/${imagePath}`;
  }

  private async supabaseRequest<T>(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      let url = `${this.supabaseUrl}/rest/v1/${table}`;
      const headers = {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };

      const params = new URLSearchParams();
      
      if (options.select) {
        params.append('select', options.select);
      } else {
        params.append('select', '*');
      }

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          params.append(key, `eq.${value}`);
        });
      }

      if (options.order) {
        params.append('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
      }

      if (options.limit) {
        params.append('limit', options.limit.toString());
      }

      url += `?${params.toString()}`;

      console.log('Fetching from Supabase:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store' // Ensure fresh data
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase API error:', errorText);
        return { error: `API request failed: ${response.status}` };
      }

      const data = await response.json();
      console.log('Supabase data fetched:', data);

      return { data };
    } catch (error) {
      console.error('Supabase request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private transformProject(supabaseProject: SupabaseProject): Project {
    return {
      id: supabaseProject.id,
      title: supabaseProject.title,
      description: supabaseProject.description || 'No description available',
      image: this.getStorageUrl(supabaseProject.image_url),
      status: supabaseProject.status || 'planning',
      launchDate: supabaseProject.launch_date || 'TBA',
      location: supabaseProject.location || 'Remote',
      maxParticipants: supabaseProject.max_participants || undefined,
      currentParticipants: supabaseProject.participants_count || 0,
      tags: this.parseTags(supabaseProject.tags),
      category: supabaseProject.project_type || 'future'
    };
  }

  private parseTags(tags: any): string[] {
    if (Array.isArray(tags)) {
      return tags;
    }
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Get all future projects
   */
  async getFutureProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.supabaseRequest<SupabaseProject[]>('projects', {
      filters: { project_type: 'future' },
      order: { column: 'created_at', ascending: false }
    });

    if (response.error) {
      return { error: response.error };
    }

    const projects = (response.data || []).map(p => this.transformProject(p));
    return { data: projects };
  }

  /**
   * Get all ongoing projects
   */
  async getOngoingProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.supabaseRequest<SupabaseProject[]>('projects', {
      filters: { project_type: 'ongoing' },
      order: { column: 'created_at', ascending: false }
    });

    if (response.error) {
      return { error: response.error };
    }

    const projects = (response.data || []).map(p => this.transformProject(p));
    return { data: projects };
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<ApiResponse<{ future: Project[]; ongoing: Project[] }>> {
    const [futureResponse, ongoingResponse] = await Promise.all([
      this.getFutureProjects(),
      this.getOngoingProjects()
    ]);

    if (futureResponse.error || ongoingResponse.error) {
      return { error: futureResponse.error || ongoingResponse.error };
    }

    return {
      data: {
        future: futureResponse.data || [],
        ongoing: ongoingResponse.data || []
      }
    };
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<ApiResponse<Project>> {
    const response = await this.supabaseRequest<SupabaseProject[]>('projects', {
      filters: { id }
    });

    if (response.error) {
      return { error: response.error };
    }

    if (!response.data || response.data.length === 0) {
      return { error: 'Project not found' };
    }

    const project = this.transformProject(response.data[0]);
    return { data: project };
  }

  /**
   * Verify member email exists
   */
  async verifyMemberEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const response = await this.supabaseRequest<any[]>('community_members', {
        filters: { email: email.toLowerCase() },
        limit: 1
      });

      if (response.error) {
        return { error: response.error };
      }

      const exists = !!(response.data && response.data.length > 0);
      return { data: { exists } };
    } catch (error) {
      console.error('Error verifying member:', error);
      return { error: 'Failed to verify membership' };
    }
  }

  /**
   * Check existing application
   */
  async checkExistingApplication(projectId: number, email: string): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      const url = `${this.supabaseUrl}/rest/v1/project_applications?project_id=eq.${projectId}&applicant_email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return { error: 'Failed to check application' };
      }

      const data = await response.json();
      const exists = !!(data && data.length > 0);

      return { data: { exists } };
    } catch (error) {
      console.error('Error checking application:', error);
      return { error: 'Failed to check application' };
    }
  }

  /**
   * Submit project application
   */
  async submitProjectApplication(applicationData: {
    project_id: number;
    applicant_name: string;
    applicant_email: string;
    skills?: string;
    motivation?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const url = `${this.supabaseUrl}/rest/v1/rpc/submit_project_application`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          p_project_id: applicationData.project_id,
          p_applicant_name: applicationData.applicant_name,
          p_applicant_email: applicationData.applicant_email.toLowerCase(),
          p_skills: applicationData.skills || null,
          p_motivation: applicationData.motivation || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Application submission error:', data);
        return { error: data.message || 'Failed to submit application' };
      }

      // Check if the stored procedure returned an error
      if (data && data[0]?.success === false) {
        return { error: data[0].message || 'Failed to submit application' };
      }

      return { data, message: 'Application submitted successfully!' };
    } catch (error) {
      console.error('Error submitting application:', error);
      return { error: 'Failed to submit application' };
    }
  }

  /**
   * Fetch events from Supabase
   */
  async getEvents(status?: 'upcoming' | 'past'): Promise<ApiResponse<any[]>> {
    try {
      let url = `${this.supabaseUrl}/rest/v1/events?select=*&published=eq.true&order=date.asc`;
      
      if (status) {
        url += `&status=eq.${status}`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch events:', errorText);
        return { error: 'Failed to fetch events' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { error: 'Failed to fetch events' };
    }
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
