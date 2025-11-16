/*
  # CONNECTLY Platform Database Schema

  ## Overview
  Complete database schema for CONNECTLY - an emotional micro-experiences booking platform.

  ## New Tables

  ### 1. profiles
  Extended user profiles with role management
  - `id` (uuid, FK to auth.users)
  - `email` (text)
  - `full_name` (text)
  - `avatar_url` (text)
  - `bio` (text)
  - `role` (text: 'user', 'host', 'admin')
  - `phone` (text)
  - `location` (text)
  - `language_preference` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. moments
  Core experiences/moments offered by hosts
  - `id` (uuid, PK)
  - `host_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `emotional_description` (text)
  - `mood` (text: 'peaceful', 'adventurous', 'creative', 'romantic', 'inspiring', 'playful')
  - `category` (text)
  - `location` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `duration_minutes` (integer)
  - `price` (numeric)
  - `max_participants` (integer)
  - `images` (jsonb array of image URLs)
  - `accessibility_features` (text array)
  - `included_items` (text array)
  - `status` (text: 'pending', 'approved', 'rejected', 'archived')
  - `verified` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. moment_availability
  Scheduling for moments
  - `id` (uuid, PK)
  - `moment_id` (uuid, FK to moments)
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `available_spots` (integer)
  - `is_available` (boolean)

  ### 4. bookings
  User bookings for moments
  - `id` (uuid, PK)
  - `moment_id` (uuid, FK to moments)
  - `user_id` (uuid, FK to profiles)
  - `host_id` (uuid, FK to profiles)
  - `booking_date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `participants` (integer)
  - `total_price` (numeric)
  - `status` (text: 'pending', 'confirmed', 'completed', 'cancelled', 'disputed')
  - `payment_status` (text: 'pending', 'paid', 'refunded')
  - `special_requests` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. reviews
  Reviews and ratings for completed moments
  - `id` (uuid, PK)
  - `booking_id` (uuid, FK to bookings)
  - `moment_id` (uuid, FK to moments)
  - `user_id` (uuid, FK to profiles)
  - `host_id` (uuid, FK to profiles)
  - `rating` (integer 1-5)
  - `emotional_rating` (integer 1-5)
  - `comment` (text)
  - `images` (jsonb array)
  - `created_at` (timestamptz)

  ### 6. saved_moments
  User's saved/favorited moments
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `moment_id` (uuid, FK to moments)
  - `created_at` (timestamptz)

  ### 7. memory_capsules
  Digital memory keepsakes from experiences
  - `id` (uuid, PK)
  - `booking_id` (uuid, FK to bookings)
  - `user_id` (uuid, FK to profiles)
  - `moment_id` (uuid, FK to moments)
  - `title` (text)
  - `description` (text)
  - `media` (jsonb array of photos/videos)
  - `shared_with` (text: 'private', 'host', 'public')
  - `created_at` (timestamptz)

  ### 8. chats
  Chat conversations between users and hosts
  - `id` (uuid, PK)
  - `booking_id` (uuid, FK to bookings)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. messages
  Individual chat messages
  - `id` (uuid, PK)
  - `chat_id` (uuid, FK to chats)
  - `sender_id` (uuid, FK to profiles)
  - `content` (text)
  - `read` (boolean)
  - `created_at` (timestamptz)

  ### 10. notifications
  User notifications
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `type` (text: 'booking', 'message', 'review', 'system')
  - `title` (text)
  - `content` (text)
  - `link` (text)
  - `read` (boolean)
  - `created_at` (timestamptz)

  ### 11. host_earnings
  Track host earnings and payouts
  - `id` (uuid, PK)
  - `host_id` (uuid, FK to profiles)
  - `booking_id` (uuid, FK to bookings)
  - `amount` (numeric)
  - `platform_fee` (numeric)
  - `net_amount` (numeric)
  - `payout_status` (text: 'pending', 'processing', 'paid')
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Special policies for hosts to manage their moments
  - Admin-only policies for sensitive operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  role text DEFAULT 'user' CHECK (role IN ('user', 'host', 'admin')),
  phone text DEFAULT '',
  location text DEFAULT '',
  language_preference text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create moments table
CREATE TABLE IF NOT EXISTS moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  emotional_description text DEFAULT '',
  mood text DEFAULT 'peaceful' CHECK (mood IN ('peaceful', 'adventurous', 'creative', 'romantic', 'inspiring', 'playful')),
  category text DEFAULT '',
  location text DEFAULT '',
  latitude numeric,
  longitude numeric,
  duration_minutes integer DEFAULT 60,
  price numeric DEFAULT 0,
  max_participants integer DEFAULT 1,
  images jsonb DEFAULT '[]'::jsonb,
  accessibility_features text[] DEFAULT ARRAY[]::text[],
  included_items text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create moment_availability table
CREATE TABLE IF NOT EXISTS moment_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id uuid REFERENCES moments(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  available_spots integer DEFAULT 1,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id uuid REFERENCES moments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  participants integer DEFAULT 1,
  total_price numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'disputed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  special_requests text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  moment_id uuid REFERENCES moments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  emotional_rating integer NOT NULL CHECK (emotional_rating >= 1 AND emotional_rating <= 5),
  comment text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create saved_moments table
CREATE TABLE IF NOT EXISTS saved_moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  moment_id uuid REFERENCES moments(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, moment_id)
);

-- Create memory_capsules table
CREATE TABLE IF NOT EXISTS memory_capsules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  moment_id uuid REFERENCES moments(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  media jsonb DEFAULT '[]'::jsonb,
  shared_with text DEFAULT 'private' CHECK (shared_with IN ('private', 'host', 'public')),
  created_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text DEFAULT 'system' CHECK (type IN ('booking', 'message', 'review', 'system')),
  title text NOT NULL,
  content text DEFAULT '',
  link text DEFAULT '',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create host_earnings table
CREATE TABLE IF NOT EXISTS host_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount numeric DEFAULT 0,
  platform_fee numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_earnings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Moments policies
CREATE POLICY "Approved moments are viewable by everyone"
  ON moments FOR SELECT
  TO authenticated
  USING (status = 'approved' OR host_id = auth.uid());

CREATE POLICY "Hosts can insert their moments"
  ON moments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their moments"
  ON moments FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their moments"
  ON moments FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- Moment availability policies
CREATE POLICY "Availability viewable for approved moments"
  ON moment_availability FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM moments
      WHERE moments.id = moment_availability.moment_id
      AND (moments.status = 'approved' OR moments.host_id = auth.uid())
    )
  );

CREATE POLICY "Hosts can manage their moment availability"
  ON moment_availability FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM moments
      WHERE moments.id = moment_availability.moment_id
      AND moments.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM moments
      WHERE moments.id = moment_availability.moment_id
      AND moments.host_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = host_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and hosts can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = host_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = host_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their completed bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.status = 'completed'
    )
  );

-- Saved moments policies
CREATE POLICY "Users can view their saved moments"
  ON saved_moments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save moments"
  ON saved_moments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave moments"
  ON saved_moments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Memory capsules policies
CREATE POLICY "Users can view their memory capsules"
  ON memory_capsules FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (shared_with = 'host' AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = memory_capsules.booking_id
      AND bookings.host_id = auth.uid()
    )) OR
    shared_with = 'public'
  );

CREATE POLICY "Users can create memory capsules"
  ON memory_capsules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their memory capsules"
  ON memory_capsules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Chats policies
CREATE POLICY "Users can view their chats"
  ON chats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = chats.booking_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

CREATE POLICY "Users can create chats for their bookings"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

-- Messages policies
CREATE POLICY "Chat participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      JOIN bookings ON bookings.id = chats.booking_id
      WHERE chats.id = messages.chat_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

CREATE POLICY "Chat participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chats
      JOIN bookings ON bookings.id = chats.booking_id
      WHERE chats.id = chat_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

CREATE POLICY "Users can mark their messages as read"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      JOIN bookings ON bookings.id = chats.booking_id
      WHERE chats.id = messages.chat_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      JOIN bookings ON bookings.id = chats.booking_id
      WHERE chats.id = messages.chat_id
      AND (bookings.user_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Host earnings policies
CREATE POLICY "Hosts can view their earnings"
  ON host_earnings FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moments_host_id ON moments(host_id);
CREATE INDEX IF NOT EXISTS idx_moments_status ON moments(status);
CREATE INDEX IF NOT EXISTS idx_moments_mood ON moments(mood);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_moment_id ON bookings(moment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_moment_id ON reviews(moment_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
