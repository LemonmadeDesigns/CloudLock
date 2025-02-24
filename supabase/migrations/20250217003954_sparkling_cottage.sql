/*
  # Fix Self-Destruct RLS Policies

  1. Changes
    - Update RLS policies for better security
    - Add default user_id to logs
    - Ensure settings exist before allowing logs

  2. Security
    - Maintain RLS on all tables
    - Enforce user_id consistency
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own self-destruct logs" ON self_destruct_logs;
DROP POLICY IF EXISTS "Users can view their own self-destruct logs" ON self_destruct_logs;

-- Create new policies with better security
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

CREATE POLICY "Users can view their own self-destruct logs"
  ON self_destruct_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure settings exist for all users
INSERT INTO self_destruct_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;