import getSupabaseClient from "../../lib/supabase";

const supabase = getSupabaseClient("weather");

export default async function handler(req, res) {
  if (req.method !== "GET") res.status(404);

  const { location: queriedLocation } = req.query;

  const { data: weather, error } = await supabase
    .from("weather")
    .select("*")
    .eq("location", queriedLocation);

  if (error) {
    console.error(error);
    res.status(404);
  }

  res.status(200).json(weather);
}
