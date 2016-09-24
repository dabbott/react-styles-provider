import React, { Component, PropTypes } from 'react'
import memoize from 'fast-memoize'
import equal from 'shallowequal'

const defaultOptions = {
  withRef: false,
}

export default (stylesCreator, selector, options) => {

  options = options ? {...defaultOptions, ...options} : defaultOptions

  const createStyles = memoize(stylesCreator)

  return (WrappedComponent) => class extends Component {

    static contextTypes = {
      theme: PropTypes.object,
    }

    constructor(props, context) {
      super()
      this.state = this.mapContextToState(props, context)
      this.selectedData = undefined
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

        // TODO Handle getDefaultProps() for classic React?
        const defaultProps = WrappedComponent.defaultProps

        const selectedData = selector({...defaultProps, ...props})

        if (!equal(this.selectedData, selectedData)) {
          this.selectedData = selectedData
        }

        return {styles: createStyles(theme, this.selectedData)}
      } else {
        return {styles: createStyles(theme)}
      }
    }

    getWrappedInstance() {
      return this.refs.wrappedInstance
    }

    render() {
      const {styles} = this.state

      const element = (
        <WrappedComponent styles={styles} {...this.props} />
      )

      if (options.withRef) {
        return React.cloneElement(element, {ref: 'wrappedInstance'})
      } else {
        return element
      }
    }
  }
}
