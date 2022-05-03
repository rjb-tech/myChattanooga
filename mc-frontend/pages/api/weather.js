const url = require('url');

export default function handler(req, res) {
    if (req.method === 'GET') {
        const parsedURL = url.parse(req.url, true)
        try {
            const result = fetch(`http://host.docker.internal:8000/weather?location=${parsedURL.query.location}`)
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