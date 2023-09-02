interface Route {
  url: string
  name: string
}

const pages: Route[] = [
  {
    url: '/',
    name: 'News',
  },
  {
    url: '/recycling',
    name: 'Recycling',
  },
]

export default pages
