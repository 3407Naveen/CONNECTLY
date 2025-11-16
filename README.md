# CONNECTLY
The CONNECTLY project was developed as part of HackHatch: The Startup Hackathon, organized by the E-Cell at Indraprastha Institute of Information Technology (IIIT) Delhi. This event took place in mid to late November 2025, with the final 24-hour on-campus sprint scheduled around November 22. The hackathon brought together selected teams to build, innovate, and pitch their startup ideas within a high-energy, entrepreneurship-driven environment. As a fully functional SaaS platform for discovering and booking micro-experiences, CONNECTLY was ideated, developed, and presented during this intense, time-bound event, demonstrating technical skill and innovative thinking under the guidance of IIIT Delhi’s entrepreneurial leadership.

> From vacations to moments

A premium SaaS platform for discovering and booking short, meaningful micro-experiences.

## Features

### Core Functionality
- **Home Page**: Hero section with tagline, featured moments, mood-based categories, trending hosts
- **Explore**: Advanced filtering by mood, price, location, duration, and accessibility
- **Moment Details**: High-quality images, emotional descriptions, host verification, pricing, availability calendar, booking CTA
- **Complete Booking Flow**: Date/time selection, participant count, special requests, payment placeholder, confirmations
- **User Dashboard**: Saved moments, booking history, messages, memory capsules, recommendations
- **Host Dashboard**: Create/manage moments, set pricing & schedules, view earnings, manage bookings
- **Admin Dashboard**: Approve/reject moments, handle disputes, quality control, analytics

### User Experience
- **Authentication**: Secure email/password signup and login with Supabase
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive Design**: Works beautifully on all devices (mobile, tablet, desktop)
- **Smooth Animations**: Tasteful transitions and micro-interactions throughout
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

### Technical Features
- **Real-time Chat**: User-to-host messaging system
- **Reviews & Ratings**: 5-star rating system with emotional ratings
- **Notifications**: System notifications for bookings, messages, and updates
- **Memory Capsules**: Digital keepsakes from completed experiences
- **Multilingual Ready**: Infrastructure for multi-language support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

The database schema is already created through migrations. All tables include:
- Row Level Security (RLS) enabled
- Proper indexes for performance
- Foreign key relationships
- Default values and constraints

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── booking/       # Booking flow components
│   ├── chat/          # Real-time chat components
│   ├── dashboard/     # Dashboard widgets
│   ├── layout/        # Header, Footer, Navigation
│   ├── moments/       # Moment cards and displays
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts (Auth, Theme)
├── hooks/             # Custom React hooks
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── lib/              # Third-party library configs
```

## User Roles

1. **User**: Can browse, save, and book moments
2. **Host**: Can create and manage moments, view bookings and earnings
3. **Admin**: Can approve moments, manage disputes, view analytics

## Getting Started

1. **Sign Up**: Create an account using email/password
2. **Explore**: Browse moments by mood, location, or price
3. **Book**: Select a moment, choose date/time, and book
4. **Experience**: Attend your booked moment
5. **Review**: Share your experience and create memory capsules

## For Hosts

1. **Become a Host**: Update your profile role to 'host'
2. **Create Moment**: Add title, description, mood, pricing, and schedule
3. **Wait for Approval**: Admin reviews and approves your moment
4. **Receive Bookings**: Users can now discover and book your moment
5. **Track Earnings**: Monitor bookings and earnings in your dashboard

## Security

- All database tables have Row Level Security enabled
- Authentication handled by Supabase Auth
- Sensitive operations require proper authorization
- User data is protected with proper RLS policies

## Design Philosophy

CONNECTLY focuses on emotional connections and meaningful experiences. The design is:
- **Warm & Minimal**: Clean layouts with soft gradients
- **Emotion-Centered**: Mood-based discovery and emotional descriptions
- **Premium Feel**: High-quality visuals, smooth animations, attention to detail
- **Accessible**: Inclusive design for all users

## Future Enhancements

- Social login (Google, Facebook)
- Multi-currency support
- Real payment integration (Stripe)
- Advanced search with geolocation
- Host verification process
- In-app video chat
- Mobile applications
- Email notifications
- SMS reminders

## License

All rights reserved.
