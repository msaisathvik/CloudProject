-- Create the 'cameras' table
CREATE TABLE cameras (
    id TEXT PRIMARY KEY,
    location TEXT,
    area TEXT,
    status TEXT,
    last_active_at TIMESTAMPTZ
);

-- Create the 'detections' table
CREATE TABLE detections (
    id SERIAL PRIMARY KEY,
    camera_id TEXT REFERENCES cameras(id),
    label TEXT,
    confidence FLOAT,
    timestamp TIMESTAMPTZ,
    frame_url TEXT,
    location TEXT
);

-- Create the 'alerts' table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    detection_id INTEGER REFERENCES detections(id),
    sent_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    status TEXT
);

-- Create the 'detection_history' table
CREATE TABLE detection_history (
    id SERIAL PRIMARY KEY,
    detection_id INTEGER REFERENCES detections(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);

-- Create the 'profiles' table for user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ
);

-- Seed data for 'cameras'
INSERT INTO cameras (id, location, area, status, last_active_at) VALUES
('CAM_01', 'Main St & 1st Ave', 'Downtown', 'active', NOW() - INTERVAL '1 hour'),
('CAM_02', 'Plaza Center', 'Midtown', 'active', NOW() - INTERVAL '2 hours'),
('CAM_03', 'Hwy 101', 'Uptown', 'inactive', NOW() - INTERVAL '1 day');

-- Seed data for 'detections'
INSERT INTO detections (camera_id, label, confidence, "timestamp", frame_url, location) VALUES
('CAM_01', 'car', 95.5, NOW() - INTERVAL '5 minutes', '/src/assets/images/smart1.jpg', 'Main St & 1st Ave'),
('CAM_01', 'person', 88.2, NOW() - INTERVAL '4 minutes', '/src/assets/images/smart2.jpg', 'Main St & 1st Ave'),
('CAM_02', 'accident', 75.0, NOW() - INTERVAL '10 minutes', '/src/assets/images/smart3.jpg', 'Plaza Center'),
('CAM_02', 'traffic_light', 99.1, NOW() - INTERVAL '8 minutes', '/src/assets/images/smartcity.jpg', 'Plaza Center');

-- Seed data for 'alerts'
INSERT INTO alerts (detection_id, sent_at, acknowledged_at, status) VALUES
(1, NOW() - INTERVAL '5 minutes', NULL, 'sent'),
(2, NOW() - INTERVAL '4 minutes', NOW() - INTERVAL '1 minute', 'sent'),
(3, NOW() - INTERVAL '10 minutes', NULL, 'failed');

-- Seed data for 'detection_history'
INSERT INTO detection_history (detection_id, details) VALUES
(1, '{"action": "Alert Sent", "priority": "low"}'),
(2, '{"action": "Alert Acknowledged", "priority": "low"}'),
(3, '{"action": "Alert Failed", "reason": "Connection error"}');

-- Setup RLS policies
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public cameras are viewable by everyone." ON cameras FOR SELECT USING (true);
CREATE POLICY "Users can insert their own cameras." ON cameras FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own cameras." ON cameras FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public detections are viewable by everyone." ON detections FOR SELECT USING (true);
CREATE POLICY "Users can insert their own detections." ON detections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own detections." ON detections FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public alerts are viewable by everyone." ON alerts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own alerts." ON alerts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own alerts." ON alerts FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE detection_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public detection_history are viewable by everyone." ON detection_history FOR SELECT USING (true);
CREATE POLICY "Users can insert their own detection_history." ON detection_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own detection_history." ON detection_history FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 