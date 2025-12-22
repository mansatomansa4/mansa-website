// types/projects.ts

export type ProjectPriority = 'high' | 'medium' | 'low';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold' | 'concept';
export type ProjectDomain = 'cybersecurity' | 'ai' | 'ml' | 'biotech' | 'data_science' | 'blockchain' | 'iot' | 'web_dev' | 'mobile_dev' | 'other';

export interface ProjectResource {
  type: 'human' | 'platform' | 'device' | 'timeline';
  name: string;
  description?: string;
  required: boolean;
  available: boolean;
}

export interface Project {
  // Core fields
  id: number;
  title: string;
  description?: string | null;

  // Backend fields (actual API response)
  status?: string | null;
  location?: string | null;
  launch_date?: string | null;
  image_url?: string | null;
  image?: string | null; // Transformed full URL from API
  project_type?: string | null;
  tags?: string[] | null;
  participants_count?: number | null;
  max_participants?: number | null;
  created_at: string;
  updated_at?: string | null;
  member_id?: string | null;

  // Enhanced metadata fields
  objectives?: string | null;
  deliverables?: string | null;
  focal_person_id?: string | null;
  focal_person_name?: string | null;
  focal_person_email?: string | null;
  domain_tags?: string[] | null;
  priority?: string | null;
  resources_needed?: any | null;
  human_skills_required?: string | null;
  platform_requirements?: string | null;
  devices_required?: string | null;
  timeline_start?: string | null;
  timeline_end?: string | null;
  budget_estimate?: string | null;
  current_budget?: string | null;
  is_concurrent?: boolean;
}

export type FutureProject = Project;