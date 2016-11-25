import React, { Component, PropTypes } from 'react'

export default (WrappedComponent) => class WindowDimensionsEnhancer extends Component {

  state = {
    window: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  }

  onResize = () => {
    this.setState({
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    const {window} = this.state

    console.log('render enhancer', window)

    return (
      <WrappedComponent
        window={window}
        {...this.props}
      />
    )
  }
}
