import { format, formatISO, formatISO9075 } from 'date-fns';

export function isRelevantArticle(
  content: string,
  headline: string,
  keywords: string[],
) {
  const matchScore = keywords
    .map((key): number => {
      const regex = new RegExp(key, 'i');
      const isMatch = regex.test(content) || regex.test(headline);
      return isMatch ? 1 : 0;
    })
    .reduce((prev, curr) => prev + curr, 0);

  if (matchScore === 0) return false;

  return true;
}

export const fromToday = (datePublished: Date) => {
  const articlePublished = format(datePublished, 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  return articlePublished === today;
};
