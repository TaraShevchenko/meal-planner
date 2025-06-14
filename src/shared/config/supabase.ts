import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);

// Types for Supabase
export type Database = {
  public: {
    Tables: {
      [_ in never]: never; // Placeholder for table types - add specific table definitions as needed
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     name: string | null
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     name?: string | null
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     email?: string
      //     name?: string | null
      //     created_at?: string
      //   }
      // }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Typed supabase client
export const supabaseTyped = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);
