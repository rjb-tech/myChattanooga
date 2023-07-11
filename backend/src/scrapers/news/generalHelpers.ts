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
