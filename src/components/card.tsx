import Image from 'next/image';
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  imageClassName?:string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  imageClassName='',
  children,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl duration-300 ${className}`}
    >
             {imageUrl && (
        
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={200}
            className={`${imageClassName}`}
           
            
          />
       
      )}
      <div className="p-6">
        <h2 className={`text-xl  text-gray-900 dark:text-white ${titleClassName}`}>
          {title}
        </h2>
        <p className={`text-gray-600 dark:text-gray-300 mt-2 ${descriptionClassName}`}>
          {description}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};