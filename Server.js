const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MAX_CACHE_SIZE = 10;
const cache = new Map(); // Using Map to maintain insertion order

// POST /cache → Stores a key-value pair
// POST /cache → Stores a key-value pair with max size restriction
app.post('/cache', (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).json({ error: 'Key and value are required' });
    }

    if (cache.size >= MAX_CACHE_SIZE) {
        return res.status(400).json({ error: 'Cache is full. Cannot store more items.' });
    }

    cache.set(key, value);
    res.json({ message: 'Stored successfully', key, value });
});

// GET /cache/:key → Retrieves a value (if exists)
app.get('/cache/:key', (req, res) => {
    const { key } = req.params;
    if (!cache.has(key)) {
        return res.status(404).json({ error: 'Key not found' });
    }
    res.json({ key, value: cache.get(key) });
});

// DELETE /cache/:key → Remove from cache
app.delete('/cache/:key', (req, res) => {
    const { key } = req.params;
    if (!cache.has(key)) {
        return res.status(404).json({ error: 'Key not found' });
    }
    cache.delete(key);
    res.json({ message: 'Deleted successfully', key });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
