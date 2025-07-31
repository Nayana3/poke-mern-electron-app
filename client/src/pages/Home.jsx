import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'

export default function Home() {
  const [randomId, setRandomId] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (localStorage.getItem('seedDate') !== today) {
      const id = Math.floor(Math.random() * 898) + 1
      localStorage.setItem('seedDate', today)
      localStorage.setItem('seedPokemon', id)
      setRandomId(id)
    } else {
      setRandomId(localStorage.getItem('seedPokemon'))
    }
  }, [])

  return (
    <div className="container">
      <h1>Pokédex</h1>
      <SearchBar />
      <div className="section">
        <div style={{ marginBottom: 6, fontSize: 14, color: 'var(--muted)' }}>
          Featured Pokémon of the day
        </div>
        {randomId ? <PokemonCard id={randomId} /> : <div>Loading featured Pokémon...</div>}
      </div>
    </div>
  )
}
