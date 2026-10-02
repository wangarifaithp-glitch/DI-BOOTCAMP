import { useState } from 'react'

function Phone() {
  const [phone, setPhone] = useState({
    brand: 'Samsung',
    model: 'Galaxy S20',
    color: 'black',
    year: 2020,
  })

  const changeColor = () => {
    setPhone((currentPhone) => ({ ...currentPhone, color: 'blue' }))
  }

  return (
    <div className="component-stack">
      <p className="result-line">My {phone.brand} {phone.model} is {phone.color} and was released in {phone.year}.</p>
      <button className="button button-dark" onClick={changeColor}>Change color to blue</button>
    </div>
  )
}

export default Phone