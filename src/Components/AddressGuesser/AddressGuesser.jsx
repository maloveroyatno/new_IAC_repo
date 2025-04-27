import React, { useState, useRef, useEffect } from 'react';
import './AddressGuesser.css';

const AddressGuesser = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
        setShowNoResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    if (address.length < 2) {
      setShowNoResults(true);
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setShowNoResults(false);
    try {
      const res = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      const list = data.suggestions || [];
      setSuggestions(list);
      if (list.length === 0) setShowNoResults(true);
    } catch (err) {
      console.error('Ошибка при получении подсказок:', err);
      setSuggestions([]);
      setShowNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = e => {
    setAddress(e.target.value);
    setSuggestions([]);
    setShowNoResults(false);
  };

  const handleSelect = suggestion => {
    setAddress(suggestion.matched_address);
    setSelected(suggestion);
    setSuggestions([]);
    setShowNoResults(false);
  };

  const clearSelection = () => {
    setSelected(null);
    setAddress('');
    setSuggestions([]);
    setShowNoResults(false);
  };

  return (
    <div className="address-guesser" ref={wrapperRef}>
      <div
        className="input-wrapper"
        style={{ display: 'flex', alignItems: 'center', gap: '8px'}}
      >
        <input
          type="text"
          value={address}
          onChange={handleInputChange}
          placeholder="Enter address..."
          className="address-input"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={fetchSuggestions}
          className="search-btn"
          disabled={isLoading || address.length < 2}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {selected && (
        <div
          className="result-container"
          style={{ marginTop: '4px' }}
        >
          <button className="clear-btn" onClick={clearSelection}>×</button>
          <table className="result-table">
            <tbody>
              <tr>
                <th>Last selected address:</th>
                <td>{selected.matched_address}</td>
              </tr>
              <tr>
                <th>Score:</th>
                <td>{selected.score.toFixed(3)}</td>
              </tr>
              <tr>
                <th>ID:</th>
                <td>{selected.matched_id}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {(suggestions.length > 0 || showNoResults) && (
        <ul
          className="suggestions"
          style={{ marginTop: '4px', padding: '0', listStyle: 'none' }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, idx) => (
              <li
                key={idx}
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelect(s)}
              >
                {s.matched_address}
              </li>
            ))
          ) : (
            <li className="no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AddressGuesser;
