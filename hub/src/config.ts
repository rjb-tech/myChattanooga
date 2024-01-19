import { addHours, startOfDay } from 'date-fns'

const config = {
  apiRoutes: {
    url: process.env.API_ROUTES_URL ?? 'http://localhost:3030/api',
  },
  supabase: {
    apiUrl: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  mockData: {
    articles: [
      {
        id: 3684,
        headline:
          'Man shot during Brink’s truck robbery attempt in Chattanooga arrested, facing charges',
        link: 'https://timesfreepress.com/news/2024/jan/18/man-shot-during-brinks-truck-robbery-attempt-in/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'TimesFreePress',
      },
      {
        id: 3683,
        headline: 'McDonald Farm receives grant as zoning debate continues',
        link: 'https://www.wdef.com/mcdonald-farm-receives-grant-as-zoning-debate-continues/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3682,
        headline:
          'Tech entrepreneurs from around the globe find friendly welcome in Tennessee',
        link: 'https://timesfreepress.com/news/2024/jan/18/tech-entrepreneurs-from-around-the-globe-find/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'TimesFreePress',
      },
      {
        id: 3681,
        headline:
          'Crews preparing for potential freezing rain on Thursday night',
        link: 'https://www.wdef.com/crews-preparing-for-potential-freezing-rain-on-thursday-night/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3679,
        headline:
          'Zoo hosts special performances for closing weekend of Asian Lantern Festival',
        link: 'https://www.wdef.com/zoo-hosts-special-performances-for-closing-weekend-of-asian-lantern-festival/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3678,
        headline:
          'School Board Takes Money, But Upset About Way Funds For Howard, Brainerd Fields Arrived',
        link: 'https://www.chattanoogan.com/2024/1/18/481290/School-Board-Takes-Money-But-Upset.aspx',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'Chattanoogan',
      },
      {
        id: 3680,
        headline:
          'Hamilton County School Board makes final vote on school facilities plan',
        link: 'https://www.local3news.com/local-news/hamilton-county-school-board-makes-final-vote-on-school-facilities-plan/article_8457184e-b662-11ee-ad08-a38d83cab394.html',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'Local3News',
      },
      {
        id: 3675,
        headline:
          'Innovators visit Chattanooga for inaugural startup Accelerator',
        link: 'https://www.wdef.com/innovators-visit-chattanooga-for-inaugural-startup-accelerator/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3676,
        headline:
          'Health experts continue seeing rise of flu in Hamilton County',
        link: 'https://www.wdef.com/health-experts-continue-seeing-rise-of-flu-in-hamilton-county/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3677,
        headline:
          'Salvation Army of Chattanooga extends Shield of Warmth program',
        link: 'https://www.wdef.com/salvation-army-of-chattanooga-extends-shield-of-warmth-program/',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'WDEF',
      },
      {
        id: 3674,
        headline:
          'Hamilton County School Board makes final vote on school facilities plan Thursday',
        link: 'https://foxchattanooga.com/news/local/hamilton-county-school-board-makes-final-vote-on-school-facilities-plan-thursday',
        published: startOfDay(new Date()).toISOString(),
        saved: addHours(
          startOfDay(new Date()),
          Math.floor(Math.random() * 10) + 1,
        ).toISOString(),
        publisher: 'FoxChattanooga',
      },
    ],
  },
}

export default config
