import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const managementApiURL = process.env.MANAGEMENT_API_URL;
  const clientID = process.env.MANAGEMENT_CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const parsedURL = url.parse(req.url, true);
  if (req.method === "GET") {
    const user = parsedURL.query.user;

    // Get API key from Auth0
    const managementTokenInfo = axios
      .post(
        `${managementApiURL}/oauth/token`,
        {
          client_id: `${clientID}`,
          client_secret: `${clientSecret}`,
          audience: `${managementApiURL}/api/v2/`,
          grant_type: "client_credentials",
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((response) => {
        axios
          .get(
            `${managementApiURL}/api/v2/users/${user}?fields=app_metadata&include_fields=true`,
            {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          )
          .then((response) => {
            res.json({ publisher: response.data.app_metadata.publisher });
            res.end();
          })
          .catch((error) => {
            res.json(error);
            res.end();
          });
      })
      .catch((error) => {
        res.json(error);
        res.end();
      });
  }
}