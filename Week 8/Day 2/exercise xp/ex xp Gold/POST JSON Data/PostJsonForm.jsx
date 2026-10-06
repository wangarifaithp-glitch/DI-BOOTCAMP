import { Component } from 'react'

class PostJsonForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      email: '',
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { user, email } = this.state

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, email }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const postedData = await response.json()
      console.log('Posted user data:', postedData)
    } catch (error) {
      console.error('Unable to post user data:', error)
    }
  }

  render() {
    const { user, email } = this.state

    return (
      <section className="content-card">
        <h2>POST User Data</h2>
        <form className="row g-3" onSubmit={this.handleSubmit}>
          <div className="col-12">
            <label className="form-label" htmlFor="post-user">User</label>
            <input
              className="form-control"
              id="post-user"
              name="user"
              type="text"
              placeholder="Enter a username"
              value={user}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="post-email">Email</label>
            <input
              className="form-control"
              id="post-email"
              name="email"
              type="email"
              placeholder="Enter an email address"
              value={email}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="col-12">
            <button className="btn btn-dark" type="submit">Submit</button>
          </div>
        </form>
      </section>
    )
  }
}

export default PostJsonForm
