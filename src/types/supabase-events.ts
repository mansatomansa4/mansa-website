/**
 * Supabase Database Types for Events
 * Auto-generated types for TypeScript
 */

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          category: 'networking' | 'workshop' | 'conference' | 'webinar' | 'social' | 'fundraiser' | 'other'
          date: string
          start_time: string
          end_time: string
          location: string
          is_virtual: boolean
          virtual_link: string | null
          status: 'upcoming' | 'past'
          max_attendees: number | null
          attendee_count: number
          flyer_url: string | null
          published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category?: 'networking' | 'workshop' | 'conference' | 'webinar' | 'social' | 'fundraiser' | 'other'
          date: string
          start_time: string
          end_time: string
          location: string
          is_virtual?: boolean
          virtual_link?: string | null
          status?: 'upcoming' | 'past'
          max_attendees?: number | null
          attendee_count?: number
          flyer_url?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'networking' | 'workshop' | 'conference' | 'webinar' | 'social' | 'fundraiser' | 'other'
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          is_virtual?: boolean
          virtual_link?: string | null
          status?: 'upcoming' | 'past'
          max_attendees?: number | null
          attendee_count?: number
          flyer_url?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_images: {
        Row: {
          id: string
          event_id: string
          image_url: string
          caption: string | null
          display_order: number
          uploaded_at: string
        }
        Insert: {
          id?: string
          event_id: string
          image_url: string
          caption?: string | null
          display_order?: number
          uploaded_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          image_url?: string
          caption?: string | null
          display_order?: number
          uploaded_at?: string
        }
      }
    }
    Views: {
      upcoming_events: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          date: string
          start_time: string
          end_time: string
          location: string
          is_virtual: boolean
          virtual_link: string | null
          status: string
          max_attendees: number | null
          attendee_count: number
          flyer_url: string | null
          published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          image_count: number
        }
      }
      past_events: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          date: string
          start_time: string
          end_time: string
          location: string
          is_virtual: boolean
          virtual_link: string | null
          status: string
          max_attendees: number | null
          attendee_count: number
          flyer_url: string | null
          published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          image_count: number
        }
      }
    }
    Functions: {
      auto_update_event_status: {
        Args: Record<string, never>
        Returns: void
      }
    }
  }
}
