export interface PasswordEntry {
  id: string;
  user_id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}