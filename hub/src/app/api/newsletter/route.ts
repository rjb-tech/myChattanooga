import { endOfDay, subDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import getSupabaseClient from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { ArticleResponseData } from '@/types'
import OpenAI from 'openai'
import { init as initSentry, captureException } from '@sentry/node'

// initSentry({
//   dsn: process.env.SENTRY_DSN ?? '',
//   environment: process.env.DEPLOYMENT_ENV ?? 'dev',
//   tracesSampleRate: 0.75,
// })

// export async function GET(req: Request) {
//   return NextResponse.error()
//   // const { searchParams } = new URL(req.url)
//   // const accessKey = searchParams.get('bippityBoopity') as string
//   // if (accessKey !== 'e%n@c8Q!hPuMR@5%u^5#@Yov#FbdtN^t')
//   //   return NextResponse.error()

//   const supabase = getSupabaseClient('news')

//   const dayQueried = endOfDay(
//     zonedTimeToUtc(new Date().toISOString(), 'America/New_York'),
//   )
//   const dayBefore = subDays(dayQueried, 1)

//   const { data: articles, error: articlesError } = await supabase
//     .from('articles')
//     .select('*')
//     .gte('published', dayBefore.toISOString())
//     .lt('published', dayQueried.toISOString())

//   const { data: stats, error: statsError } = await supabase
//     .from('stats')
//     .select('*')
//     .gte('dateSaved', dayBefore.toISOString())
//     .lt('published', dayQueried.toISOString())

//   if (articlesError || statsError) {
//     if (articlesError) captureException('Error fetching articles')
//     if (statsError) captureException('Error fetching stats')
//     return NextResponse.error()
//   }

//   const summary = await getArticlesSummary(articles as ArticleResponseData[])

//   return NextResponse.json(summary)
// }

// const getArticlesSummary = async (articles: ArticleResponseData[]) => {
//   const openai = new OpenAI({
//     apiKey: process.env.OPEN_AI_API_KEY,
//   })

//   const headlines = articles.reduce(
//     (prev, curr) => prev + `${curr.headline} - ${curr.publisher},`,
//     '',
//   )

//   const summary = await openai.chat.completions.create({
//     messages: [
//       {
//         role: 'user',
//         content: `Please count the headlines published by each publisher and summarize what each publisher wrote about today: ${headlines}`,
//       },
//     ],
//     model: 'gpt-3.5-turbo',
//   })

//   return summary.choices[0].message.content
// }
