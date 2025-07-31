const axios = require('axios')
const Pokemon = require('../models/Pokemon')

async function fetchWithRetry(url, retries = 1) {
  try {
    return await axios.get(url)
  } catch (e) {
    if (retries > 0) {
      console.warn('retrying fetch', url)
      return fetchWithRetry(url, retries - 1)
    }
    throw e
  }
}

async function getPokemonByName(name) {
  const key = name.toLowerCase()
  try {
    const record = await Pokemon.findOne({ name: key })
    if (record) {
      console.log('cache hit for name:', key)
      return record.data
    }

    console.log('cache miss for name:', key, '- fetching from PokeAPI')
    const res = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${key}`)
    const data = res.data

    await Pokemon.findOneAndUpdate(
      { id: data.id },
      { id: data.id, name: data.name, data },
      { upsert: true, setDefaultsOnInsert: true }
    )

    return data
  } catch (err) {
    console.error('getPokemonByName error for', name, err.message)
    throw err
  }
}

async function getPokemonById(id) {
  try {
    const numeric = Number(id)
    if (isNaN(numeric)) throw new Error('invalid id')

    const record = await Pokemon.findOne({ id: numeric })
    if (record) {
      console.log('cache hit for id:', id)
      return record.data
    }

    console.log('cache miss for id:', id, '- fetching from PokeAPI')
    const res = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${numeric}`)
    const data = res.data

    await Pokemon.findOneAndUpdate(
      { id: data.id },
      { id: data.id, name: data.name, data },
      { upsert: true, setDefaultsOnInsert: true }
    )

    return data
  } catch (err) {
    console.error('getPokemonById error for', id, err.message)
    throw err
  }
}

async function searchPokemons(query) {
  try {
    const regex = new RegExp(query, 'i')
    const records = await Pokemon.find({ name: regex })
    if (records.length) {
      console.log('search cache hits for', query)
      return records.map(r => r.data)
    }

    console.log('search cache miss for', query, '- falling back to PokeAPI master list')
    const res = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon?limit=1000')
    const all = res.data.results
    const filtered = all.filter(p => regex.test(p.name))
    const list = filtered.slice(0, 20)
    return Promise.all(list.map(p => getPokemonByName(p.name)))
  } catch (err) {
    console.error('searchPokemons error for', query, err.message)
    throw err
  }
}

module.exports = { getPokemonByName, getPokemonById, searchPokemons }
