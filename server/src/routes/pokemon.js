const express = require('express');
const router = express.Router();
const { getPokemonByName, getPokemonById, searchPokemons } = require('../utils/fetcher');

router.get('/search', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const data = await searchPokemons(name);
    res.json(data);
  } catch (err) {
    // res.status(500).json({ error: err.message });
    console.error('ERROR in /search', err);
    res.status(500).json({
      error: err.message,
      // include stack only in dev to help debug
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    const data = await getPokemonById(req.params.id);
    res.json(data);
  } catch (err) {
    console.error('ERROR /details/:id', err); // full stack
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
});



module.exports = router;