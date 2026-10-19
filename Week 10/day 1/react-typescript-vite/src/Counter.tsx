import { useState } from 'react'

type CounterAction = 'incremented' | 'decremented' | 'not changed yet'

function Counter() {
  const [count, setCount] = useState<number>(0)
  const [lastAction, setLastAction] = useState<CounterAction>('not changed yet')

  function increment() {
    setCount((currentCount) => currentCount + 1)
    setLastAction('incremented')
  }

  function decrement() {
    setCount((currentCount) => currentCount - 1)
    setLastAction('decremented')
  }

  return (
    <section className="example-panel counter-panel" aria-label="Counter example">
      <p className="panel-label">LIVE STATE</p>
      <div className="counter-value" aria-live="polite">{count}</div>
      <div className="counter-controls">
        <button className="step-button step-down" type="button" onClick={decrement} aria-label="Decrement counter">−</button>
        <button className="step-button step-up" type="button" onClick={increment} aria-label="Increment counter">+</button>
      </div>
      <p className="action-note">Last action <strong>{lastAction}</strong></p>
    </section>
  )
}

export default Counter