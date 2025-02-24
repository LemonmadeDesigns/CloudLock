/*
  # Password Management System

  1. New Tables
    - `password_categories` - For organizing passwords
    - `password_versions` - Version history for passwords
    - `password_shares` - Secure password sharing
    - `password_duplicates` - Track and merge duplicate entries

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure sharing mechanisms
*/

-- Password Categories
CREATE TABLE IF NOT EXISTS password_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Password Versions
CREATE TABLE IF NOT EXISTS password_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_id uuid NOT NULL REFERENCES passwords(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  url text,
  notes text,
  version_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Password Shares
CREATE TABLE IF NOT EXISTS password_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_id uuid NOT NULL REFERENCES passwords(id) ON DELETE CASCADE,
  shared_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions jsonb NOT NULL DEFAULT '{"read": true, "write": false, "share": false}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(password_id, shared_with)
);

-- Password Duplicates
CREATE TABLE IF NOT EXISTS password_duplicates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_id uuid NOT NULL REFERENCES passwords(id) ON DELETE CASCADE,
  duplicate_id uuid NOT NULL REFERENCES passwords(id) ON DELETE CASCADE,
  similarity_score float NOT NULL,
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolution_type text CHECK (resolution_type IN ('merged', 'kept', 'ignored')),
  UNIQUE(original_id, duplicate_id)
);

-- Add category_id to passwords table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'passwords' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE passwords ADD COLUMN category_id uuid REFERENCES password_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE password_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_duplicates ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Users can manage their own categories"
  ON password_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Versions Policies
CREATE POLICY "Users can view password versions they own"
  ON password_versions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create password versions they own"
  ON password_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Shares Policies
CREATE POLICY "Users can view passwords shared with them"
  ON password_shares
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = shared_with OR 
    auth.uid() = shared_by
  );

CREATE POLICY "Users can share their own passwords"
  ON password_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM passwords
      WHERE id = password_id AND user_id = auth.uid()
    )
  );

-- Duplicates Policies
CREATE POLICY "Users can manage their duplicate entries"
  ON password_duplicates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to detect duplicate passwords
CREATE OR REPLACE FUNCTION detect_password_duplicates()
RETURNS trigger AS $$
BEGIN
  -- Find potential duplicates based on similar titles or URLs
  INSERT INTO password_duplicates (user_id, original_id, duplicate_id, similarity_score)
  SELECT 
    NEW.user_id,
    CASE WHEN p.created_at < NEW.created_at THEN p.id ELSE NEW.id END,
    CASE WHEN p.created_at < NEW.created_at THEN NEW.id ELSE p.id END,
    CASE 
      WHEN p.url IS NOT NULL AND p.url = NEW.url THEN 1.0
      WHEN similarity(p.title, NEW.title) > 0.8 THEN similarity(p.title, NEW.title)
      ELSE 0.0
    END as score
  FROM passwords p
  WHERE p.user_id = NEW.user_id
    AND p.id != NEW.id
    AND (
      (p.url IS NOT NULL AND p.url = NEW.url)
      OR similarity(p.title, NEW.title) > 0.8
    )
    AND NOT EXISTS (
      SELECT 1 FROM password_duplicates pd
      WHERE (pd.original_id = p.id AND pd.duplicate_id = NEW.id)
      OR (pd.original_id = NEW.id AND pd.duplicate_id = p.id)
    );
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger for duplicate detection
CREATE TRIGGER detect_duplicates_trigger
  AFTER INSERT OR UPDATE ON passwords
  FOR EACH ROW
  EXECUTE FUNCTION detect_password_duplicates();

-- Function to track password versions
CREATE OR REPLACE FUNCTION track_password_versions()
RETURNS trigger AS $$
BEGIN
  INSERT INTO password_versions (
    password_id,
    user_id,
    title,
    username,
    password,
    url,
    notes,
    version_number
  )
  SELECT
    NEW.id,
    NEW.user_id,
    NEW.title,
    NEW.username,
    NEW.password,
    NEW.url,
    NEW.notes,
    COALESCE(
      (SELECT MAX(version_number) + 1
       FROM password_versions
       WHERE password_id = NEW.id),
      1
    );
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger for version tracking
CREATE TRIGGER track_versions_trigger
  AFTER INSERT OR UPDATE ON passwords
  FOR EACH ROW
  EXECUTE FUNCTION track_password_versions();