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
  | 'all'

export const publisherNameMap = {
  Chattanoogan: 'Chattanoogan',
  ChattanoogaNewsChronicle: 'Chattanooga News Chronicle',
  Local3News: 'Local 3 News',
  ChattanoogaPulse: 'Chattanooga Pulse',
  FoxChattanooga: 'Fox Chattanooga',
  TimesFreePress: 'Times Free Press',
  WDEF: 'WDEF News 12',
  all: 'All Publishers',
}

export enum deploymentEnvironments {
  dev = 'dev',
  production = 'prod',
}
