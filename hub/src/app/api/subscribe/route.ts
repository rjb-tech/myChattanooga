import { init as initSentry, captureException } from '@sentry/node'
import { NextRequest, NextResponse } from 'next/server'
import mailchimp, { ErrorResponse } from '@mailchimp/mailchimp_marketing'

// THIS AIN'T WORKIN PA

initSentry({
  dsn: process.env.SENTRY_DSN ?? '',
  environment: process.env.DEPLOYMENT_ENV ?? 'dev',
  tracesSampleRate: 0.75,
})

export async function POST(req: NextRequest) {
  const parameters: { email: string; first_name: string } = await req.json()

  if (!parameters.email || !parameters.first_name) return NextResponse.error()

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
          FNAME: parameters.first_name,
        },
      },
    )
  } catch (e: any) {
    captureException(`Error subscribing user to newsletter`)
    return NextResponse.error()
  }

  return NextResponse.json('hey')
}
