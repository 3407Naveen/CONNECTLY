-- Sample seed data for CONNECTLY platform
-- Run this after setting up authentication to create demo moments

-- Note: You'll need to replace the host_id values with actual user IDs from your auth.users table
-- After creating a host account, you can get the ID and use it here

-- Sample moments (you'll need to replace 'YOUR_HOST_ID' with an actual user ID)
-- INSERT INTO moments (host_id, title, description, emotional_description, mood, category, location, duration_minutes, price, max_participants, images, accessibility_features, included_items, status, verified)
-- VALUES
--   ('YOUR_HOST_ID', 'Sunset Meditation by the Lake', 'Find inner peace with a guided meditation session as the sun sets over the tranquil lake.', 'Let go of stress and reconnect with yourself in this calming moment of stillness and reflection.', 'peaceful', 'Wellness', 'Lake Como, Italy', 60, 45, 8, '["https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg"]', ARRAY['Wheelchair accessible', 'Quiet space available'], ARRAY['Meditation cushions', 'Herbal tea', 'Guided audio'], 'approved', true),
--   ('YOUR_HOST_ID', 'Urban Street Art Walking Tour', 'Explore the vibrant street art scene and discover hidden murals in the city.', 'Immerse yourself in the creative energy of the streets and see the city through an artist''s eyes.', 'creative', 'Art & Culture', 'Brooklyn, New York', 90, 35, 12, '["https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg"]', ARRAY['Moderate walking required'], ARRAY['Art history guide', 'Photo opportunities'], 'approved', true),
--   ('YOUR_HOST_ID', 'Private Rooftop Stargazing', 'Gaze at the stars from a private rooftop with a professional astronomer guide.', 'Reconnect with the cosmos and discover the wonder of the night sky in this romantic and inspiring experience.', 'romantic', 'Nature', 'Sedona, Arizona', 120, 85, 4, '["https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg"]', ARRAY['Roof access required'], ARRAY['Telescope', 'Blankets', 'Hot cocoa'], 'approved', true);

-- Instructions:
-- 1. Create a host account through the UI
-- 2. Get the user ID from the profiles table
-- 3. Replace 'YOUR_HOST_ID' in the SQL above with your actual user ID
-- 4. Run the SQL through Supabase SQL Editor or the execute_sql tool
