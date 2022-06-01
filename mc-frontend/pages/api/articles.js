export default function handler(req, res) {
    // res.status(200).json({ name: 'John Doe' })
    let apiURL
    if (process.env.DEPLOYMENT_ENV === "prod") {apiURL="https://api.mychattanooga.app"}
    else {apiURL="http://host.docker.internal:8000"}
    if (req.method === 'GET') {
        try {
            const result = fetch(`${apiURL}/articles`)
                .then(async (response) => {
                    const data = await response.json();
                    res.json(data);
                })
        }
        catch (error) {
            res.json(error)
            res.end()
        }
    }
    else {
        res.status(404)
    }
}