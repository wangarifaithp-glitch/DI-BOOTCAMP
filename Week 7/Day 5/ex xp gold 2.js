import { createElement as h, useState } from 'react'

function Forms() {
	const [username, setUsername] = useState('')
	const [age, setAge] = useState(null)
	const [errormessage, setErrorMessage] = useState('')
	const [message, setMessage] = useState('Hello! I am learning React forms.')
	const [car, setCar] = useState('Volvo')

	const handleChange = (event) => {
		const { name, value } = event.currentTarget

		if (name === 'username') {
			setUsername(value)
			return
		}

		setAge(value)
		setErrorMessage(value === '' || /^\d+$/.test(value) ? '' : 'Age must be a number.')
	}

	const mySubmitHandler = (event) => {
		event.preventDefault()
		window.alert(username)
	}

	let header = null
	if (username) {
		header = age && !errormessage
			? h('h3', { className: 'form-output' }, `${username} is ${age} years old.`)
			: h('h3', { className: 'form-output' }, `Hello ${username}!`)
	}

	return h('div', { className: 'component-stack' },
		header,
		h('form', { className: 'form-grid', onSubmit: mySubmitHandler },
			h('div', { className: 'field-group' },
				h('label', { className: 'field-label', htmlFor: 'form-username' }, 'Name'),
				h('input', {
					className: 'text-input',
					id: 'form-username',
					name: 'username',
					onChange: handleChange,
					placeholder: 'Your name',
					type: 'text',
					value: username,
				}),
			),
			h('div', { className: 'field-group' },
				h('label', { className: 'field-label', htmlFor: 'form-age' }, 'Age'),
				h('input', {
					className: 'text-input',
					id: 'form-age',
					inputMode: 'numeric',
					name: 'age',
					onChange: handleChange,
					placeholder: 'Your age',
					type: 'text',
					value: age ?? '',
				}),
				errormessage && h('p', { className: 'error-message', role: 'alert' }, errormessage),
			),
			h('button', { className: 'button button-dark form-submit', type: 'submit' }, 'Submit'),
		),
		h('div', { className: 'field-group' },
			h('label', { className: 'field-label', htmlFor: 'form-message' }, 'Message'),
			h('textarea', {
				className: 'text-input textarea-input',
				id: 'form-message',
				onChange: (event) => setMessage(event.currentTarget.value),
				value: message,
			}),
		),
		h('div', { className: 'field-group' },
			h('label', { className: 'field-label', htmlFor: 'form-car' }, 'Car brand'),
			h('select', {
				className: 'text-input select-input',
				id: 'form-car',
				onChange: (event) => setCar(event.currentTarget.value),
				value: car,
			},
			h('option', { value: 'Volvo' }, 'Volvo'),
			h('option', { value: 'BMW' }, 'BMW'),
			h('option', { value: 'Ford' }, 'Ford')),
		),
	)
}

export default Forms