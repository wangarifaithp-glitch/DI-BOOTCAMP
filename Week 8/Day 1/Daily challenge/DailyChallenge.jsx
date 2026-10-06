import { Component } from 'react'

const initialFormData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  destination: '',
  lactoseFree: false,
}

class FormComponent extends Component {
  render() {
    const { formData, handleChange } = this.props

    return (
      <section>
        <form method="get">
          <div>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <fieldset>
            <legend>Gender</legend>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </label>
          </fieldset>

          <div>
            <label htmlFor="destination">Destination</label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            >
              <option value="">Choose a destination</option>
              <option value="Japan">Japan</option>
              <option value="Brazil">Brazil</option>
              <option value="Sweden">Sweden</option>
            </select>
          </div>

          <label>
            <input
              type="checkbox"
              name="lactoseFree"
              value="on"
              checked={formData.lactoseFree}
              onChange={handleChange}
            />
            Lactose free
          </label>

          <button type="submit">Submit</button>
        </form>

        <h2>Form values</h2>
        <p>First name: {formData.firstName}</p>
        <p>Last name: {formData.lastName}</p>
        <p>Age: {formData.age}</p>
        <p>Gender: {formData.gender}</p>
        <p>Destination: {formData.destination}</p>
        <p>Lactose free: {formData.lactoseFree ? 'Yes' : 'No'}</p>
      </section>
    )
  }
}

class TravelForm extends Component {
  state = { ...initialFormData }

  handleChange = (event) => {
    const { name, type, value, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value

    this.setState((currentState) => ({
      ...currentState,
      [name]: fieldValue,
    }))
  }

  render() {
    return (
      <div className="component-stack">
        <FormComponent formData={this.state} handleChange={this.handleChange} />
      </div>
    )
  }
}

export default TravelForm
