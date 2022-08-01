import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  if (req.method === "POST") {
    const managementApiURL = process.env.MANAGEMENT_API_URL;
    const clientID = process.env.HUB_CLIENT_ID;
    const parsedURL = url.parse(req.url, true);
    const apiURL = process.env.API_URL;
    axios
      .get(`${apiURL}/auth-check`, {
        headers: {
          authorization: req.headers.authorization,
        },
      })
      .then((response) => {
        axios
          .post(
            `${managementApiURL}/dbconnections/change_password`,
            {
              client_id: clientID,
              email: parsedURL.query.email,
              connection: "myChattanooga-hub",
            },
            {
              headers: {
                "content-type": "application/json",
              },
            }
          )
          .then((response) => {
            res.json(response);
            res.end();
          })
          .catch((error) => {
            res.json(error);
            res.end();
          });
      })
      .catch((error) => res.json(error));
  } else {
    res.json("Method not allowed");
    res.end();
  }
}
