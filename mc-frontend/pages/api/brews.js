import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const parsedURL = url.parse(req.url, true);
  const queryParamsKeys = Object.keys(parsedURL.query);
  const emptyQuery = queryParamsKeys.length === 0;

  let queryString = "";
  for (let i = 0; i < queryParamsKeys.length; i++) {
    queryString += `${queryParamsKeys[i]}=${router.query[queryParamsKeys[i]]}&`;
  }

  let apiURL;
  if (process.env.DEPLOYMENT_ENV === "prod") {
    apiURL = "https://api.mychattanooga.app";
  } else {
    apiURL = "http://0.0.0.0:8000";
  }

  if (req.method === "GET") {
    if (emptyQuery === true) {
      axios
        .get(`${apiURL}/brews`)
        .then((response) => {
          res.json(response.data);
          res.end();
        })
        .catch((error) => {
          res.json(error);
          res.end();
        });
    } else {
      axios
        .get(`${apiURL}/brews?${queryString}`)
        .then(async (response) => {
          const data = await response.json();
          res.json(data);
        })
        .catch((error) => {
          res.json(error);
          res.end();
        });
    }
  } else {
    res.status(404).json("request method not allowed");
  }
}
