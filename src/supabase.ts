import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://api.y2kgroup.cloud';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzUzMTk4NSwiZXhwIjoxOTI5MTA3OTg1fQ.ReNhHIoqGNNB5KRTaLOre_OQdFMdnHBD4mHBz0qvagk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
