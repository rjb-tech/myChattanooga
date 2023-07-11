export interface WebsiteSection {
  link: string;
  keywords: string[];
}

export interface FoundArticle {
  headline: string;
  link: string;
  date: Date;
}

export interface RelevantArticle {
  headline: string;
  link: string;
  image: string;
  timePosted: Date;
  saved: Date;
}
