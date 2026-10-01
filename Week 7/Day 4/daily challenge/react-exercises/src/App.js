import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './App.css'
import Exercise from './Exercise3.js'
import UserFavoriteAnimals from './UserFavoriteAnimals.js'

const user = {
  firstName: 'Bob',
  lastName: 'Dylan',
  favAnimals: ['Horse', 'Turtle', 'Elephant', 'Monkey'],
}

const destinations = [
  {
    name: 'Hong Kong',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg',
  },
  {
    name: 'Macao',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/c1cklkyp6ms02tougufx.webp',
  },
  {
    name: 'Japan',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/e8fnw35p6zgusq218foj.webp',
  },
  {
    name: 'Las Vegas',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/liw377az16sxmp9a6ylg.webp',
  },
]

function App() {
  const myelement = <h1 className="jsx-heading">I Love JSX!</h1>
  const sum = 5 + 5

  return (
    <React.Fragment>
      <main className="xp-page">
        <header className="page-header">
          <p className="eyebrow">React fundamentals</p>
          <h1>Exercises XP</h1>
          <p>JSX, props, class components, and styling in React.</p>
        </header>

        <section className="exercise-section" aria-labelledby="exercise-one">
          <div className="section-label">
            <span>01</span>
            <h2 id="exercise-one">JSX</h2>
          </div>
          <div className="exercise-content">
            <p>Hello World!</p>
            {myelement}
            <p>React is {sum} times better with JSX</p>
          </div>
        </section>

        <section className="exercise-section" aria-labelledby="exercise-two">
          <div className="section-label">
            <span>02</span>
            <h2 id="exercise-two">Objects and props</h2>
          </div>
          <div className="exercise-content user-content">
            <div>
              <h3>{user.firstName}</h3>
              <h3>{user.lastName}</h3>
            </div>
            <UserFavoriteAnimals favAnimals={user.favAnimals} />
          </div>
        </section>

        <section className="exercise-section" aria-labelledby="exercise-three">
          <div className="section-label">
            <span>03</span>
            <h2 id="exercise-three">HTML tags and styling</h2>
          </div>
          <div className="exercise-content">
            <Exercise />
          </div>
        </section>

        <section className="exercise-section" aria-labelledby="exercise-carousel">
          <div className="section-label">
            <span>04</span>
            <h2 id="exercise-carousel">City carousel</h2>
          </div>
          <div className="exercise-content">
            <Carousel
              className="city-carousel"
              ariaLabel="Featured destinations"
              autoPlay
              infiniteLoop
              interval={5000}
              showStatus={false}
              showThumbs={false}
              useKeyboardArrows
              swipeable
            >
              {destinations.map((destination) => (
                <div key={destination.name}>
                  <img src={destination.image} alt={destination.name} />
                  <p className="legend">{destination.name}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}

export default App