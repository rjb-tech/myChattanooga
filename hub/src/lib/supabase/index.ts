import { createClient } from '@supabase/supabase-js'
import config from '../../config'

const getSupabaseClient = (schema: string) => {
  const options = {
    db: { schema },
    auth: {
      persistSession: false
    }
  }

  const supabase = createClient(
    config.supabase.apiUrl,
    config.supabase.anonKey,
    options,
  )

  return supabase
}

export default getSupabaseClient
