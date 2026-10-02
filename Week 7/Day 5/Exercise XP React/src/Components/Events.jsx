import { useState } from 'react'

function Events() {
  const [isToggleOn, setIsToggleOn] = useState(true)

  const clickMe = () => window.alert('I was clicked')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      window.alert(`You typed: ${event.currentTarget.value}`)
    }
  }

  const toggle = () => setIsToggleOn((currentValue) => !currentValue)

  return (
    <div className="component-stack">
      <div className="control-row">
        <button className="button button-dark" onClick={clickMe}>Click me</button>
        <button className="button button-accent" onClick={toggle} aria-pressed={isToggleOn}>
          {isToggleOn ? 'ON' : 'OFF'}
        </button>
      </div>
      <label className="field-label" htmlFor="event-message">Press Enter to send a message</label>
      <input
        className="text-input"
        id="event-message"
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        type="text"
      />
    </div>
  )
}

export default Events