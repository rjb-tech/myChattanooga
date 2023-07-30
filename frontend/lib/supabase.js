import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = (schema) => {
  const options = {
    db: { schema },
  };

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    options
  );

  return supabase;
};

export default getSupabaseClient;
