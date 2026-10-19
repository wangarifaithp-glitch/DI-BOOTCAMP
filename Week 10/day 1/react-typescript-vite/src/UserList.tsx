import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  company: {
    name: string
  }
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState<number>(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed (${response.status}). Please try again.`)
        }

        const data: User[] = await response.json()
        setUsers(data)
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === 'AbortError') {
          return
        }

        setError(caughtError instanceof Error ? caughtError.message : 'An unexpected error occurred.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadUsers()

    return () => controller.abort()
  }, [reloadKey])

  return (
    <section className="example-panel user-list-panel" aria-label="User list from API">
      <div className="list-heading">
        <div>
          <p className="panel-label">JSONPLACEHOLDER API</p>
          <h2>Team directory</h2>
        </div>
        {!isLoading && !error && <span className="result-count">{users.length} users</span>}
      </div>

      {isLoading && <p className="loading-state" role="status">Loading people...</p>}
      {error && (
        <div className="error-state" role="alert">
          <p>{error}</p>
          <button className="retry-button" type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
        </div>
      )}
      {!isLoading && !error && (
        <ul className="user-list">
          {users.map((user) => (
            <li className="user-row" key={user.id}>
              <div className="avatar avatar-small" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</div>
              <div className="user-row-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <span className="company-name">{user.company.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UserList