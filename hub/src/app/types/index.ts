export type ArticleResponseData = {
  id: number
  headline: string
  link: string
  published: string
  saved: string
  publisher: publisher
}

export type publisher =
  | 'Chattanoogan'
  | 'FoxChattanooga'
  | 'Local3News'
  | 'TimesFreePress'
  | 'WDEF'
  | 'ChattanoogaPulse'
  | 'ChattanoogaNewsChronicle'
