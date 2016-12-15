import { Component, createElement } from 'react'

export default (propName = 'window') => WrappedComponent =>
  class WindowDimensionsEnhancer extends Component {

    state = {
      [propName]: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    }

    // TODO throttle, with delay as param?
    onResize = () => {
      this.setState({
        [propName]: {
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
      return createElement(WrappedComponent, {
        [propName]: this.state[propName],
        ...this.props,
      })
    }
  }
