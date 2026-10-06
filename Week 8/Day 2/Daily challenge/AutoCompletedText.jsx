import { Component } from 'react'
import countries from './countries.js'

class AutoCompletedText extends Component {
  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
      text: '',
    }
  }

  handleChange = (event) => {
    const text = event.target.value
    const query = text.trim().toLowerCase()
    const suggestions = query
      ? countries.filter((country) => country.toLowerCase().includes(query))
      : []

    this.setState({ suggestions, text })
  }

  selectCountry = (country) => {
    this.setState({ text: country, suggestions: [] })
  }

  render() {
    const { suggestions, text } = this.state

    return (
      <section className="search-card" aria-labelledby="country-label">
        <label id="country-label" htmlFor="country-search">Country</label>
        <div className="search-control">
          <input
            id="country-search"
            type="text"
            value={text}
            onChange={this.handleChange}
            placeholder="Try typing “can”"
            autoComplete="off"
            aria-controls="country-suggestions"
            aria-expanded={suggestions.length > 0}
          />
          <span className="search-icon" aria-hidden="true">⌕</span>
        </div>
        {suggestions.length > 0 && (
          <ul id="country-suggestions" className="suggestions" aria-label="Country suggestions">
            {suggestions.map((country) => (
              <li key={country}>
                <button type="button" onClick={() => this.selectCountry(country)}>
                  {country}
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="search-hint" aria-live="polite">
          {suggestions.length > 0
            ? `${suggestions.length} ${suggestions.length === 1 ? 'country' : 'countries'} found`
            : countries.includes(text)
              ? `Selected: ${text}`
            : text
              ? 'No matching countries'
              : 'Your selected country will appear here.'}
        </p>
      </section>
    )
  }
}

export default AutoCompletedText
