import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger mb-0" role="alert">
          This page could not be displayed. Try another page from the navigation.
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
