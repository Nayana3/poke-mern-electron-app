import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { typeColors } from '../utils/typeColors'

export default function PokemonCard({ id, small }) {
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get(`/details/${id}`)
      .then(res => setPokemon(res.data))
      .catch(e => setError('failed to load'))
  }, [id])

  if (error)
    return (
      <div className="pokemon-card">
        <div style={{ color: '#f66' }}>Error loading</div>
      </div>
    )

  if (!pokemon)
    return (
      <div className="pokemon-card">
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      </div>
    )

  return (
    <Link to={`/details/${pokemon.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="pokemon-card">
        <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 12, opacity: 0.7 }}>
          #{pokemon.id}
        </div>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h3 style={{ textTransform: 'capitalize', margin: '6px 0 4px' }}>{pokemon.name}</h3>
        <div className="badges">
          {pokemon.types.map(t => (
            <div
              key={t.type.name}
              className="type-badge"
              style={{ background: typeColors[t.type.name] || '#666' }}
            >
              {t.type.name}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
          W: {pokemon.weight} H: {pokemon.height}
        </div>
      </div>
    </Link>
  )
}
