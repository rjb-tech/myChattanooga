import { endOfDay, subDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import getSupabaseClient from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
  id: number
  headline: string
  link: string
  published: string
  saved: string
  publisher: string
}

export async function GET(req: NextRequest) {
  const supabase = getSupabaseClient('news')

  const published = (req.nextUrl.searchParams.get('published') as string) ?? ''
  if (!published) return NextResponse.error()

  const dayQueried = endOfDay(zonedTimeToUtc(published, 'America/New_York'))
  const dayBefore = subDays(dayQueried, 1)

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .gte('published', dayBefore.toISOString())
    .lt('published', dayQueried.toISOString())

  if (error) {
    console.log(error ?? '')
    return NextResponse.error()
  }

  return NextResponse.json(articles as ResponseData[])
}
