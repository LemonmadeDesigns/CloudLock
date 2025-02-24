/*
  # Fix Self-Destruct Policies and Add Default Settings

  1. Changes
    - Add trigger to create default settings for new users
    - Update RLS policies for better security
    - Add function to handle user creation

  2. Security
    - Maintain RLS on all tables
    - Ensure proper access control
*/

-- Function to create default settings for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO self_destruct_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to create default settings for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies for self_destruct_logs
DROP POLICY IF EXISTS "Users can insert their own self-destruct logs" ON self_destruct_logs;
CREATE POLICY "Users can insert their own self-destruct logs"
  ON self_destruct_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM self_destruct_settings
      WHERE user_id = auth.uid()
    )
  );

-- Insert default settings for existing users
INSERT INTO self_destruct_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;