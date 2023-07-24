import { createClient } from "@supabase/supabase-js";

const options = {
  db: { schema: "news" },
};

const apiSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  options
);

export default apiSupabase;
