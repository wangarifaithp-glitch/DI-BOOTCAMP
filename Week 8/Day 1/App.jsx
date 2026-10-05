import React, { Component } from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import TravelForm from './DailyChallenge.jsx'

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

class Child extends Component {
  componentWillUnmount() {
    window.alert('Child component unmounted')
  }

  render() {
    return <h3 className="child-message">Hello World!</h3>
  }
}

class App extends Component {
  state = {
    favoriteColor: 'red',
    show: true,
  }

  componentDidMount() {
    this.colorTimer = window.setTimeout(() => {
      this.setState({ favoriteColor: 'yellow' })
    }, 2000)
  }

  componentWillUnmount() {
    window.clearTimeout(this.colorTimer)
  }

  shouldComponentUpdate() {
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log('in getSnapshotBeforeUpdate')
    return null
  }

  componentDidUpdate() {
    console.log('after update')
  }

  changeColor = () => {
    this.setState({ favoriteColor: 'blue' })
  }

  deleteChild = () => {
    this.setState({ show: false })
  }

  render() {
    const { favoriteColor, show } = this.state

    return (
      <main className="page-shell">
        <header className="page-heading">
          <p className="eyebrow">Week 8 · Day 1</p>
          <h1>React error boundaries <span>&amp; lifecycle</span></h1>
          <p className="intro">
            See how errors are contained and how class component lifecycle methods run.
          </p>
        </header>

        <div className="exercise-list">
          <section className="exercise" aria-labelledby="boundary-heading">
            <div className="exercise-heading">
              <span className="exercise-number">01</span>
              <div>
                <p className="exercise-kicker">Render errors</p>
                <h2 id="boundary-heading">Error boundaries</h2>
              </div>
            </div>
            <div className="exercise-body">
              <div className="component-stack">
                <p className="exercise-note">
                  Click a counter five times to throw “I crashed!” and compare the boundary scopes.
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
                    This counter is intentionally unprotected. Its error unmounts the whole app.
                  </p>
                  <BuggyCounter label="Unprotected counter" />
                </section>
              </div>
            </div>
          </section>

          <section className="exercise" aria-labelledby="lifecycle-heading">
            <div className="exercise-heading">
              <span className="exercise-number">02</span>
              <div>
                <p className="exercise-kicker">Updating</p>
                <h2 id="lifecycle-heading">Favorite color</h2>
              </div>
            </div>
            <div className="exercise-body">
              <div className="component-stack">
                <p className="result-line">
                  My favorite color is{' '}
                  <strong className={`color-value color-${favoriteColor}`}>{favoriteColor}</strong>.
                </p>
                <button className="button button-dark" onClick={this.changeColor}>
                  Change color to blue
                </button>
                <p className="exercise-note">
                  The color starts red and changes to yellow after mounting. Check the console for
                  update lifecycle logs.
                </p>
              </div>
            </div>
          </section>

          <section className="exercise" aria-labelledby="unmount-heading">
            <div className="exercise-heading">
              <span className="exercise-number">03</span>
              <div>
                <p className="exercise-kicker">Unmounting</p>
                <h2 id="unmount-heading">Remove a child</h2>
              </div>
            </div>
            <div className="exercise-body">
              <div className="component-stack">
                {show && <Child />}
                <button
                  className="button button-dark"
                  onClick={this.deleteChild}
                  disabled={!show}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          <section className="exercise" aria-labelledby="travel-form-heading">
            <div className="exercise-heading">
              <span className="exercise-number">04</span>
              <div>
                <p className="exercise-kicker">Controlled inputs</p>
                <h2 id="travel-form-heading">Travel form challenge</h2>
              </div>
            </div>
            <div className="exercise-body">
              <TravelForm />
            </div>
          </section>
        </div>
        <footer className="page-footer">React class components <span>·</span> Week 8 Day 1</footer>
      </main>
    )
  }
}

export default App
