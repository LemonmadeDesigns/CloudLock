/*
  # Add ping function for health checks

  1. New Functions
    - `ping()`: Returns 'pong' if the database is accessible
  
  2. Security
    - Function is accessible to authenticated users only
*/

-- Create a simple ping function for health checks
CREATE OR REPLACE FUNCTION ping()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'pong'::text;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION ping() TO authenticated;