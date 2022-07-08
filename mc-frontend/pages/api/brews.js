import axios from "axios"
import { useRouter } from "next/router"

export default function handler(req, res) {

  const router = useRouter()
  const queryParams = router.query
  const emptyQuery = Object.keys(queryParams).length === 0

  let apiURL
  if (process.env.DEPLOYMENT_ENV === "prod") { apiURL = "https://api.mychattanooga.app" }
  else { apiURL = "http://host.docker.internal:8000" }
  if (req.method === 'GET') {
    axios.get(`${apiURL}/brews`)
      .then(async (response) => {
        const data = await response.json();
        res.json(data);
      })
      .catch(error => {
        res.json(error)
        res.end()
      })
  }
  else {
    res.status(404).json({ "status": "request method not allowed" })
  }
}