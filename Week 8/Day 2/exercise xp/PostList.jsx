import posts from './posts.json'

function PostList() {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}

export default PostList
