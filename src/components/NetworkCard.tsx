'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

type NetworkCardProps = {
  text: string;
  imageUrl: string;
};

export default function NetworkCard({ text, imageUrl }: NetworkCardProps) {


  return (
    <div className="dark:bg-[#151B23] bg-white dark:text-white text-black rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row min-h-[280px]">
      {/* Text Section */}
      <div className="flex flex-col justify-center items-start p-6 md:w-1/2">
        <p className="text-xs sm:text-base leading-relaxed mb-6">
          {text}
        </p>
        <Link href="/signup">
          <button className="flex items-center gap-2 text-white hover:text-green-500 transition">
            <FaArrowRight />
          </button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto">
        <Image
          src={imageUrl}
          alt="Global Network"
          fill
          className="rounded-r-lg object-cover"
        />
      </div>
    </div>
  );
}