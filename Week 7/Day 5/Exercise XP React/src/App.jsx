import Car from './Components/Car.jsx'
import Color from './Components/Color.jsx'
import Events from './Components/Events.jsx'
import Forms from '../../ex xp gold 2.js'
import Phone from './Components/Phone.jsx'
import { Clock, Form } from '../../ex xp Ninja.js'
import VotingApp from '../../daily challenge ;voting app'

const carinfo = { name: 'Ford', model: 'Mustang' }

function App() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="intro">Components, events, state, and effects in one app.</p>
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
              <p className="exercise-kicker">Effects + state</p>
              <h2 id="color-heading">Favorite color</h2>
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
      </div>
      <footer className="page-footer">React fundamentals <span>·</span> 8 exercises</footer>
    </main>
  )
}

export default App