import { init as initSentry } from '@sentry/node'
import { NextRequest, NextResponse } from 'next/server'
import mailchimp from '@mailchimp/mailchimp_marketing'

initSentry({
  dsn: process.env.SENTRY_DSN ?? '',
  environment: process.env.DEPLOYMENT_ENV ?? 'dev',
  tracesSampleRate: 0.75,
})

export async function POST(req: NextRequest) {
  return NextResponse.error()
  const parameters: { email: string; firstName: string } = await req.json()

  if (!parameters.email || !parameters.firstName)
    return NextResponse.json('', { status: 404 })

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY ?? '',
    server: 'us21',
  })

  try {
    await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID ?? '',
      {
        email_address: parameters.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: parameters.firstName,
        },
      },
    )
  } catch (e: any) {
    if (e.response.body.title.trim() === 'Member Exists')
      return NextResponse.json("You're already subscribed", { status: 400 })

    return NextResponse.json('Error adding to newsletter', { status: 404 })
  }

  return NextResponse.json('Added to newsletter', { status: 201 })
}
