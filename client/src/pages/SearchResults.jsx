import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'
import api from '../utils/api'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    api
      .get(`/search?name=${query}`)
      .then(res => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="container">
      <h2>Results for {query}</h2>
      {loading && <div>Searching...</div>}
      {!loading && !results.length && <div>No matches found.</div>}
      <div className="grid">
        {results.map(p => (
          <PokemonCard key={p.id} id={p.id} small />
        ))}
      </div>
    </div>
  )
}
