import { Component } from 'react'
import Car from './Components/Car.jsx'
import Color from './Components/Color.jsx'
import Events from './Components/Events.jsx'
import Forms from '../../ex xp gold 2.js'
import Phone from './Components/Phone.jsx'
import { Clock, Form } from '../../ex xp Ninja.js'
import VotingApp from '../../daily challenge ;voting app'
import ErrorBoundary from './ErrorBoundary.jsx'

const carinfo = { name: 'Ford', model: 'Mustang' }

class BuggyCounter extends Component {
  state = { counter: 0 }

  handleClick = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }

  render() {
    const { counter } = this.state

    if (counter === 5) {
      throw new Error('I crashed!')
    }

    return (
      <button className="counter-button" onClick={this.handleClick}>
        {this.props.label}: {counter}
      </button>
    )
  }
}

function App() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">React · Exercises XP</p>
        <h1>React <span>Class components</span></h1>
        <p className="intro">Components, state, lifecycle methods, and error boundaries in one app.</p>
      </header>

      <div className="exercise-list">
        <section className="exercise" aria-labelledby="car-heading">
          <div className="exercise-heading">
            <span className="exercise-number">01</span>
            <div>
              <p className="exercise-kicker">Props + components</p>
              <h2 id="car-heading">Car &amp; Garage</h2>
            </div>
          </div>
          <div className="exercise-body"><Car carInfo={carinfo} /></div>
        </section>

        <section className="exercise" aria-labelledby="events-heading">
          <div className="exercise-heading">
            <span className="exercise-number">02</span>
            <div>
              <p className="exercise-kicker">Click + keyboard</p>
              <h2 id="events-heading">Events</h2>
            </div>
          </div>
          <div className="exercise-body"><Events /></div>
        </section>

        <section className="exercise" aria-labelledby="phone-heading">
          <div className="exercise-heading">
            <span className="exercise-number">03</span>
            <div>
              <p className="exercise-kicker">State updates</p>
              <h2 id="phone-heading">Phone</h2>
            </div>
          </div>
          <div className="exercise-body"><Phone /></div>
        </section>

        <section className="exercise" aria-labelledby="color-heading">
          <div className="exercise-heading">
            <span className="exercise-number">04</span>
            <div>
              <p className="exercise-kicker">Update + unmounting</p>
              <h2 id="color-heading">Component lifecycle</h2>
            </div>
          </div>
          <div className="exercise-body"><Color /></div>
        </section>

        <section className="exercise" aria-labelledby="forms-heading">
          <div className="exercise-heading">
            <span className="exercise-number">05</span>
            <div>
              <p className="exercise-kicker">Controlled inputs</p>
              <h2 id="forms-heading">Forms</h2>
            </div>
          </div>
          <div className="exercise-body"><Forms /></div>
        </section>

        <section className="exercise" aria-labelledby="clock-heading">
          <div className="exercise-heading">
            <span className="exercise-number">06</span>
            <div>
              <p className="exercise-kicker">Intervals + cleanup</p>
              <h2 id="clock-heading">Local time</h2>
            </div>
          </div>
          <div className="exercise-body"><Clock /></div>
        </section>

        <section className="exercise" aria-labelledby="validation-heading">
          <div className="exercise-heading">
            <span className="exercise-number">07</span>
            <div>
              <p className="exercise-kicker">Custom validation</p>
              <h2 id="validation-heading">Form validation</h2>
            </div>
          </div>
          <div className="exercise-body"><Form /></div>
        </section>

        <section className="exercise" aria-labelledby="voting-heading">
          <div className="exercise-heading">
            <span className="exercise-number">08</span>
            <div>
              <p className="exercise-kicker">State + events</p>
              <h2 id="voting-heading">Language voting</h2>
            </div>
          </div>
          <div className="exercise-body"><VotingApp /></div>
        </section>

        <section className="exercise" aria-labelledby="errors-heading">
          <div className="exercise-heading">
            <span className="exercise-number">09</span>
            <div>
              <p className="exercise-kicker">Render errors</p>
              <h2 id="errors-heading">Error boundaries</h2>
            </div>
          </div>
          <div className="exercise-body">
            <div className="component-stack">
              <p className="exercise-note">
                Click each counter five times to trigger “I crashed!” and compare the boundary scopes.
              </p>
              <section className="simulation" aria-label="Two counters in one error boundary">
                <h3>Simulation 1 · One boundary for both</h3>
                <ErrorBoundary>
                  <div className="control-row">
                    <BuggyCounter label="Counter A" />
                    <BuggyCounter label="Counter B" />
                  </div>
                </ErrorBoundary>
              </section>
              <section className="simulation" aria-label="Each counter has its own error boundary">
                <h3>Simulation 2 · Separate boundaries</h3>
                <div className="control-row">
                  <ErrorBoundary><BuggyCounter label="Counter A" /></ErrorBoundary>
                  <ErrorBoundary><BuggyCounter label="Counter B" /></ErrorBoundary>
                </div>
              </section>
              <section className="simulation" aria-label="Counter without an error boundary">
                <h3>Simulation 3 · No boundary</h3>
                <p className="exercise-note">
                  This intentionally uncaught error unmounts the app. Refresh the page to try again.
                </p>
                <BuggyCounter label="Unprotected counter" />
              </section>
            </div>
          </div>
        </section>
      </div>
      <footer className="page-footer">React fundamentals <span>·</span> 9 exercises</footer>
    </main>
  )
}

export default App