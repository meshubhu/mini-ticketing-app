import React from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="search"
      className="form-control"
      placeholder="Search tickets by title or description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search tickets"
    />
  )
}

export default SearchBar
