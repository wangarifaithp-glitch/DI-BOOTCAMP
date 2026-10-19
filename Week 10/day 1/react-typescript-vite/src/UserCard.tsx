interface UserCardProps {
  name?: string
  age?: number
  role?: string
}

function UserCard({ name = 'Guest', age, role = 'Community member' }: UserCardProps) {
  return (
    <article className="user-card">
      <div className="avatar" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</div>
      <div className="user-card-details">
        <h2>{name}</h2>
        <p>{age === undefined ? 'Age not specified' : `${age} years old`}</p>
        <span className="role-label">{role}</span>
      </div>
    </article>
  )
}

export default UserCard