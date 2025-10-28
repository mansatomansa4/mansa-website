'use client';
import React, { useState, useEffect } from 'react';
import CountUpText from '@/components/CountUpText';

interface StatsData {
  futureProjects: number;
  expectedParticipants: number;
  countriesToImpact: number;
  launchYear: number;
}

const FutureImpactStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    futureProjects: 14,
    expectedParticipants: 90,
    countriesToImpact: 6,
    launchYear: 2025
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch if we're in the browser and have environment variables
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // Use API client to fetch members data
        const { api } = await import('@/lib/api');

        // Fetch members count for expected participants
        const { data: membersResponse, error: membersError } = await api.getPlatformMembers({ page: 1 });

        if (membersError) {
          console.warn('Could not fetch members data:', membersError);
        }

        const membersData = membersResponse?.results || [];
        const totalMembers = membersResponse?.count || 0;

        // Calculate unique countries from members data
        const uniqueCountries = membersData
          ? new Set(membersData.filter(member => member.country).map(member => member.country)).size
          : 6;

        // Update stats with real data where available
        setStats(prevStats => ({
          ...prevStats,
          expectedParticipants: Math.max(totalMembers, 90), // At least 90
          countriesToImpact: Math.max(uniqueCountries, 6), // At least 6 countries
        }));

      } catch (error) {
        console.warn('Error fetching stats:', error);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mt-16 sm:mt-20 bg-gradient-to-r from-[#3FB950]/10 to-[#33B3AE]/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Optional background image overlay */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: "url('/future-impact-vision.png')" }}
      />
      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 text-center">
          Future Impact Vision
        </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#155DFC] mb-2">
            <CountUpText target={stats.futureProjects} duration={3000} />
          </div>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Future Projects</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#155DFC] mb-2 flex items-center justify-center">
            <CountUpText target={stats.expectedParticipants} duration={3000} />
            <span className="ml-1">+</span>
          </div>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Expected Participants</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#155DFC] mb-2 flex items-center justify-center">
            <CountUpText target={stats.countriesToImpact} duration={3000} />
            <span className="ml-1">+</span>
          </div>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Countries to Impact</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#155DFC] mb-2">
            <CountUpText target={stats.launchYear} duration={2000} />
          </div>
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Launch Year</div>
        </div>
      </div>
      
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FB950]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureImpactStats;