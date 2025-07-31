import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [term, setTerm] = useState('')
  const navigate = useNavigate()

  const onSubmit = e => {
    e.preventDefault()
    if (!term.trim()) return
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
  }

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        className="search-input"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Search Pokémon by name"
        aria-label="Search Pokémon"
      />
      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  )
}
