-- Migration: Seed projects table with existing data
-- Created: 2025-01-02
-- Description: Migrate hardcoded projects to database

INSERT INTO projects (
  title,
  description,
  objectives,
  expected_deliverables,
  focal_person,
  focal_person_email,
  domains,
  priority,
  status,
  skills_required,
  resources,
  location,
  launch_date,
  image_url,
  max_participants
) VALUES
  -- Project 1: Mansa AI Research Initiative
  (
    'Mansa AI Research Initiative',
    'Research program developing AI solutions for African-specific challenges in agriculture, healthcare, and education.',
    '["Develop AI solutions for African agriculture challenges", "Create healthcare AI applications", "Build educational AI tools", "Establish research partnerships"]'::jsonb,
    '["AI models for crop disease detection", "Healthcare diagnostic AI system", "Educational content recommendation engine", "Published research papers"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['ai', 'ml']::project_domain[],
    'high',
    'concept',
    '["Python", "Machine Learning", "TensorFlow", "PyTorch", "Data Analysis", "Research"]'::jsonb,
    '[
      {"type": "human", "name": "AI Researchers", "required": true, "available": false},
      {"type": "human", "name": "Data Scientists", "required": true, "available": false},
      {"type": "platform", "name": "Cloud Computing (AWS/GCP)", "required": true, "available": true},
      {"type": "device", "name": "GPU Servers", "required": true, "available": false},
      {"type": "timeline", "name": "12-18 months", "required": true, "available": true}
    ]'::jsonb,
    'Multi-country',
    '2025-09-01',
    '/ai.jpeg',
    20
  ),

  -- Project 2: Digital Library Network
  (
    'Digital Library Network',
    'Creating accessible digital libraries with African literature, research, and educational resources.',
    '["Digitize African literature and research", "Create accessible online platform", "Partner with universities and libraries", "Preserve cultural heritage"]'::jsonb,
    '["Digital library platform", "10,000+ digitized resources", "University partnerships", "Mobile application"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['education', 'web_dev']::project_domain[],
    'medium',
    'concept',
    '["Web Development", "Database Design", "UI/UX Design", "Digital Archiving", "Content Management"]'::jsonb,
    '[
      {"type": "human", "name": "Web Developers", "required": true, "available": false},
      {"type": "human", "name": "Librarians", "required": true, "available": false},
      {"type": "platform", "name": "Cloud Storage", "required": true, "available": true},
      {"type": "timeline", "name": "18-24 months", "required": true, "available": true}
    ]'::jsonb,
    'Continental',
    '2026-06-01',
    '/library2.jpeg',
    15
  ),

  -- Project 3: Ghana Census Dashboard
  (
    'Ghana Census Dashboard',
    'Interactive data visualization platform for Ghana''s demographic and economic data, similar to DataUSA format.',
    '["Visualize Ghana census data", "Create interactive dashboards", "Enable data-driven policy making", "Provide public access to demographic insights"]'::jsonb,
    '["Interactive web dashboard", "Data API", "Mobile-responsive interface", "Documentation and user guides"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['data_science', 'web_dev']::project_domain[],
    'high',
    'planning',
    '["Data Visualization", "Python", "React", "D3.js", "SQL", "API Development"]'::jsonb,
    '[
      {"type": "human", "name": "Data Analysts", "required": true, "available": true},
      {"type": "human", "name": "Frontend Developers", "required": true, "available": true},
      {"type": "platform", "name": "Web Hosting", "required": true, "available": true},
      {"type": "timeline", "name": "6-9 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-09-01',
    '/census3.jpeg',
    10
  ),

  -- Project 4: Election & Voter Registration Dashboard
  (
    'Election & Voter Registration Dashboard',
    'Comprehensive dashboard for tracking elections, voter registration, and democratic participation across Africa.',
    '["Track election data across Africa", "Monitor voter registration trends", "Visualize democratic participation", "Promote electoral transparency"]'::jsonb,
    '["Real-time election dashboard", "Voter registration analytics", "Historical election data archive", "Public API for data access"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['civic_tech', 'data_science', 'web_dev']::project_domain[],
    'high',
    'concept',
    '["Data Visualization", "Web Development", "Database Management", "Political Science", "Statistics"]'::jsonb,
    '[
      {"type": "human", "name": "Civic Tech Developers", "required": true, "available": false},
      {"type": "human", "name": "Political Data Analysts", "required": true, "available": false},
      {"type": "platform", "name": "Secure Cloud Infrastructure", "required": true, "available": true},
      {"type": "timeline", "name": "12 months", "required": true, "available": true}
    ]'::jsonb,
    'Pan-African',
    '2025-12-01',
    '/election2.jpeg',
    12
  ),

  -- Project 5: Ghana Job Search Platform
  (
    'Ghana Job Search Platform',
    'Database-driven job search platform specifically designed for students and young professionals in Ghana.',
    '["Connect students with employers", "Create comprehensive job database", "Provide career resources", "Enable skills matching"]'::jsonb,
    '["Job search web platform", "Employer dashboard", "Student profiles system", "Skills assessment tools", "Mobile application"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['web_dev', 'mobile_dev']::project_domain[],
    'high',
    'planning',
    '["Full Stack Development", "Database Design", "UI/UX Design", "Mobile Development", "API Development"]'::jsonb,
    '[
      {"type": "human", "name": "Full Stack Developers", "required": true, "available": true},
      {"type": "human", "name": "UI/UX Designers", "required": true, "available": true},
      {"type": "platform", "name": "Cloud Hosting", "required": true, "available": true},
      {"type": "timeline", "name": "4-6 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-06-01',
    '/job2.jpeg',
    15
  ),

  -- Project 6: Groundwater Resources Mapping
  (
    'Groundwater Resources Mapping',
    'GIS-based platform mapping groundwater sources and water resources across Ghana for sustainable management.',
    '["Map groundwater resources in Ghana", "Create GIS database", "Enable sustainable water management", "Support policy decisions"]'::jsonb,
    '["Interactive GIS platform", "Groundwater database", "Water resource reports", "Mobile field data collection app"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['environment', 'data_science']::project_domain[],
    'medium',
    'planning',
    '["GIS", "Environmental Science", "Database Management", "Data Visualization", "Hydrology"]'::jsonb,
    '[
      {"type": "human", "name": "Hydrologists", "required": true, "available": false},
      {"type": "human", "name": "GIS Specialists", "required": true, "available": false},
      {"type": "platform", "name": "GIS Software", "required": true, "available": true},
      {"type": "timeline", "name": "9-12 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-09-01',
    '/mapping.jpeg',
    8
  ),

  -- Project 7: GPS Digital Home Address System
  (
    'GPS Digital Home Address System',
    'GPS-enabled digital addressing system providing precise location mapping for homes and businesses.',
    '["Create digital addressing system", "Map all addresses with GPS coordinates", "Enable location-based services", "Improve emergency response"]'::jsonb,
    '["Digital address database", "Web and mobile platforms", "Address verification API", "Integration with delivery services"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['web_dev', 'mobile_dev']::project_domain[],
    'medium',
    'concept',
    '["Mobile Development", "GPS/Mapping", "Backend Development", "Database Design", "API Development"]'::jsonb,
    '[
      {"type": "human", "name": "Mobile Developers", "required": true, "available": false},
      {"type": "human", "name": "GIS Developers", "required": true, "available": false},
      {"type": "platform", "name": "Mapping APIs", "required": true, "available": true},
      {"type": "timeline", "name": "12 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-12-01',
    '/map.jpeg',
    10
  ),

  -- Project 8: Mobility Trends Analytics
  (
    'Mobility Trends Analytics',
    'Platform analyzing transportation and mobility patterns to improve urban planning and traffic management.',
    '["Analyze urban mobility patterns", "Identify traffic bottlenecks", "Support urban planning decisions", "Predict transportation trends"]'::jsonb,
    '["Mobility analytics dashboard", "Traffic pattern reports", "Urban planning recommendations", "Predictive models"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['data_science', 'ai']::project_domain[],
    'medium',
    'planning',
    '["Data Analytics", "Machine Learning", "Urban Planning", "Data Visualization", "Python"]'::jsonb,
    '[
      {"type": "human", "name": "Data Scientists", "required": true, "available": false},
      {"type": "human", "name": "Urban Planners", "required": true, "available": false},
      {"type": "platform", "name": "Cloud Computing", "required": true, "available": true},
      {"type": "timeline", "name": "12-15 months", "required": true, "available": true}
    ]'::jsonb,
    'Major African Cities',
    '2026-06-01',
    '/mobility.jpg',
    12
  ),

  -- Project 9: Local Vendor & Artisan Directory
  (
    'Local Vendor & Artisan Directory',
    'Comprehensive digital directory connecting local vendors, artisans, and small businesses with customers.',
    '["Create vendor directory platform", "Connect local businesses with customers", "Support local economy", "Enable online presence for small businesses"]'::jsonb,
    '["Web and mobile directory", "Vendor registration system", "Customer review platform", "Location-based search"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['web_dev', 'mobile_dev']::project_domain[],
    'low',
    'concept',
    '["Web Development", "Mobile Development", "Database Design", "UI/UX Design"]'::jsonb,
    '[
      {"type": "human", "name": "Web Developers", "required": true, "available": false},
      {"type": "human", "name": "Mobile Developers", "required": true, "available": false},
      {"type": "platform", "name": "Web Hosting", "required": true, "available": true},
      {"type": "timeline", "name": "3-4 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-03-01',
    '/vendors.jpg',
    8
  ),

  -- Project 10: Disease Trends Monitoring System
  (
    'Disease Trends Monitoring System',
    'Public health platform tracking and analyzing disease patterns and health trends across communities.',
    '["Monitor disease patterns", "Track health trends", "Enable early disease detection", "Support public health interventions"]'::jsonb,
    '["Disease monitoring dashboard", "Trend analysis reports", "Alert system for outbreaks", "Public health API"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['health', 'data_science']::project_domain[],
    'high',
    'planning',
    '["Epidemiology", "Data Analytics", "Web Development", "Database Management", "Statistics"]'::jsonb,
    '[
      {"type": "human", "name": "Epidemiologists", "required": true, "available": false},
      {"type": "human", "name": "Data Analysts", "required": true, "available": false},
      {"type": "platform", "name": "Secure Health Data Infrastructure", "required": true, "available": true},
      {"type": "timeline", "name": "9-12 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-09-01',
    '/disease.jpeg',
    10
  ),

  -- Project 11: Drug Authentication & Safety App
  (
    'Drug Authentication & Safety App',
    'QR code and image recognition app for verifying drug authenticity and providing medication information to combat fake drugs.',
    '["Combat counterfeit drugs", "Verify drug authenticity", "Provide medication information", "Ensure patient safety"]'::jsonb,
    '["Mobile authentication app", "QR code scanning system", "Drug database", "User reporting system"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['health', 'mobile_dev', 'ai']::project_domain[],
    'high',
    'concept',
    '["Mobile Development", "Computer Vision", "Database Management", "Pharmaceutical Knowledge", "API Development"]'::jsonb,
    '[
      {"type": "human", "name": "Mobile Developers", "required": true, "available": false},
      {"type": "human", "name": "Computer Vision Engineers", "required": true, "available": false},
      {"type": "platform", "name": "Cloud Infrastructure", "required": true, "available": true},
      {"type": "timeline", "name": "8-10 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-12-01',
    '/drugs.jpg',
    12
  ),

  -- Project 12: Digital History Map of Africa
  (
    'Digital History Map of Africa',
    'Timeline-based interactive map showcasing African kingdoms, migrations, colonialism, and independence movements.',
    '["Document African history", "Create interactive historical timeline", "Preserve cultural heritage", "Enable educational use"]'::jsonb,
    '["Interactive historical map", "Timeline visualization", "Educational resources", "Mobile application"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['education', 'web_dev']::project_domain[],
    'medium',
    'planning',
    '["Web Development", "Historical Research", "Data Visualization", "UI/UX Design", "Content Writing"]'::jsonb,
    '[
      {"type": "human", "name": "Historians", "required": true, "available": false},
      {"type": "human", "name": "Web Developers", "required": true, "available": false},
      {"type": "platform", "name": "Web Hosting", "required": true, "available": true},
      {"type": "timeline", "name": "12-18 months", "required": true, "available": true}
    ]'::jsonb,
    'Continental',
    '2026-06-01',
    '/africa.jpeg',
    15
  ),

  -- Project 13: The Mansa Archives
  (
    'The Mansa Archives',
    'Community-driven digital knowledge repository for academic resources, research papers, and professional materials.',
    '["Create knowledge repository", "Enable resource sharing", "Build academic community", "Preserve research work"]'::jsonb,
    '["Digital archive platform", "Search and categorization system", "User contribution system", "Mobile access"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['education', 'web_dev']::project_domain[],
    'medium',
    'concept',
    '["Web Development", "Database Design", "Search Algorithms", "Content Management", "UI/UX Design"]'::jsonb,
    '[
      {"type": "human", "name": "Web Developers", "required": true, "available": false},
      {"type": "human", "name": "Academic Librarians", "required": true, "available": false},
      {"type": "platform", "name": "Cloud Storage", "required": true, "available": true},
      {"type": "timeline", "name": "6-9 months", "required": true, "available": true}
    ]'::jsonb,
    'Global',
    '2026-03-01',
    '/archive.jpeg',
    20
  ),

  -- Project 14: Smart Security & Access Control System
  (
    'Smart Security & Access Control System',
    'IoT and computer vision-powered security system for enhanced monitoring and access control in organizations.',
    '["Enhance organizational security", "Implement smart access control", "Enable real-time monitoring", "Reduce security incidents"]'::jsonb,
    '["IoT security system", "Computer vision monitoring", "Access control software", "Mobile management app"]'::jsonb,
    'TBD',
    NULL,
    ARRAY['iot', 'ai', 'cybersecurity']::project_domain[],
    'high',
    'planning',
    '["IoT Development", "Computer Vision", "Embedded Systems", "Mobile Development", "Cybersecurity"]'::jsonb,
    '[
      {"type": "human", "name": "IoT Engineers", "required": true, "available": false},
      {"type": "human", "name": "Computer Vision Engineers", "required": true, "available": false},
      {"type": "device", "name": "IoT Sensors and Cameras", "required": true, "available": false},
      {"type": "timeline", "name": "10-12 months", "required": true, "available": true}
    ]'::jsonb,
    'Ghana',
    '2025-09-01',
    '/SECURITY.jpeg',
    10
  );

-- Verify insertion
SELECT COUNT(*) as total_projects FROM projects;
