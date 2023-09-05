import { endOfDay, subDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import getSupabaseClient from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { ArticleResponseData } from '@/types'
import { init as initSentry, captureException } from '@sentry/node'

initSentry({
  dsn: process.env.SENTRY_DSN ?? '',
  environment: process.env.DEPLOYMENT_ENV ?? 'dev',
  tracesSampleRate: 0.75,
})

export async function GET(req: Request) {
  const supabase = getSupabaseClient('news')
  const { searchParams } = new URL(req.url)
  const published = (searchParams.get('published') as string) ?? ''
  if (!published) return NextResponse.error()

  const dayQueried = endOfDay(zonedTimeToUtc(published, 'America/New_York'))
  const dayBefore = subDays(dayQueried, 1)

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .gte('published', dayBefore.toISOString())
    .lt('published', dayQueried.toISOString())
    .order('published', { ascending: false })

  if (error) {
    captureException('Error fetching articles')
    return NextResponse.error()
  }

  return NextResponse.json(articles as ArticleResponseData[])
}
