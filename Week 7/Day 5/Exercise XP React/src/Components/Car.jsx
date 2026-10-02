import { useState } from 'react'
import Garage from './Garage.jsx'

function Car({ carInfo }) {
  const [color] = useState('red')

  return (
    <div className="component-stack">
      <p className="result-line">This car is <strong>{color} {carInfo.model}</strong>.</p>
      <Garage size="small" />
    </div>
  )
}

export default Car