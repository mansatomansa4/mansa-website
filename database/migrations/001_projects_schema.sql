-- Migration: Create comprehensive projects table
-- Created: 2025-01-02
-- Description: Projects table with all required metadata from meeting requirements

CREATE TYPE project_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'on_hold', 'concept');
CREATE TYPE project_domain AS ENUM (
  'cybersecurity',
  'ai',
  'ml',
  'biotech',
  'data_science',
  'blockchain',
  'iot',
  'web_dev',
  'mobile_dev',
  'health',
  'education',
  'agriculture',
  'finance',
  'civic_tech',
  'environment',
  'other'
);

-- Main projects table
CREATE TABLE IF NOT EXISTS projects (
  -- Core identification
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,

  -- Required metadata
  objectives JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of objectives
  expected_deliverables JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of deliverables
  focal_person VARCHAR(255) NOT NULL, -- Project lead/applicant
  focal_person_email VARCHAR(255),

  -- Classification
  domains project_domain[] NOT NULL DEFAULT ARRAY[]::project_domain[], -- Tags for grouping
  priority project_priority NOT NULL DEFAULT 'medium',
  status project_status NOT NULL DEFAULT 'planning',

  -- Resources (stored as JSONB for flexibility)
  resources JSONB DEFAULT '[]'::jsonb, -- Array of resource objects
  skills_required JSONB DEFAULT '[]'::jsonb, -- Array of required skills

  -- Timeline
  start_date DATE,
  end_date DATE,
  launch_date DATE,
  duration VARCHAR(100),

  -- Additional info
  location VARCHAR(255) NOT NULL DEFAULT 'Remote',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  image_url TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- Email of creator

  -- Constraints
  CONSTRAINT valid_timeline CHECK (
    end_date IS NULL OR start_date IS NULL OR end_date >= start_date
  ),
  CONSTRAINT valid_participants CHECK (
    current_participants <= max_participants OR max_participants IS NULL
  )
);

-- Project applications table
CREATE TABLE IF NOT EXISTS project_applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  skills TEXT,
  motivation TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255),

  CONSTRAINT unique_application UNIQUE(project_id, applicant_email)
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_domains ON projects USING GIN(domains);
CREATE INDEX idx_projects_focal_person ON projects(focal_person_email);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX idx_project_applications_email ON project_applications(applicant_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data to migrate existing projects
-- INSERT INTO projects (
--   title, description, objectives, expected_deliverables,
--   focal_person, domains, priority, status, launch_date, image_url, location
-- ) VALUES ...
