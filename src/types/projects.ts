// types/projects.ts

export type Project = {
  id: number;
  title: string;
  description: string;
  date?: string;
  status?: string;
  participants?: string;
  location: string;
  duration?: string;
  launchDate?: string;
  imageUrl?: string;
  tags?: string[];
  progress?: number;
};

export type FutureProject = {
  id: number;
  title: string;
  description: string;
  status: string;
  participants: string;
  location: string;
  launchDate: string;
  imageUrl: string;
  tags: string[];
};