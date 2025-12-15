import { Project, FutureProject } from '@/types/projects'

// Supabase storage base URL for project images
const SUPABASE_STORAGE_URL = 'https://adnteftmqytcnieqmlma.supabase.co/storage/v1/object/public/project-images'

export const ongoingProjects: Project[] = [];

export const futureProjects: FutureProject[] = [
  {
    id: 1,
    title: "Mansa AI Research Initiative",
    description: "Research program developing AI solutions for African-specific challenges in agriculture, healthcare, and education.",
    status: "Concept",
    location: "Multi-country",
    launch_date: "Q3 2025",
    image_url: `${SUPABASE_STORAGE_URL}/ai.jpeg`,
    tags: ["AI", "Research", "Innovation"],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Digital Library Network",
    description: "Creating accessible digital libraries with African literature, research, and educational resources.",
    status: "Concept",
    location: "Continental",
    launch_date: "Q2 2026",
    image_url: `${SUPABASE_STORAGE_URL}/library2.jpeg`,
    tags: ["Education", "Digital", "Literature"],
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Ghana Census Dashboard",
    description: "Interactive data visualization platform for Ghana's demographic and economic data, similar to DataUSA format.",
    status: "Planning",
    location: "Ghana",
    launch_date: "Q3 2025",
    image_url: `${SUPABASE_STORAGE_URL}/census3.jpeg`,
    tags: ["Data Visualization", "Census", "Analytics"],
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Election & Voter Registration Dashboard",
    description: "Comprehensive dashboard for tracking elections, voter registration, and democratic participation across Africa.",
    status: "Concept",
    location: "Pan-African",
    launch_date: "Q4 2025",
    image_url: `${SUPABASE_STORAGE_URL}/election2.jpeg`,
    tags: ["Democracy", "Elections", "Civic Tech"],
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Ghana Job Search Platform",
    description: "Database-driven job search platform specifically designed for students and young professionals in Ghana.",
    status: "Planning",
    location: "Ghana",
    launch_date: "Q2 2025",
    image_url: `${SUPABASE_STORAGE_URL}/job2.jpeg`,
    tags: ["Employment", "Students", "Career"],
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "Groundwater Resources Mapping",
    description: "GIS-based platform mapping groundwater sources and water resources across Ghana for sustainable management.",
    status: "Planning",
    location: "Ghana",
    launch_date: "Q3 2025",
    image_url: `${SUPABASE_STORAGE_URL}/mapping.jpeg`,
    tags: ["Water Resources", "GIS", "Environment"],
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    title: "GPS Digital Home Address System",
    description: "GPS-enabled digital addressing system providing precise location mapping for homes and businesses.",
    status: "Concept",
    location: "Ghana",
    launch_date: "Q4 2025",
    image_url: `${SUPABASE_STORAGE_URL}/map.jpeg`,
    tags: ["GPS", "Addressing", "Urban Planning"],
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    title: "Mobility Trends Analytics",
    description: "Platform analyzing transportation and mobility patterns to improve urban planning and traffic management.",
    status: "Planning",
    location: "Major African Cities",
    launch_date: "Q2 2026",
    image_url: `${SUPABASE_STORAGE_URL}/mobility.jpg`,
    tags: ["Mobility", "Analytics", "Urban Planning"],
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    title: "Local Vendor & Artisan Directory",
    description: "Comprehensive digital directory connecting local vendors, artisans, and small businesses with customers.",
    status: "Concept",
    location: "Ghana",
    launch_date: "Q1 2025",
    image_url: `${SUPABASE_STORAGE_URL}/vendors.jpg`,
    tags: ["Local Business", "Directory", "Commerce"],
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    title: "Disease Trends Monitoring System",
    description: "Public health platform tracking and analyzing disease patterns and health trends across communities.",
    status: "Planning",
    location: "Ghana",
    launch_date: "Q3 2025",
    image_url: `${SUPABASE_STORAGE_URL}/disease.jpeg`,
    tags: ["Health", "Disease Monitoring", "Public Health"],
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    title: "Drug Authentication & Safety App",
    description: "QR code and image recognition app for verifying drug authenticity and providing medication information to combat fake drugs.",
    status: "Concept",
    location: "Ghana",
    launch_date: "Q4 2025",
    image_url: `${SUPABASE_STORAGE_URL}/drugs.jpg`,
    tags: ["Healthcare", "Drug Safety", "QR Scanner"],
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    title: "Digital History Map of Africa",
    description: "Timeline-based interactive map showcasing African kingdoms, migrations, colonialism, and independence movements.",
    status: "Planning",
    location: "Continental",
    launch_date: "Q2 2026",
    image_url: `${SUPABASE_STORAGE_URL}/africa.jpeg`,
    tags: ["History", "Education", "Cultural Heritage"],
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    title: "The Mansa Archives",
    description: "Community-driven digital knowledge repository for academic resources, research papers, and professional materials.",
    status: "Concept",
    location: "Global",
    launch_date: "Q1 2026",
    image_url: `${SUPABASE_STORAGE_URL}/archive.jpeg`,
    tags: ["Knowledge Sharing", "Academic", "Community"],
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    title: "Smart Security & Access Control System",
    description: "IoT and computer vision-powered security system for enhanced monitoring and access control in organizations.",
    status: "Planning",
    location: "Ghana",
    launch_date: "Q3 2025",
    image_url: `${SUPABASE_STORAGE_URL}/SECURITY.jpeg`,
    tags: ["IoT", "Computer Vision", "Security"],
    created_at: new Date().toISOString()
  }
]