// api/models/Pokemon.js
const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, unique: true },
  data: { type: Object },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema);
