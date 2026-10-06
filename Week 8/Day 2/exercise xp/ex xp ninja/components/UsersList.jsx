import { Component } from 'react'

class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      errorMsg: '',
    }
  }

  componentDidMount() {
    fetch('/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`)
        }

        return response.json()
      })
      .then((users) => {
        this.setState({ users })
      })
      .catch((error) => {
        console.error('Unable to fetch backend users:', error)
        this.setState({ errorMsg: 'Unable to load users from the Express backend.' })
      })
  }

  render() {
    const { users, errorMsg } = this.state

    return (
      <section className="content-card">
        <h2>Users from Express</h2>
        {errorMsg && <p className="text-danger" role="alert">{errorMsg}</p>}
        {users.length > 0 && (
          <ul className="api-user-list">
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}

export default UsersList
