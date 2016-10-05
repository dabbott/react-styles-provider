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
      this.selectedProps = this.selectProps(props)
      this.state = this.mapContextToState(props, context)
    }

    componentWillReceiveProps(nextProps, nextContext) {
      const nextSelectedProps = this.selectProps(nextProps)

      if (
        nextContext.theme !== this.context.theme ||
        nextSelectedProps !== this.selectedProps
      ) {
        this.selectedProps = nextSelectedProps
        this.setState(this.mapContextToState(nextProps, nextContext))
      }

      // Update all styles on HMR regardless of theme change
      if (module.hot) {
        this.selectedProps = nextSelectedProps
        this.setState(this.mapContextToState(nextProps, nextContext))
      }
    }

    mapContextToState(props, context) {
      const {theme} = context

      if (typeof selector === 'function') {
        return {styles: createStyles(theme, this.selectedProps)}
      } else {
        return {styles: createStyles(theme)}
      }
    }

    selectProps(props) {
      if (typeof selector !== 'function') return undefined

      // TODO Handle getDefaultProps() for classic React?
      const defaultProps = WrappedComponent.defaultProps

      const selectedProps = selector({...defaultProps, ...props})

      // If equal, return the old selection
      if (equal(this.selectedProps, selectedProps)) {
        return this.selectedProps

      // Else, return the new selection
      } else {
        return selectedProps
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
