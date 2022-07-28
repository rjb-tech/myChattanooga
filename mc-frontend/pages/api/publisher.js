import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const authURL = process.env.AUTH_URL;
  const parsedURL = url.parse(req.url, true);
  if (req.method === "GET") {
    const user = parsedURL.query.user;
    const apiKey = process.env.AUTH0_MANAGEMENT_API_KEY;
    axios
      .get(`${authURL}/users/${user}?fields=app_metadata&include_fields=true`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        res.json({ publisher: response.data.app_metadata.publisher });
        res.end();
      })
      .catch((error) => {
        res.json(error);
        res.end();
      });
  }
}
