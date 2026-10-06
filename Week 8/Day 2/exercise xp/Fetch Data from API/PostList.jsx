import { Component } from 'react'

class PostList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      errorMsg: '',
    }
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`)
        }

        return response.json()
      })
      .then((posts) => {
        this.setState({ posts })
      })
      .catch((error) => {
        console.error('Unable to fetch posts:', error)
        this.setState({ errorMsg: 'Unable to load posts. Please try again later.' })
      })
  }

  render() {
    const { posts, errorMsg } = this.state

    return (
      <section className="content-card">
        <h2>Posts from API</h2>
        {errorMsg && <p className="text-danger" role="alert">{errorMsg}</p>}
        {posts.length > 0 && (
          <div className="api-post-list">
            {posts.map((post) => (
              <article className="api-post" key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }
}

export default PostList
