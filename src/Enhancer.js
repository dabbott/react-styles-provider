import React, { Component, PropTypes } from 'react'
// import memoize from 'fast-memoize'
import equal from 'shallowequal'

import resolve from './resolve'

const defaultOptions = {
  withRef: false,
}

export default (stylesCreator, options) => {

  options = options ? {...defaultOptions, ...options} : defaultOptions

  const createStyles = params => resolve(stylesCreator, params)

  return (WrappedComponent) => class extends Component {

    static contextTypes = {
      theme: PropTypes.object,
    }

    constructor(props, context) {
      super()

      this.state = this.buildState(props, context)
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (
        nextContext.theme !== this.context.theme ||
        !equal(nextProps, this.props)
      ) {
        this.setState(this.buildState(nextProps, nextContext))
      }

      // Update all styles on HMR regardless of theme change
      if (module.hot) {
        this.setState(this.buildState(nextProps, nextContext))
      }
    }

    buildState(props, context) {
      const getStyles = this.buildStyles.bind(this, props, context)

      return {styles: getStyles(), getStyles}
    }

    buildStyles(props, context, custom = null) {
      const {theme} = context

      // TODO Handle getDefaultProps() for classic React?
      const defaultProps = WrappedComponent.defaultProps
      const mergedProps = {...defaultProps, ...props}

      return createStyles({props: mergedProps, theme, ...custom})
    }

    getWrappedInstance() {
      return this.refs.wrappedInstance
    }

    render() {
      const {styles, getStyles} = this.state

      const element = (
        <WrappedComponent
          styles={styles}
          getStyles={getStyles}
          {...this.props}
        />
      )

      if (options.withRef) {
        return React.cloneElement(element, {ref: 'wrappedInstance'})
      } else {
        return element
      }
    }
  }
}
