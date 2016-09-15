import React, { Component, PropTypes } from 'react'
import memoize from 'fast-memoize'

export default (stylesCreator, selector) => {

  const createStyles = memoize(stylesCreator)

  return (WrappedComponent) => class extends Component {

    static contextTypes = {
      theme: PropTypes.object,
    }

    constructor(props, context) {
      super()
      this.state = this.mapContextToState(props, context)
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (nextContext.theme !== this.context.theme) {
        this.setState(this.mapContextToState(nextProps, nextContext))
      }

      // Update all styles on HMR regardless of theme change
      if (module.hot) {
        this.setState(this.mapContextToState(nextProps, nextContext))
      }
    }

    mapContextToState(props, context) {
      const {theme} = context

      if (typeof selector === 'function') {
        return {styles: createStyles(theme, selector(this))}
      } else {
        return {styles: createStyles(theme)}
      }
    }

    render() {
      const {styles} = this.state

      return (
        <WrappedComponent styles={styles} {...this.props} />
      )
    }
  }
}
