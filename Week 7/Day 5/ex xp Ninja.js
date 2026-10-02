import { createElement as h, useEffect, useState } from 'react'

export function Clock() {
	const [currentDate, setCurrentDate] = useState(new Date())

	const tick = () => setCurrentDate(new Date())

	useEffect(() => {
		const timerId = window.setInterval(tick, 1000)
		return () => window.clearInterval(timerId)
	}, [])

	return h('time', {
		className: 'clock-display',
		dateTime: currentDate.toISOString(),
	}, currentDate.toLocaleTimeString())
}

const fieldLabels = {
	firstName: 'First Name',
	lastName: 'Last Name',
	phone: 'Phone',
	email: 'Email',
}

function getFieldError(name, value) {
	const trimmedValue = value.trim()

	if (!trimmedValue) {
		return `${fieldLabels[name]} is required.`
	}

	if (name === 'phone') {
		const digitCount = trimmedValue.replace(/\D/g, '').length
		if (!/^\+?[\d\s().-]+$/.test(trimmedValue) || digitCount < 7 || digitCount > 15) {
			return 'Enter a valid phone number.'
		}
	}

	if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
		return 'Enter a valid email address.'
	}

	return ''
}

export function Input({ name, label, value, error, inputMode, onChange }) {
	const inputId = `validation-${name}`

	return h('div', { className: 'validation-field' },
		h('label', { className: 'field-label', htmlFor: inputId }, label),
		h('input', {
			'aria-describedby': error ? `${inputId}-error` : undefined,
			'aria-invalid': Boolean(error),
			autoComplete: name === 'firstName' ? 'given-name'
				: name === 'lastName' ? 'family-name'
					: name === 'phone' ? 'tel' : 'email',
			className: 'text-input input-control',
			id: inputId,
			inputMode,
			name,
			onChange,
			type: 'text',
			value,
		}),
		error && h('p', { className: 'validation-error', id: `${inputId}-error` }, error),
	)
}

export function Form() {
	const [values, setValues] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
	})
	const [errors, setErrors] = useState({})
	const [submitted, setSubmitted] = useState(false)

	const handleChange = (event) => {
		const { name, value } = event.currentTarget
		setValues((currentValues) => ({ ...currentValues, [name]: value }))
		setSubmitted(false)

		if (Object.hasOwn(errors, name)) {
			setErrors((currentErrors) => ({
				...currentErrors,
				[name]: getFieldError(name, value),
			}))
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const nextErrors = Object.fromEntries(
			Object.entries(values)
				.map(([name, value]) => [name, getFieldError(name, value)])
				.filter(([, error]) => error),
		)

		setErrors(nextErrors)
		setSubmitted(Object.keys(nextErrors).length === 0)
	}

	return h('div', { className: 'component-stack' },
		h('form', { className: 'validation-form', noValidate: true, onSubmit: handleSubmit },
			h(Input, {
				error: errors.firstName,
				label: fieldLabels.firstName,
				name: 'firstName',
				onChange: handleChange,
				value: values.firstName,
			}),
			h(Input, {
				error: errors.lastName,
				label: fieldLabels.lastName,
				name: 'lastName',
				onChange: handleChange,
				value: values.lastName,
			}),
			h(Input, {
				error: errors.phone,
				inputMode: 'tel',
				label: fieldLabels.phone,
				name: 'phone',
				onChange: handleChange,
				value: values.phone,
			}),
			h(Input, {
				error: errors.email,
				inputMode: 'email',
				label: fieldLabels.email,
				name: 'email',
				onChange: handleChange,
				value: values.email,
			}),
			h('button', { className: 'button button-dark form-submit', type: 'submit' }, 'Submit'),
		),
		submitted && h('p', { className: 'form-success', role: 'status' }, 'Form submitted successfully.'),
	)
}
