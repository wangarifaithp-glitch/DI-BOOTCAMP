import { Component } from 'react'
import './Exercise.css'

const style_header = {
  color: 'white',
  backgroundColor: 'DodgerBlue',
  padding: '10px',
  fontFamily: 'Arial',
}

class Exercise extends Component {
  render() {
    return (
      <div className="tag-exercise">
        <h1 style={style_header}>Exercise Component Header</h1>
        <p className="para">This is a paragraph formatted with an external CSS file.</p>
        <a href="https://react.dev/" target="_blank" rel="noreferrer">
          Official React Documentation
        </a>
        <form className="sample-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="visitor-name">Enter Name:</label>
          <input id="visitor-name" name="name" type="text" />
          <button type="submit">Submit</button>
        </form>
        <img
          className="landscape-image"
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=960&q=85"
          alt="Mountain lake surrounded by green hills"
        />
        <ul className="tag-list">
          <li>First Item</li>
          <li>Second Item</li>
          <li>Third Item</li>
        </ul>
      </div>
    )
  }
}

export default Exercise