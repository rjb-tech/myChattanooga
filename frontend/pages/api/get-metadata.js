import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const managementApiURL = process.env.MANAGEMENT_API_URL;
  const clientID = process.env.MANAGEMENT_CLIENT_ID;
  const clientSecret = process.env.MANAGEMENT_CLIENT_SECRET;
  const parsedURL = url.parse(req.url, true);
  const user = parsedURL.query.user;
  const token = req.headers.authorization;
  const apiURL = process.env.API_URL;
  const desiredField = parsedURL.query.field;

  if (req.method === "GET") {
    // This check prevents a comporomised account from having other information leaked from this route
    // I don't think anyone would find this route, but just to be safe
    if (desiredField === "app_metadata" || desiredField === "user_metadata") {
      axios
        .get(`${apiURL}/auth-check`, { headers: { Authorization: token } })
        .then((response) => {
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
                  `${managementApiURL}/api/v2/users/${user}?fields=${desiredField}&include_fields=true`,
                  {
                    headers: {
                      Authorization: `Bearer ${response.data.access_token}`,
                    },
                  }
                )
                .then((response) => {
                  res.json(response.data[`${desiredField}`]);
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
        })
        .catch((error) => {
          res.json("Not authorized");
          res.end();
        });
    } else {
      res.json("Field not allowed");
      res.end();
    }
  } else {
    res.json("Method not allowed");
    res.end();
  }
}
