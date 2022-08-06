import axios from "axios";
const url = require("url");

export default function handler(req, res) {
  const parsedURL = url.parse(req.url, true);
  const queryParamsKeys = Object.keys(parsedURL.query);
  const emptyQuery = queryParamsKeys.length === 0;

  const apiURL = process.env.API_URL;

  const requestHeadersWithAuth = {
    headers: {
      Authorization: req.headers.authorization,
    },
  };

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
      let queryString = "";
      for (let i = 0; i < queryParamsKeys.length; i++) {
        queryString += `${queryParamsKeys[i]}=${
          parsedURL.query[queryParamsKeys[i]]
        }&`;
      }
      axios
        .get(`${apiURL}/brews?${queryString}`)
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          res.json(error);
          res.end();
        });
    }
  } else if (req.method === "POST") {
    axios
      .post(
        `${apiURL}/brews/pour`,
        {
          headline: req.body.headline,
          user: req.body.user,
        },
        requestHeadersWithAuth
      )
      .then((response) => {
        res.json(response.data);
        res.end();
      })
      .catch((error) => {
        res.json(error);
        res.end();
      });
  } else if (req.method === "PATCH") {
    axios
      .patch(
        `${apiURL}/brews/expire?id=${req.body.id}`,
        {},
        requestHeadersWithAuth
      )
      .then((response) => res.json(response.data))
      .catch((error) => res.json(error));
  } else {
    res.status(404).json("request method not allowed");
  }
}
