import {
    Mentor,
    Booking,
    Review,
    AvailabilitySlot,
    MentorStats,
    MenteeStats,
    ExpertiseCategory,
    MentorDashboard,
    MenteeDashboard
} from '@/types/mentorship';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mansa-backend-1rr8.onrender.com';

interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    count?: number;
    next?: string;
    previous?: string;
}

class MentorshipApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = `${baseUrl}/api/v1/mentorship`;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                return { data: await response.text() as any };
            }

            if (!response.ok) {
                return {
                    error: data.detail || data.message || data.error || 'Request failed'
                };
            }

            if (data.results !== undefined) {
                return {
                    data: data.results,
                    count: data.count,
                    next: data.next,
                    previous: data.previous
                };
            }

            return { data };
        } catch (error) {
            console.error('Mentorship API request failed:', error);
            return { error: error instanceof Error ? error.message : 'Network error' };
        }
    }

    // Mentor Operations
    async listMentors(params?: { page?: number; expertise?: string }): Promise<ApiResponse<Mentor[]>> {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.expertise) searchParams.set('expertise', params.expertise);
        const query = searchParams.toString();
        return this.request<Mentor[]>(`/mentors/${query ? `?${query}` : ''}`);
    }

    async getMentor(id: string): Promise<ApiResponse<Mentor>> {
        return this.request<Mentor>(`/mentors/${id}/`);
    }

    async searchMentors(query: string): Promise<ApiResponse<Mentor[]>> {
        return this.request<Mentor[]>(`/mentors/search/?q=${encodeURIComponent(query)}`);
    }

    async getMentorReviews(id: string): Promise<ApiResponse<Review[]>> {
        return this.request<Review[]>(`/mentors/${id}/reviews/`);
    }

    async getMentorStats(): Promise<ApiResponse<MentorStats>> {
        return this.request<MentorStats>('/mentors/stats/');
    }

    async getMentorDashboard(): Promise<ApiResponse<MentorDashboard>> {
        return this.request<MentorDashboard>('/mentors/dashboard/');
    }

    async createProfile(data: any): Promise<ApiResponse<Mentor>> {
        return this.request<Mentor>('/mentors/create_profile/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProfile(data: any): Promise<ApiResponse<Mentor>> {
        return this.request<Mentor>('/mentors/update_my_profile/', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async uploadPhoto(id: string, file: File): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('photo', file);
        return this.request(`/mentors/${id}/upload_photo/`, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' }, // Fetch handles this automatically with FormData
        });
    }

    // Availability Operations
    async getAvailability(): Promise<ApiResponse<AvailabilitySlot[]>> {
        return this.request<AvailabilitySlot[]>('/availability/');
    }

    async createAvailability(data: Partial<AvailabilitySlot>): Promise<ApiResponse<AvailabilitySlot>> {
        return this.request<AvailabilitySlot>('/availability/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async bulkCreateAvailability(slots: Partial<AvailabilitySlot>[]): Promise<ApiResponse<any>> {
        return this.request('/availability/bulk/', {
            method: 'POST',
            body: JSON.stringify({ slots }),
        });
    }

    async clearAvailability(): Promise<ApiResponse<{ count: number }>> {
        return this.request<{ count: number }>('/availability/clear/', {
            method: 'DELETE',
        });
    }

    // Booking Operations
    async listBookings(): Promise<ApiResponse<Booking[]>> {
        return this.request<Booking[]>('/bookings/');
    }

    async createBooking(data: any): Promise<ApiResponse<Booking>> {
        return this.request<Booking>('/bookings/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async confirmBooking(id: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/confirm/`, { method: 'PATCH' });
    }

    async rejectBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/reject/`, {
            method: 'PATCH',
            body: JSON.stringify({ reason })
        });
    }

    async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/cancel/`, { method: 'PATCH' });
    }

    async completeBooking(id: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/complete/`, { method: 'PATCH' });
    }

    async rescheduleBooking(id: string, data: { session_date: string; start_time: string }): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/reschedule/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async addMeetingLink(id: string, link: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${id}/add_meeting_link/`, {
            method: 'PATCH',
            body: JSON.stringify({ meeting_link: link }),
        });
    }

    async addFeedback(id: string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> {
        return this.request<Review>(`/bookings/${id}/add_feedback/`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Mentee Operations
    async getMenteeDashboard(): Promise<ApiResponse<MenteeDashboard>> {
        return this.request<MenteeDashboard>('/mentee/dashboard/');
    }

    async getRecommendedMentors(): Promise<ApiResponse<Mentor[]>> {
        return this.request<Mentor[]>('/mentee/recommended/');
    }

    async getMenteeHistory(): Promise<ApiResponse<Booking[]>> {
        return this.request<Booking[]>('/mentee/history/');
    }

    // Metadata
    async getExpertiseCategories(): Promise<ApiResponse<ExpertiseCategory[]>> {
        return this.request<ExpertiseCategory[]>('/expertise/');
    }
}

export const mentorshipApi = new MentorshipApiClient(API_BASE_URL);
export default mentorshipApi;
