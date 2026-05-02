import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://api.y2kgroup.cloud';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzUzMTk4NSwiZXhwIjoxOTI5MTA3OTg1fQ.ReNhHIoqGNNB5KRTaLOre_OQdFMdnHBD4mHBz0qvagk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types for user roles
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  is_active: boolean;
}

// Helper to get user role from metadata
export const getUserRole = (user: any): UserRole => {
  return user?.user_metadata?.role || 'user';
};

// Helper to set user role in metadata
export const setUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });
    return !error;
  } catch {
    return false;
  }
};
