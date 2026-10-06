import { Component } from 'react'

class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoaded: false,
      errorMsg: '',
    }
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`)
        }

        return response.json()
      })
      .then((users) => {
        this.setState({ users, isLoaded: true })
      })
      .catch((error) => {
        console.error('Unable to fetch users:', error)
        this.setState({
          isLoaded: true,
          errorMsg: 'Unable to load users. Please try again later.',
        })
      })
  }

  render() {
    const { users, isLoaded, errorMsg } = this.state

    return (
      <section className="content-card">
        <h2>Users from API</h2>
        {!isLoaded && <div role="status">Loading…</div>}
        {isLoaded && errorMsg && <p className="text-danger" role="alert">{errorMsg}</p>}
        {isLoaded && !errorMsg && (
          <ul className="api-user-list">
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}

export default UsersList
