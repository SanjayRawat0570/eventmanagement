-- Seed data for EventEase platform
-- This script populates the database with sample data for testing

-- Insert sample users (matching the mock users from auth context)
INSERT INTO users (id, name, email, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@eventease.com', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'John Organizer', 'john@eventease.com', 'organizer'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Sarah Manager', 'sarah@eventease.com', 'organizer')
ON CONFLICT (email) DO NOTHING;

-- Insert sample event categories
INSERT INTO event_categories (id, name, description, color) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Technology', 'Tech conferences, workshops, and meetups', '#3B82F6'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Business', 'Corporate events, networking, and seminars', '#10B981'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Education', 'Training sessions, workshops, and courses', '#F59E0B'),
  ('650e8400-e29b-41d4-a716-446655440004', 'Social', 'Community events, parties, and gatherings', '#EF4444')
ON CONFLICT (name) DO NOTHING;

-- Insert sample events
INSERT INTO events (id, title, description, date, time, location, capacity, status, organizer_id) VALUES
  (
    '750e8400-e29b-41d4-a716-446655440001',
    'Tech Conference 2024',
    'Annual technology conference featuring the latest innovations in AI, web development, and cloud computing.',
    '2024-03-15',
    '09:00:00',
    'Convention Center, San Francisco',
    500,
    'active',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '750e8400-e29b-41d4-a716-446655440002',
    'Product Launch Event',
    'Exclusive launch event for our new product line. Join us for demos, networking, and refreshments.',
    '2024-03-22',
    '18:00:00',
    'Grand Hotel, New York',
    200,
    'active',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '750e8400-e29b-41d4-a716-446655440003',
    'Workshop: Digital Marketing',
    'Hands-on workshop covering digital marketing strategies, SEO, and social media best practices.',
    '2024-02-28',
    '14:00:00',
    'Online Event',
    100,
    'completed',
    '550e8400-e29b-41d4-a716-446655440003'
  )
ON CONFLICT (id) DO NOTHING;

-- Assign categories to events
INSERT INTO event_category_assignments (event_id, category_id) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), -- Tech Conference -> Technology
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'), -- Product Launch -> Business
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003')  -- Digital Marketing -> Education
ON CONFLICT DO NOTHING;

-- Insert sample RSVPs
INSERT INTO rsvps (event_id, attendee_name, attendee_email, phone, status) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Alice Johnson', 'alice@example.com', '+1-555-0101', 'confirmed'),
  ('750e8400-e29b-41d4-a716-446655440001', 'Bob Smith', 'bob@example.com', '+1-555-0102', 'registered'),
  ('750e8400-e29b-41d4-a716-446655440001', 'Carol Davis', 'carol@example.com', '+1-555-0103', 'confirmed'),
  ('750e8400-e29b-41d4-a716-446655440002', 'David Wilson', 'david@example.com', '+1-555-0104', 'registered'),
  ('750e8400-e29b-41d4-a716-446655440002', 'Eva Brown', 'eva@example.com', '+1-555-0105', 'confirmed'),
  ('750e8400-e29b-41d4-a716-446655440003', 'Frank Miller', 'frank@example.com', '+1-555-0106', 'confirmed')
ON CONFLICT (event_id, attendee_email) DO NOTHING;
