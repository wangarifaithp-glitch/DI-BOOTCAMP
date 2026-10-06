import { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      helloMessage: '',
      inputValue: '',
      responseMessage: '',
      errorMessage: '',
      isSending: false,
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/hello')
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const data = await response.json()
      this.setState({ helloMessage: data.message })
    } catch (error) {
      console.error('Unable to load the hello message:', error)
      this.setState({ errorMessage: 'Unable to connect to the Express server.' })
    }
  }

  handleChange = (event) => {
    this.setState({
      inputValue: event.target.value,
      responseMessage: '',
      errorMessage: '',
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ isSending: true, errorMessage: '', responseMessage: '' })

    try {
      const response = await fetch('/api/world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: this.state.inputValue }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const data = await response.json()
      this.setState({ responseMessage: data.message })
    } catch (error) {
      console.error('Unable to send the message:', error)
      this.setState({ errorMessage: 'Unable to send the message to the Express server.' })
    } finally {
      this.setState({ isSending: false })
    }
  }

  render() {
    const { helloMessage, inputValue, responseMessage, errorMessage, isSending } = this.state

    return (
      <main className="page-shell">
        <section className="message-card">
          <p className="eyebrow">Express + React</p>
          <h1>{helloMessage || 'Connecting to Express…'}</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="message">Message to send</label>
            <input
              id="message"
              name="message"
              type="text"
              value={inputValue}
              onChange={this.handleChange}
              placeholder="Type a message"
              required
            />
            <button type="submit" disabled={isSending}>
              {isSending ? 'Sending…' : 'Send to server'}
            </button>
          </form>
          {responseMessage && <p className="response-message" role="status">{responseMessage}</p>}
          {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
        </section>
      </main>
    )
  }
}

export default App
