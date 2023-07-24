import apiSupabase from "../../lib/supabase";
import { endOfDay, parse, subDays } from "date-fns";

export default async function handler(req, res) {
  if (!req.method !== "GET") res.status(404);

  const { published: publishedRaw } = req.query;
  if (!publishedRaw) res.status(404);

  const published = parse(publishedRaw, "yyyy-MM-dd", new Date());

  const { data: articles, error } = await apiSupabase
    .from("articles")
    .select("*");

  // console.log(articles);
  // console.log(error);

  if (error) res.status(404);

  res.status(200).json(articles);
}
