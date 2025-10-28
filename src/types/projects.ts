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
  description: string;

  // Required metadata from meeting
  objectives: string[];
  expected_deliverables: string[];
  focal_person: string;
  focal_person_email?: string;

  // Classification
  domains: ProjectDomain[]; // Tags for grouping (CyberSecurity, AI, ML, BIOTECH, etc)
  priority: ProjectPriority; // Priority based on resources available
  status: ProjectStatus;

  // Resources
  resources: ProjectResource[]; // Human skills, platforms, devices, timeline
  skills_required: string[]; // Specific skills needed

  // Timeline
  start_date?: string;
  end_date?: string;
  launch_date?: string;
  duration?: string;

  // Additional info
  location: string;
  participants?: string;
  max_participants?: number;
  current_participants?: number;
  image_url?: string;
  progress?: number;

  // Timestamps
  created_at: string;
  updated_at?: string;
}

export type FutureProject = Project;