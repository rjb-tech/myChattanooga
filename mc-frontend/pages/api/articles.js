export default function handler(req, res) {
    // res.status(200).json({ name: 'John Doe' })
    if (req.method === 'GET') {
        try {
            const result = fetch('http://host.docker.internal:8000/articles')
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