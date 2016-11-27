import React, { Component } from 'react'
// import memoize from 'fast-memoize'
import equal from 'shallowequal'
import { context } from 'react-ctx'

import { applyTransformations, omit } from '../utils'
import { contextTypes, contextNamespace } from '../constants'

import resolveFunctions from '../transformations/resolveFunctions'
import prefixStyles from '../transformations/prefixStyles'
import flattenArrays from '../transformations/flattenArrays'
import replaceReferences from '../transformations/replaceReferences'

const defaultOptions = {
  withRef: false,
  transformations: [
    resolveFunctions,
    prefixStyles,
    replaceReferences,
    flattenArrays,
  ],
}

export default (stylesCreator, options) => {

  options = options ? {
    ...defaultOptions,
    ...options,
    transformations: [
      ...defaultOptions.transformations,
      ...options.transformations,
    ],
  } : defaultOptions

  return (WrappedComponent) => {
    class StylesEnhancer extends Component {

      constructor(props) {
        super()

        this.state = this.buildState(props)
      }

      componentWillReceiveProps(nextProps, nextContext) {
        if (!equal(nextProps, this.props)) {
          this.setState(this.buildState(nextProps, nextContext))
        }

        // Update all styles on HMR
        if (module.hot) {
          this.setState(this.buildState(nextProps, nextContext))
        }
      }

      buildState(props) {
        const getStyles = this.buildStyles.bind(this, props)

        return {styles: getStyles(), getStyles}
      }

      buildStyles(props, custom = null) {

        // TODO Handle getDefaultProps() for classic React?
        const defaultProps = WrappedComponent.defaultProps
        const mergedProps = {...defaultProps, ...props}

        // Merge style params from context with anything passed via getStyles
        const mergedCustom = {
          ...mergedProps.customStyleParams,
          ...custom,
        }

        // Delete customStyleParams, which came from context
        delete mergedProps.customStyleParams

        // console.log('stylesCreator', stylesCreator)

        const result = applyTransformations(
          options.transformations,
          stylesCreator,
          mergedProps,
          mergedCustom
        )

        // console.log('resulting styles', result)

        return result
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
            {...omit(this.props, ['customStyleParams'])}
          />
        )

        if (options.withRef) {
          return React.cloneElement(element, {ref: 'wrappedInstance'})
        }

        return element
      }
    }

    return context(contextTypes, contextNamespace)(StylesEnhancer)
  }
}
