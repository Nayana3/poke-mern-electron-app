import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { typeColors } from '../utils/typeColors'

export default function Details() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/details/${id}`)
      .then(res => setPokemon(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="container">Loading...</div>
  if (!pokemon) return <div className="container">Failed to load Pokémon.</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 160px' }}>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: 160 }} />
          <div className="badges" style={{ justifyContent: 'center', marginTop: 8 }}>
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
        </div>
        <div className="detail-main">
          <h1 style={{ textTransform: 'capitalize' }}>
            {pokemon.name} <span style={{ fontSize: 16, color: 'var(--muted)' }}>#{pokemon.id}</span>
          </h1>

          <div className="section">
            <div className="small-text">Base Stats</div>
            {pokemon.stats.map(s => (
              <div key={s.stat.name} className="stat-row">
                <div style={{ textTransform: 'capitalize', width: 100 }}>{s.stat.name}</div>
                <div style={{ width: 40 }}>{s.base_stat}</div>
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{ width: `${(s.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="small-text">Abilities</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {pokemon.abilities.map(a => (
                <div key={a.ability.name} className="tag">
                  {a.ability.name}
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="small-text">Moves (first 10)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {pokemon.moves.slice(0, 10).map(m => (
                <div key={m.move.name} className="tag">
                  {m.move.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
