import { useEffect, useState } from 'react'

const scientificKeys = [
  { label: 'sin', input: 'sin(', kind: 'function' },
  { label: 'cos', input: 'cos(', kind: 'function' },
  { label: 'tan', input: 'tan(', kind: 'function' },
  { label: '√', input: 'sqrt(', kind: 'function' },
  { label: 'x²', input: '^2', kind: 'function' },
  { label: 'ln', input: 'ln(', kind: 'function' },
  { label: 'log', input: 'log(', kind: 'function' },
  { label: 'π', input: 'pi', kind: 'function' },
  { label: 'e', input: 'e', kind: 'function' },
  { label: '(', input: '(', kind: 'function' },
  { label: ')', input: ')', kind: 'function' },
  { label: 'xʸ', input: '^', kind: 'function' },
]

const keypad = [
  { label: 'AC', action: 'clear', kind: 'utility' },
  { label: '⌫', action: 'backspace', kind: 'utility' },
  { label: '%', input: '%', kind: 'utility' },
  { label: '÷', input: '/', kind: 'operator' },
  { label: '7', input: '7' },
  { label: '8', input: '8' },
  { label: '9', input: '9' },
  { label: '×', input: '*', kind: 'operator' },
  { label: '4', input: '4' },
  { label: '5', input: '5' },
  { label: '6', input: '6' },
  { label: '−', input: '-', kind: 'operator' },
  { label: '1', input: '1' },
  { label: '2', input: '2' },
  { label: '3', input: '3' },
  { label: '+', input: '+', kind: 'operator' },
  { label: '±', action: 'sign', kind: 'utility' },
  { label: '0', input: '0' },
  { label: '.', input: '.' },
  { label: '=', action: 'equals', kind: 'equals' },
]

function tokenize(source) {
  const tokens = []
  const pattern = /\s*([0-9]+(?:\.[0-9]*)?(?:e[+-]?\d+)?|\.[0-9]+(?:e[+-]?\d+)?|[a-z]+|[()+\-*/^%!])/iy
  let offset = 0

  while (offset < source.length) {
    if (source.slice(offset).trim() === '') break
    pattern.lastIndex = offset
    const match = pattern.exec(source)
    if (!match) throw new Error('Check the expression and try again.')
    tokens.push(match[1].toLowerCase())
    offset = pattern.lastIndex
  }

  return tokens
}

function evaluateExpression(source, degrees) {
  const tokens = tokenize(source)
  let position = 0
  const peek = () => tokens[position]
  const consume = () => tokens[position++]
  const expect = (token) => {
    if (consume() !== token) throw new Error('Check the expression and try again.')
  }

  function parseExpression() {
    let value = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const operator = consume()
      const right = parseTerm()
      value = operator === '+' ? value + right : value - right
    }
    return value
  }

  function parseTerm() {
    let value = parseUnary()
    while (peek() === '*' || peek() === '/') {
      const operator = consume()
      const right = parseUnary()
      if (operator === '/' && right === 0) throw new Error('Cannot divide by zero.')
      value = operator === '*' ? value * right : value / right
    }
    return value
  }

  function parseUnary() {
    if (peek() === '+') {
      consume()
      return parseUnary()
    }
    if (peek() === '-') {
      consume()
      return -parseUnary()
    }
    return parsePower()
  }

  function parsePower() {
    let value = parsePostfix()
    if (peek() === '^') {
      consume()
      value **= parseUnary()
    }
    return value
  }

  function parsePostfix() {
    let value = parsePrimary()
    while (peek() === '%' || peek() === '!') {
      const operator = consume()
      if (operator === '%') {
        value /= 100
      } else {
        if (!Number.isInteger(value) || value < 0 || value > 170) {
          throw new Error('Factorial works with whole numbers from 0 to 170.')
        }
        let factorial = 1
        for (let factor = 2; factor <= value; factor += 1) factorial *= factor
        value = factorial
      }
    }
    return value
  }

  function parsePrimary() {
    const token = consume()
    if (token === undefined) throw new Error('Enter an expression to calculate.')
    if (token === '(') {
      const value = parseExpression()
      expect(')')
      return value
    }

    if (/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(token)) {
      return Number(token)
    }
    if (token === 'pi') return Math.PI
    if (token === 'e') return Math.E

    const functions = {
      sin: (value) => Math.sin(degrees ? value * Math.PI / 180 : value),
      cos: (value) => Math.cos(degrees ? value * Math.PI / 180 : value),
      tan: (value) => Math.tan(degrees ? value * Math.PI / 180 : value),
      sqrt: (value) => Math.sqrt(value),
      ln: (value) => Math.log(value),
      log: (value) => Math.log10(value),
      abs: (value) => Math.abs(value),
    }

    if (token in functions) {
      expect('(')
      const argument = parseExpression()
      expect(')')
      if ((token === 'sqrt' || token === 'ln' || token === 'log') && argument < 0) {
        throw new Error('This function needs a non-negative value.')
      }
      if ((token === 'ln' || token === 'log') && argument === 0) {
        throw new Error('Logarithm is undefined at zero.')
      }
      return functions[token](argument)
    }

    throw new Error('Check the expression and try again.')
  }

  if (tokens.length === 0) throw new Error('Enter an expression to calculate.')
  const result = parseExpression()
  if (position !== tokens.length) throw new Error('Check the expression and try again.')
  if (!Number.isFinite(result)) throw new Error('The result is outside the supported number range.')
  return Object.is(result, -0) ? 0 : result
}

function formatNumber(value) {
  if (value === null || value === undefined) return ''
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return value.toLocaleString('en-US')
  return Number(value.toPrecision(11)).toLocaleString('en-US', { maximumFractionDigits: 10 })
}

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [degrees, setDegrees] = useState(true)
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  function calculate() {
    try {
      const value = evaluateExpression(expression, degrees)
      setResult(value)
      setError('')
      setHistory((items) => [
        { expression, result: value, id: `${Date.now()}-${Math.random()}` },
        ...items,
      ].slice(0, 8))
    } catch (calculationError) {
      setResult(null)
      setError(calculationError.message)
    }
  }

  function insert(value) {
    setExpression((current) => `${current}${value}`)
    setResult(null)
    setError('')
  }

  function clear() {
    setExpression('')
    setResult(null)
    setError('')
  }

  function backspace() {
    setExpression((current) => current.slice(0, -1))
    setResult(null)
    setError('')
  }

  function toggleSign() {
    setExpression((current) => {
      if (!current) return '-'
      if (/^-?\d*\.?\d+$/.test(current)) {
        return current.startsWith('-') ? current.slice(1) : `-${current}`
      }
      return `-(${current})`
    })
    setResult(null)
    setError('')
  }

  function pressKey(key) {
    if (/^[0-9.]$/.test(key)) {
      insert(key)
    } else if ('+-*/^()%!'.includes(key)) {
      insert(key)
    } else if (key === 'Enter' || key === '=') {
      calculate()
    } else if (key === 'Backspace') {
      backspace()
    } else if (key === 'Escape' || key === 'Delete') {
      clear()
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (/^[0-9.]$/.test(event.key) || '+-*/^()%!'.includes(event.key)) {
        event.preventDefault()
        pressKey(event.key)
      } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault()
        calculate()
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        backspace()
      } else if (event.key === 'Escape' || event.key === 'Delete') {
        if (event.key === 'Escape' && historyOpen) setHistoryOpen(false)
        else clear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  function handleDisplayChange(event) {
    const next = event.currentTarget.value.replace(/[^0-9a-zA-Z.+\-*/^()%!\s]/g, '')
    setExpression(next)
    setResult(null)
    setError('')
  }

  function handleButton(button) {
    if (button.action === 'clear') clear()
    else if (button.action === 'backspace') backspace()
    else if (button.action === 'sign') toggleSign()
    else if (button.action === 'equals') calculate()
    else insert(button.input)
  }

  function recall(item) {
    setExpression(item.expression)
    setResult(item.result)
    setError('')
    setHistoryOpen(false)
  }

  return (
    <main className="app-frame">
      <section className="calculator" aria-label="Calculator">
        <header className="app-header">
          <div className="app-brand">
            <span className="brand-icon" aria-hidden="true">ƒx</span>
            <div>
              <p className="brand-name">CALCULATOR</p>
              <p className="brand-caption">Precision at your fingertips</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="header-button angle-button"
              type="button"
              onClick={() => setDegrees((current) => !current)}
              aria-label={`Angle unit: ${degrees ? 'degrees' : 'radians'}. Click to change.`}
              title="Switch angle units"
            >
              {degrees ? 'DEG' : 'RAD'}
            </button>
            <button
              className={`header-button history-toggle${historyOpen ? ' selected' : ''}`}
              type="button"
              onClick={() => setHistoryOpen((open) => !open)}
              aria-label={historyOpen ? 'Close history' : 'Open history'}
              aria-pressed={historyOpen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 11a8.5 8.5 0 1 1 2.1 5.7M3.5 5v6h6" />
                <path d="M12 7v5l3.2 2" />
              </svg>
            </button>
          </div>
        </header>

        <section className="display" aria-label="Calculator display">
          <label className="visually-hidden" htmlFor="expression-display">Expression</label>
          <input
            id="expression-display"
            className="expression-display"
            value={expression}
            onChange={handleDisplayChange}
            placeholder="0"
            autoComplete="off"
            spellCheck="false"
            aria-describedby={error ? 'calculation-error' : undefined}
          />
          {error ? (
            <p className="display-error" id="calculation-error" role="alert">{error}</p>
          ) : (
            <p className={`result-display${result !== null ? ' has-result' : ''}`} aria-live="polite">
              {result !== null ? `= ${formatNumber(result)}` : ' '}
            </p>
          )}
        </section>

        <div className="keypad-area">
          <section className="scientific-pad" aria-label="Scientific functions">
            {scientificKeys.map((key) => (
              <button
                className="key scientific-key"
                key={key.label}
                type="button"
                onClick={() => insert(key.input)}
              >
                {key.label}
              </button>
            ))}
          </section>

          <section className="number-pad" aria-label="Calculator keypad">
            {keypad.map((button) => (
              <button
                className={`key${button.kind ? ` ${button.kind}-key` : ''}${button.action === 'equals' ? ' equals-key' : ''}`}
                key={button.label}
                type="button"
                onClick={() => handleButton(button)}
                aria-label={
                  button.action === 'clear' ? 'Clear all' :
                    button.action === 'backspace' ? 'Backspace' :
                      button.action === 'equals' ? 'Calculate' :
                        button.label === '±' ? 'Change sign' : button.label
                }
              >
                {button.label}
              </button>
            ))}
          </section>
        </div>

        <footer className="calculator-footer">
          <span>Keyboard supported</span>
          <span className="keyboard-shortcut"><kbd>Enter</kbd> to calculate</span>
        </footer>
      </section>

      {historyOpen && (
        <>
          <button
            className="history-backdrop"
            type="button"
            aria-label="Close history"
            onClick={() => setHistoryOpen(false)}
          />
          <aside className="history-panel" aria-label="Calculation history">
            <div className="history-heading">
              <div>
                <p className="history-eyebrow">YOUR WORK</p>
                <h2>History</h2>
              </div>
              <button
                type="button"
                className="close-history"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
              >
                ×
              </button>
            </div>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((item) => (
                  <button
                    className="history-item"
                    key={item.id}
                    type="button"
                    onClick={() => recall(item)}
                  >
                    <span>{item.expression}</span>
                    <strong>{formatNumber(item.result)}</strong>
                  </button>
                ))}
                <button className="clear-history" type="button" onClick={() => setHistory([])}>
                  Clear history
                </button>
              </div>
            ) : (
              <p className="history-empty">Your calculations will appear here.</p>
            )}
          </aside>
        </>
      )}
    </main>
  )
}

export default App
