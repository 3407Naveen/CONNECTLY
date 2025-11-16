export type UserRole = 'user' | 'host' | 'admin';

export type MoodType = 'peaceful' | 'adventurous' | 'creative' | 'romantic' | 'inspiring' | 'playful';

export type MomentStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  role: UserRole;
  phone: string;
  location: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface Moment {
  id: string;
  host_id: string;
  title: string;
  description: string;
  emotional_description: string;
  mood: MoodType;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  duration_minutes: number;
  price: number;
  max_participants: number;
  images: string[];
  accessibility_features: string[];
  included_items: string[];
  status: MomentStatus;
  verified: boolean;
  created_at: string;
  updated_at: string;
  host?: Profile;
  avg_rating?: number;
  review_count?: number;
}

export interface Booking {
  id: string;
  moment_id: string;
  user_id: string;
  host_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  participants: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  special_requests: string;
  created_at: string;
  updated_at: string;
  moment?: Moment;
  user?: Profile;
  host?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  moment_id: string;
  user_id: string;
  host_id: string;
  rating: number;
  emotional_rating: number;
  comment: string;
  images: string[];
  created_at: string;
  user?: Profile;
}

export interface MemoryCapsule {
  id: string;
  booking_id: string;
  user_id: string;
  moment_id: string;
  title: string;
  description: string;
  media: string[];
  shared_with: 'private' | 'host' | 'public';
  created_at: string;
  moment?: Moment;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'message' | 'review' | 'system';
  title: string;
  content: string;
  link: string;
  read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Chat {
  id: string;
  booking_id: string;
  created_at: string;
  updated_at: string;
  booking?: Booking;
  messages?: Message[];
}
