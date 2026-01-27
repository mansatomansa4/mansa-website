export interface Mentor {
    id: string;
    user?: {
        first_name: string;
        last_name: string;
        email: string;
    };
    name?: string; // For compatibility
    email?: string; // For compatibility
    bio: string;
    photo_url?: string;
    profile_picture?: string; // For compatibility
    expertise: string[] | { category: string; subcategories?: string[] }[];
    areaofexpertise?: string; // For compatibility
    rating: number;
    total_sessions: number;
    company?: string;
    city?: string; // For compatibility
    location?: string; // For compatibility
    job_title?: string;
    jobtitle?: string; // For compatibility
    occupation?: string; // For compatibility
    years_of_experience?: number;
    is_approved: boolean;
    is_accepting_requests?: boolean; // For compatibility
    created_at: string;
}

export interface Mentee {
    id: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    bio?: string;
    interests?: string[];
    created_at: string;
}

export interface Booking {
    id: string;
    mentor_id: string;
    mentee_id: string;
    mentor_details?: Mentor;
    mentee_details?: Mentee;
    mentee_name?: string; // For compatibility
    mentee_photo_url?: string; // For compatibility
    session_date: string;
    scheduled_at?: string; // For compatibility
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled_by_mentee' | 'cancelled_by_mentor' | 'completed' | 'rescheduled' | 'no_show';
    meeting_link?: string;
    topic?: string;
    description?: string; // For compatibility
    notes?: string;
    rating?: number; // For compatibility
    feedback?: string; // For compatibility
    booking_version?: number; // For compatibility
    created_at: string;
    updated_at: string;
    cancellation_reason?: string;
}

export interface Review {
    id: string;
    booking_id: string;
    mentor_id: string;
    mentee_id: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface AvailabilitySlot {
    id: string;
    mentor_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    date?: string;
}

export interface MentorStats {
    total_sessions: number;
    completed_sessions: number; // For compatibility
    pending_requests: number; // For compatibility
    average_rating: number;
    total_mentees: number;
    completion_rate: number;
    response_rate: number; // For compatibility
    upcoming_sessions_count: number;
    total_reviews: number; // For compatibility
}

export interface MenteeStats {
    total_sessions: number;
    total_mentors: number;
    upcoming_sessions_count: number;
}

export interface ExpertiseCategory {
    id: string;
    name: string;
    description: string;
    icon?: string;
    color?: string; // For compatibility
}

export interface MentorDashboard {
    stats: MentorStats;
    upcoming_sessions: Booking[];
    recent_reviews: Review[];
}

export interface MenteeDashboard {
    stats: MenteeStats;
    upcoming_sessions: Booking[];
    recommended_mentors: Mentor[];
}
