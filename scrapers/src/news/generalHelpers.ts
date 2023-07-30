import { format } from 'date-fns';
import { KEYWORDS_TO_AVOID } from './generalInfo';

export function isRelevantArticle(
  content: string,
  headline: string,
  keywords: string[],
) {
  const nonRelevantMatches = KEYWORDS_TO_AVOID.map((key): number => {
    const isMatch =
      content.toLowerCase().includes(key) ||
      headline.toLowerCase().includes(key);
    return isMatch ? 1 : 0;
  }).reduce((prev, curr) => prev + curr, 0);

  if (nonRelevantMatches > 0) return false;

  const relevantMatches = keywords
    .map((key): number => {
      const isMatch =
        content.toLowerCase().includes(key) ||
        headline.toLowerCase().includes(key);
      return isMatch ? 1 : 0;
    })
    .reduce((prev, curr) => prev + curr, 0);

  if (relevantMatches === 0) return false;

  return true;
}

export const fromToday = (datePublished: Date) => {
  const articlePublished = format(datePublished, 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  return articlePublished === today;
};
