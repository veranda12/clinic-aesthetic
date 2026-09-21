import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "media";

export function isSupabaseStorageEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    // Node < 22 has no native WebSocket; supabase-js always builds a Realtime
    // client, so give it `ws` (we only use Storage, never Realtime).
    realtime: { transport: ws as unknown as typeof WebSocket },
  });
}