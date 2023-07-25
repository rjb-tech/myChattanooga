import apiSupabase from "../../lib/supabase";
import { endOfDay, subDays } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export default async function handler(req, res) {
  if (!req.method !== "GET") res.status(404);

  const { published } = req.query;
  if (!published) res.status(404);

  const dayQueried = endOfDay(zonedTimeToUtc(published, "America/New_York"));
  const dayBefore = subDays(dayQueried, 1);

  const { data: articles, error } = await apiSupabase
    .from("articles")
    .select("*")
    .gte("published", dayBefore.toISOString())
    .lt("published", dayQueried.toISOString());

  if (error) {
    console.log(error);
    res.status(404);
  }

  res.status(200).json(articles);
}
