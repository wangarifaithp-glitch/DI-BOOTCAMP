import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import ErrorBoundary from './ErrorBoundary.jsx'
import Example1 from './Example1.jsx'
import Example2 from './Example2.jsx'
import Example3 from './Example3.jsx'
import PostList from './PostList.jsx'
import ApiPostList from './Fetch Data from API/PostList.jsx'
import UsersList from './Fetch Data from API/UsersList.jsx'
import BackendUsersList from './ex xp ninja/components/UsersList.jsx'
import Customers from './ex xp ninja/components/Customers.jsx'
import PostJsonForm from './ex xp Gold/POST JSON Data/PostJsonForm.jsx'
import PostAxiosForm from './ex xp Gold/POST JSON Data with Axios/PostAxiosForm.jsx'

function HomeScreen() {
  return <h1>Home</h1>
}

function ProfileScreen() {
  return <h1>Profile</h1>
}

function ShopScreen() {
  throw new Error('The shop is unavailable.')
}

function PostDataExercise() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [status, setStatus] = useState('')

  async function handlePost(event) {
    event.preventDefault()
    setStatus('Sending request…')

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          key1: 'myusername',
          email: 'mymail@gmail.com',
          name: 'Isaac',
          lastname: 'Doe',
          age: 27,
        }),
      })
      const responseBody = await response.text()

      console.log('Webhook response:', {
        status: response.status,
        body: responseBody,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      setStatus(`Request completed (${response.status}). See the console for the response.`)
    } catch (error) {
      console.error('Unable to send the webhook request:', error)
      setStatus(`Request failed: ${error.message}`)
    }
  }

  return (
    <section className="content-card">
      <h2>Send JSON Data</h2>
      <p className="text-body-secondary">
        Paste your webhook.site unique URL below, enable CORS there, then send the sample JSON.
      </p>
      <form className="row g-3" onSubmit={handlePost}>
        <div className="col-12">
          <label className="form-label" htmlFor="webhook-url">Webhook URL</label>
          <input
            className="form-control"
            id="webhook-url"
            type="url"
            value={webhookUrl}
            onChange={(event) => setWebhookUrl(event.target.value)}
            placeholder="https://webhook.site/your-unique-url"
            required
          />
        </div>
        <div className="col-12">
          <button className="btn btn-dark" type="submit">Send JSON</button>
        </div>
      </form>
      {status && <p className="mt-3 mb-0" role="status">{status}</p>}
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <header className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <nav className="navbar-nav">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
              Home
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/profile">
              Profile
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/shop">
              Shop
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container page-content">
        <section className="route-card" aria-live="polite">
          <Routes>
            <Route path="/" element={<ErrorBoundary><HomeScreen /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><ProfileScreen /></ErrorBoundary>} />
            <Route path="/shop" element={<ErrorBoundary><ShopScreen /></ErrorBoundary>} />
          </Routes>
        </section>

        <section className="content-card">
          <h2>Posts</h2>
          <PostList />
        </section>

        <section className="content-card">
          <h2>JSON Data</h2>
          <div className="example-grid">
            <Example1 />
            <Example2 />
            <Example3 />
          </div>
        </section>

        <ApiPostList />
        <UsersList />
        <BackendUsersList />
        <Customers />
        <PostJsonForm />
        <PostAxiosForm />
        <PostDataExercise />
      </main>
    </BrowserRouter>
  )
}

export default App
