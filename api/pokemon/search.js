// api/pokemon/search.js
const { connect } = require('../_db');
const Pokemon = require('../models/Pokemon');
const axios = require('axios');

module.exports = async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    await connect();

    const regex = new RegExp(name, 'i');
    const records = await Pokemon.find({ name: regex });

    if (records.length) {
      const summary = records.map(r => {
        const p = r.data;
        return {
          id: p.id,
          name: p.name,
          types: p.types,
          sprites: { front_default: p.sprites.front_default },
        };
      });
      return res.json(summary);
    }

    // fallback to PokeAPI
    const master = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const filtered = master.data.results.filter(p => regex.test(p.name)).slice(0, 20);

    const detailed = await Promise.all(
      filtered.map(async p => {
        const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
        const data = resp.data;
        await Pokemon.findOneAndUpdate(
          { id: data.id },
          { id: data.id, name: data.name, data },
          { upsert: true, setDefaultsOnInsert: true }
        );
        return {
          id: data.id,
          name: data.name,
          types: data.types,
          sprites: { front_default: data.sprites.front_default },
        };
      })
    );

    return res.json(detailed);
  } catch (err) {
    console.error('search error', err);
    return res.status(500).json({ error: err.message });
  }
};
