/*
  # Add self-destruct feature and audit logging

  1. New Tables
    - `self_destruct_settings`
      - `user_id` (uuid, primary key)
      - `cooldown_period` (interval, default 30 seconds)
      - `require_2fa` (boolean, default true)
      - `notify_email` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `self_destruct_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `status` (text: 'initiated', 'completed', 'cancelled', 'failed')
      - `initiated_at` (timestamp)
      - `completed_at` (timestamp)
      - `ip_address` (text)
      - `user_agent` (text)
      - `error_message` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Self-destruct settings table
CREATE TABLE IF NOT EXISTS self_destruct_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cooldown_period interval NOT NULL DEFAULT '30 seconds',
  require_2fa boolean NOT NULL DEFAULT true,
  notify_email boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Self-destruct audit logs
CREATE TABLE IF NOT EXISTS self_destruct_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('initiated', 'completed', 'cancelled', 'failed')),
  initiated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  ip_address text,
  user_agent text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE self_destruct_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_destruct_logs ENABLE ROW LEVEL SECURITY;

-- Policies for self_destruct_settings
CREATE POLICY "Users can view their own self-destruct settings"
  ON self_destruct_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own self-destruct settings"
  ON self_destruct_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self-destruct settings"
  ON self_destruct_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for self_destruct_logs
CREATE POLICY "Users can view their own self-destruct logs"
  ON self_destruct_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self-destruct logs"
  ON self_destruct_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger for self_destruct_settings
CREATE TRIGGER update_self_destruct_settings_updated_at
  BEFORE UPDATE ON self_destruct_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();