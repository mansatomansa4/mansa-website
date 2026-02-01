-- Event Registrations Table Schema
-- This table stores all event registrations from users

CREATE TABLE public.event_registrations (
  -- Primary key
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- Foreign key to events table
  event_id uuid NOT NULL,

  -- Registrant information
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,

  -- Student information
  is_student boolean NOT NULL DEFAULT false,
  institution_name text,

  -- Community membership
  is_member boolean NOT NULL DEFAULT false,

  -- Optional: Link to members table if they are a member
  member_id uuid,

  -- Registration status
  status text NOT NULL DEFAULT 'confirmed'::text
    CHECK (status = ANY (ARRAY[
      'confirmed'::text,
      'cancelled'::text,
      'attended'::text,
      'no_show'::text
    ])),

  -- Cancellation tracking
  cancelled_at timestamp with time zone,
  cancelled_by uuid,
  cancellation_reason text,

  -- Email tracking
  confirmation_email_sent boolean DEFAULT false,
  confirmation_email_sent_at timestamp with time zone,
  reminder_email_sent boolean DEFAULT false,
  reminder_email_sent_at timestamp with time zone,

  -- Timestamps
  registered_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Metadata for additional information
  metadata jsonb DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_registrations_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL,

  -- Prevent duplicate registrations from same email for same event
  CONSTRAINT event_registrations_unique_email_per_event
    UNIQUE (event_id, email),

  -- Institution name required if is_student is true
  CONSTRAINT event_registrations_institution_required
    CHECK (
      (is_student = false AND institution_name IS NULL) OR
      (is_student = true AND institution_name IS NOT NULL)
    )
);

-- Indexes for better query performance
CREATE INDEX idx_event_registrations_event_id
  ON public.event_registrations(event_id);

CREATE INDEX idx_event_registrations_email
  ON public.event_registrations(email);

CREATE INDEX idx_event_registrations_status
  ON public.event_registrations(status);

CREATE INDEX idx_event_registrations_registered_at
  ON public.event_registrations(registered_at DESC);

CREATE INDEX idx_event_registrations_member_id
  ON public.event_registrations(member_id)
  WHERE member_id IS NOT NULL;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_registrations_updated_at_trigger
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registrations_updated_at();

-- Trigger to update event attendee_count when registration is created
CREATE OR REPLACE FUNCTION increment_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    UPDATE public.events
    SET attendee_count = attendee_count + 1
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_registration_created_trigger
  AFTER INSERT ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION increment_event_attendee_count();

-- Trigger to update event attendee_count when registration status changes
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed from confirmed to something else, decrement
  IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
    UPDATE public.events
    SET attendee_count = attendee_count - 1
    WHERE id = NEW.event_id;
  END IF;

  -- If status changed to confirmed from something else, increment
  IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
    UPDATE public.events
    SET attendee_count = attendee_count + 1
    WHERE id = NEW.event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_registration_status_changed_trigger
  AFTER UPDATE ON public.event_registrations
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_event_attendee_count();

-- Comments for documentation
COMMENT ON TABLE public.event_registrations IS 'Stores user registrations for community events';
COMMENT ON COLUMN public.event_registrations.event_id IS 'Reference to the event being registered for';
COMMENT ON COLUMN public.event_registrations.full_name IS 'Full name of the registrant';
COMMENT ON COLUMN public.event_registrations.email IS 'Email address of the registrant';
COMMENT ON COLUMN public.event_registrations.phone_number IS 'Phone number of the registrant';
COMMENT ON COLUMN public.event_registrations.is_student IS 'Whether the registrant is a student';
COMMENT ON COLUMN public.event_registrations.institution_name IS 'Name of educational institution (required if is_student is true)';
COMMENT ON COLUMN public.event_registrations.is_member IS 'Whether the registrant is a Mansa-to-Mansa community member';
COMMENT ON COLUMN public.event_registrations.member_id IS 'Reference to members table if the registrant is a member';
COMMENT ON COLUMN public.event_registrations.status IS 'Registration status: confirmed, cancelled, attended, or no_show';
COMMENT ON COLUMN public.event_registrations.metadata IS 'Additional information stored as JSON';

-- Grant permissions (adjust based on your RLS policies)
-- ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for authenticated users to view their own registrations
-- CREATE POLICY "Users can view their own registrations"
--   ON public.event_registrations
--   FOR SELECT
--   USING (auth.email() = email);

-- Example RLS policy for admins to view all registrations
-- CREATE POLICY "Admins can view all registrations"
--   ON public.event_registrations
--   FOR ALL
--   USING (auth.jwt()->>'role' = 'admin');
