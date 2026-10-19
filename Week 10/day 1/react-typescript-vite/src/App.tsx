import { useState } from 'react'
import Counter from './Counter'
import Greeting from './Greeting'
import UserCard from './UserCard'
import UserList from './UserList'
import './Lab.css'

function App() {
  const [activeExercise, setActiveExercise] = useState<ExerciseId>('welcome')

  const exercises: { id: ExerciseId; number: string; title: string }[] = [
    { id: 'greeting', number: '01', title: 'Typed props' },
    { id: 'counter', number: '02', title: 'State with types' },
    { id: 'user-card', number: '03', title: 'Optional props' },
    { id: 'user-list', number: '04', title: 'Effects & data' },
  ]

  const activeTitle = exercises.find(({ id }) => id === activeExercise)?.title

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" onClick={() => setActiveExercise('welcome')}>
          <span className="wordmark-mark">TS</span>
          <span>React lab</span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> WEEK 10 <span>/</span> DAY 01</div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Exercise navigation">
          <p className="sidebar-label">TODAY'S EXERCISES</p>
          <button
            type="button"
            className={`nav-item ${activeExercise === 'welcome' ? 'is-active' : ''}`}
            aria-current={activeExercise === 'welcome' ? 'page' : undefined}
            onClick={() => setActiveExercise('welcome')}
          >
            <span className="nav-number">00</span><span>Welcome</span>
          </button>
          {exercises.map(({ id, number, title }) => (
            <button
              key={id}
              type="button"
              className={`nav-item ${activeExercise === id ? 'is-active' : ''}`}
              aria-current={activeExercise === id ? 'page' : undefined}
              onClick={() => setActiveExercise(id)}
            >
              <span className="nav-number">{number}</span><span>{title}</span>
            </button>
          ))}
          <div className="sidebar-progress">
            <span className="progress-label">PROGRESS</span>
            <div className="progress-track"><span style={{ width: activeExercise === 'welcome' ? '0%' : '25%' }} /></div>
            <span className="progress-copy">{activeExercise === 'welcome' ? 'Ready when you are' : 'One lab at a time'}</span>
          </div>
        </aside>

        <main className="main-content">
          {activeExercise === 'welcome' ? (
            <section className="welcome-view" id="home">
              <div className="welcome-kicker"><span className="kicker-line" /> FRONTEND FOUNDATIONS <span className="kicker-line" /></div>
              <div className="brand-lockup" aria-label="Vite and React">
                <span className="brand-name brand-vite">Vite</span>
                <span className="brand-plus">+</span>
                <span className="brand-name brand-react">React</span>
              </div>
              <p className="welcome-type">with TypeScript</p>
              <h1>Make your components<br />say what they mean.</h1>
              <p className="welcome-copy">Four small labs. Real props, state, optional values, and API data. Start anywhere and see each pattern in action.</p>
              <button className="primary-button" type="button" onClick={() => setActiveExercise('greeting')}>
                Open the first lab <span aria-hidden="true">→</span>
              </button>
              <div className="welcome-footer">
                <span>REACT 19</span><span className="footer-divider" /><span>TYPESCRIPT</span><span className="footer-divider" /><span>VITE</span>
              </div>
            </section>
          ) : (
            <section className="exercise-view" aria-live="polite">
              <div className="exercise-heading">
                <div>
                  <p className="eyebrow">WEEK 10 <span>/</span> DAY 01 <span>/</span> {activeExercise === 'user-list' ? '04' : exercises.find(({ id }) => id === activeExercise)?.number}</p>
                  <h1>{activeTitle}</h1>
                </div>
                <button className="back-button" type="button" onClick={() => setActiveExercise('welcome')}>All exercises</button>
              </div>
              {activeExercise === 'greeting' && <Greeting name="Sam" messageCount={3} />}
              {activeExercise === 'counter' && <Counter />}
              {activeExercise === 'user-card' && (
                <div className="component-stack">
                  <p className="section-intro">Omit any value to see its default. Each card uses the same optional prop type.</p>
                  <div className="user-card-grid">
                    <UserCard name="Avery Chen" age={26} role="Designer" />
                    <UserCard name="Jordan Lee" />
                    <UserCard role="Mentor" age={34} />
                  </div>
                </div>
              )}
              {activeExercise === 'user-list' && <UserList />}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

type ExerciseId = 'welcome' | 'greeting' | 'counter' | 'user-card' | 'user-list'

export default App
