-- Enable the pg_trgm extension for text similarity matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Recreate the detect_password_duplicates function with proper similarity checks
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
      WHEN p.title % NEW.title THEN similarity(p.title, NEW.title)::float
      ELSE 0.0
    END as score
  FROM passwords p
  WHERE p.user_id = NEW.user_id
    AND p.id != NEW.id
    AND (
      (p.url IS NOT NULL AND p.url = NEW.url)
      OR p.title % NEW.title
    )
    AND NOT EXISTS (
      SELECT 1 FROM password_duplicates pd
      WHERE (pd.original_id = p.id AND pd.duplicate_id = NEW.id)
      OR (pd.original_id = NEW.id AND pd.duplicate_id = p.id)
    );
  
  RETURN NEW;
END;
$$ language plpgsql security definer;