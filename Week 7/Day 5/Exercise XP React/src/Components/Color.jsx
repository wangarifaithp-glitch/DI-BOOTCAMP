import { useEffect, useState } from 'react'

function Color() {
  const [favoriteColor, setFavoriteColor] = useState('red')

  useEffect(() => {
    window.alert('useEffect reached')
  }, [])

  const changeColor = () => setFavoriteColor('blue')

  return (
    <div className="component-stack">
      <p className="result-line">My favorite color is <strong className={`color-value color-${favoriteColor}`}>{favoriteColor}</strong>.</p>
      <button className="button button-dark" onClick={changeColor}>Change color to blue</button>
    </div>
  )
}

export default Color