import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fupyposiegpynmgndboz.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_z2Bab4_2EhpdrA3rr2dMrQ_xONQFpe-";

export const supabase = createClient(supabaseUrl, supabaseKey);
