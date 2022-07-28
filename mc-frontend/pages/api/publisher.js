import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const authURL = process.env.AUTH_URL;
  const parsedURL = url.parse(req.url, true);
  const queryParamsKeys = Object.keys(parsedURL.query);
  console.log(queryParamsKeys);
  axios
    .get(
      `${authURL}/users/${JSON.stringify(
        req.body.userID
      )}?fields=app_metadata&include_fields=true`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_KEY}}`,
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
}
