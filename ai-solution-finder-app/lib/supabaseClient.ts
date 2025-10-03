import { createClient } from '@supabase/supabase-js';

/**
 * Instantiate a singleton Supabase client. The client is configured using public
 * environment variables exposed via next.config.js. These values must point to a
 * Supabase project hosted in the EU (e.g. region `eu-central-1`). See the README
 * for details on how to provision a compliant Supabase project.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);