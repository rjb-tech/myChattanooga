const config = {
  apiRoutes: {
    url: process.env.API_ROUTES_URL ?? 'http://localhost:3000/api',
  },
  supabase: {
    apiUrl: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
}

export default config
