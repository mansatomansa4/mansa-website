// components/ProjectCard.tsx
import React from 'react';
import Image from 'next/image';
import { IoCalendarOutline, IoLocationOutline, IoPeopleOutline } from 'react-icons/io5';
import { Project, FutureProject } from '@/types/projects';

interface ProjectCardProps {
  project: Project | FutureProject;
  isFuture?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isFuture = false }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          {project.status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>
        
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#3FB950]/20 text-[#3FB950] rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {project.participants && (
            <div className="flex items-center">
              <IoPeopleOutline className="mr-2" />
              <span>{project.participants} participants</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center">
              <IoLocationOutline className="mr-2" />
              <span>{project.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <IoCalendarOutline className="mr-2" />
            <span>
              {isFuture 
                ? `Launch: ${(project as FutureProject).launchDate}` 
                : (project as Project).duration || (project as Project).date
              }
            </span>
          </div>
        </div>
        
        {!isFuture && (project as Project).progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{(project as Project).progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[#3FB950] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(project as Project).progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;