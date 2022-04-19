export default function handler(req, res) {
    const apiKey = process.env.OWM_API_KEY;
    if (req.method === 'GET') {
        try {
            const result = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${req.latitude}&lon=${req.longitude}&appid=${apiKey}&units=imperial`)
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