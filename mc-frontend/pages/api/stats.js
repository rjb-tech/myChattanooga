import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  let apiURL;
  if (process.env.DEPLOYMENT_ENV === "prod") {
    apiURL = "https://api.mychattanooga.app";
  } else {
    apiURL = "http://0.0.0.0:8000";
  }
  if (req.method === "GET") {
    const parsedURL = url.parse(req.url, true);
    let queryParams = "";
    // Query date needs to be passed in iso format
    if (parsedURL.query.query_date !== undefined)
      queryParams = `query_date=${parsedURL.query.query_date}`;

    const result = axios
      .get(`${apiURL}/stats?${queryParams}`)
      .then(async (response) => {
        res.json(response.data);
        res.end();
      })
      .catch((error) => {
        res.json(error);
        res.end();
      });
  } else {
    res.status(404);
    res.end();
  }
}