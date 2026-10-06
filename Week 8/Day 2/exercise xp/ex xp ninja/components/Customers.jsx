import { Component } from 'react'

class Customers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      isLoaded: false,
      errorMsg: '',
    }
  }

  componentDidMount() {
    fetch('/api/customers/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`)
        }

        return response.json()
      })
      .then((customers) => {
        this.setState({ customers, isLoaded: true })
      })
      .catch((error) => {
        console.error('Unable to fetch backend customers:', error)
        this.setState({
          isLoaded: true,
          errorMsg: 'Unable to load customers from the Express backend.',
        })
      })
  }

  render() {
    const { customers, isLoaded, errorMsg } = this.state

    return (
      <section className="content-card">
        <h2>Customers from Express</h2>
        {!isLoaded && <div role="status">Loading…</div>}
        {isLoaded && errorMsg && <p className="text-danger" role="alert">{errorMsg}</p>}
        {isLoaded && !errorMsg && (
          <ul className="api-user-list">
            {customers.map((customer) => (
              <li key={customer.id}>
                <strong>{customer.firstName} {customer.lastName}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}

export default Customers
