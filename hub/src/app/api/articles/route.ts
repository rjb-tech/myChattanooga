import { endOfDay, subDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import getSupabaseClient from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { ArticleResponseData } from '@/types'

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
    console.log(error ?? '')
    return NextResponse.error()
  }

  return NextResponse.json(articles as ArticleResponseData[])
}
