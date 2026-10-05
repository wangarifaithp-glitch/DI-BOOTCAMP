import { Component } from 'react'

class Child extends Component {
  componentWillUnmount() {
    window.alert('Child component unmounted')
  }

  render() {
    return <h3 className="child-message">Hello World!</h3>
  }
}

class Color extends Component {
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
      <div className="component-stack">
        <p className="result-line">
          My favorite color is{' '}
          <strong className={`color-value color-${favoriteColor}`}>{favoriteColor}</strong>.
        </p>
        <div className="control-row">
          <button className="button button-dark" onClick={this.changeColor}>
            Change color to blue
          </button>
          <button className="button button-dark" onClick={this.deleteChild} disabled={!show}>
            Delete
          </button>
        </div>
        {show && <Child />}
      </div>
    )
  }
}

export default Color