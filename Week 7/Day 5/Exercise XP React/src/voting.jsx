import { createRoot } from 'react-dom/client'
import VotingApp from '../../daily challenge ;voting app'
import './styles.css'
import './voting.css'

function VotingPage() {
  return (
    <main className="voting-page">
      <header className="voting-heading">
        <p className="eyebrow">Developer poll</p>
        <h1>Which language<br /><span>gets your vote?</span></h1>
      </header>
      <section className="voting-board" aria-label="Programming language votes">
        <div className="voting-labels" aria-hidden="true">
          <span>Language</span>
          <span>Votes</span>
          <span></span>
        </div>
        <VotingApp />
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<VotingPage />)