-- EventEase Database Schema
-- This script creates the core tables for the event management platform

-- Users table (extends the auth system)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'staff', 'event_owner')) DEFAULT 'event_owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status VARCHAR(20) CHECK (status IN ('draft', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs table (for event registrations)
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_name VARCHAR(255) NOT NULL,
  attendee_email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  dietary_restrictions TEXT,
  status VARCHAR(20) CHECK (status IN ('registered', 'confirmed', 'cancelled')) DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, attendee_email)
);

-- Event categories (optional)
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) -- hex color code
);

-- Junction table for event categories (many-to-many)
CREATE TABLE IF NOT EXISTS event_category_assignments (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES event_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(attendee_email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);
