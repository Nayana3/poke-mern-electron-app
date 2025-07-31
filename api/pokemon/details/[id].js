// api/pokemon/details/[id].js
const { connect } = require('../../_db');
const Pokemon = require('../../models/Pokemon');
const axios = require('axios');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });

  const numeric = Number(id);
  if (isNaN(numeric)) return res.status(400).json({ error: 'invalid id' });

  try {
    await connect();

    const record = await Pokemon.findOne({ id: numeric });
    if (record) {
      return res.json(record.data);
    }

    const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numeric}`);
    const data = resp.data;
    await Pokemon.findOneAndUpdate(
      { id: data.id },
      { id: data.id, name: data.name, data },
      { upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(data);
  } catch (err) {
    console.error('details error', err);
    return res.status(500).json({ error: err.message });
  }
};
