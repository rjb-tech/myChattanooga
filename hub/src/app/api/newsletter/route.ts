import { endOfDay, subDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import getSupabaseClient from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { ArticleResponseData } from '@/app/types'
import OpenAI from 'openai'

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url)
  // const accessKey = searchParams.get('bippityBoopity') as string
  // if (accessKey !== 'e%n@c8Q!hPuMR@5%u^5#@Yov#FbdtN^t')
  //   return NextResponse.error()

  const supabase = getSupabaseClient('news')

  const dayQueried = endOfDay(
    zonedTimeToUtc(new Date().toISOString(), 'America/New_York'),
  )
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

  const summary = await getArticlesSummary(articles as ArticleResponseData[])

  return NextResponse.json(summary)
}

const getArticlesSummary = async (articles: ArticleResponseData[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  })

  const headlines = articles.reduce(
    (prev, curr) => prev + `${curr.headline},`,
    '',
  )

  const summary = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `Please write a very brief summary of these headlines: ${headlines}`,
      },
    ],
    model: 'gpt-3.5-turbo',
  })

  return summary.choices[0].message.content
}
