import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'cloudlock'
    }
  },
  db: {
    schema: 'public'
  },
  // Add retries for better reliability
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add connection health check with retries
export async function checkSupabaseConnection(retries = 3, delay = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase.from('passwords').select('count').limit(1).single();
      if (!error) {
        return true;
      }
      console.warn(`Supabase connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (err) {
      console.warn(`Supabase connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}

// Add a health check endpoint
export async function pingSupabase(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('ping');
    return !error && data === 'pong';
  } catch {
    return false;
  }
}

// Add auto-reconnect functionality
let reconnectTimeout: NodeJS.Timeout | null = null;

export function setupReconnection(setConnectionError: (error: boolean) => void, checkInterval = 30000): () => void {
  const check = async () => {
    const isConnected = await checkSupabaseConnection();
    setConnectionError(!isConnected);
    
    if (!isConnected && reconnectTimeout) {
      // Clear existing timeout to prevent multiple reconnection attempts
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(check, 5000); // Try again in 5 seconds
    } else {
      reconnectTimeout = setTimeout(check, checkInterval);
    }
  };

  // Start the initial check
  check();

  // Return cleanup function
  return () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  };
}