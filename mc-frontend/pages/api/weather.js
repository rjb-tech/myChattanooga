const url = require('url');

export default function handler(req, res) {
    const apiKey = process.env.OWM_API_KEY;
    // console.log(req.url)
    
    if (req.method === 'GET') {
        const parsedURL = url.parse(req.url, true)
        try {
            const result = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${parsedURL.query.latitude}&lon=${parsedURL.query.longitude}&appid=${apiKey}&units=imperial`)
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