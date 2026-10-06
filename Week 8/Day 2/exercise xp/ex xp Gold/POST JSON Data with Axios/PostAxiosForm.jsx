import { Component } from 'react'
import axios from 'axios'

class PostAxiosForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      title: '',
      body: '',
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { userId, title, body } = this.state

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        userId,
        title,
        body,
      })

      console.log('Posted post data:', response.data)
    } catch (error) {
      console.error('Unable to post data with Axios:', error)
    }
  }

  render() {
    const { userId, title, body } = this.state

    return (
      <section className="content-card">
        <h2>POST with Axios</h2>
        <form className="row g-3" onSubmit={this.handleSubmit}>
          <div className="col-12">
            <label className="form-label" htmlFor="axios-user-id">User ID</label>
            <input
              className="form-control"
              id="axios-user-id"
              type="number"
              min="1"
              placeholder="Enter a user ID"
              name="userId"
              value={userId}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="axios-title">Title</label>
            <input
              className="form-control"
              id="axios-title"
              type="text"
              placeholder="Enter a title"
              name="title"
              value={title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="axios-body">Body</label>
            <textarea
              className="form-control"
              id="axios-body"
              placeholder="Enter the post body"
              name="body"
              value={body}
              onChange={this.handleChange}
              required
              rows="4"
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

export default PostAxiosForm
