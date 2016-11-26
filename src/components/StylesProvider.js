import React, { Component } from 'react'
import { context, MapPropsToContext } from 'react-ctx'

import { omit } from '../utils'
import { contextTypes, contextNamespace } from '../constants'

const omitKeys = ['children', 'key', 'ref', 'customStyleParams']

class StylesProvider extends Component {
  render() {
    const {children, customStyleParams} = this.props
    const mergedStyleParams = {
      ...customStyleParams,
      ...omit(this.props, omitKeys),
    }

    return (
      <MapPropsToContext
        contextNamespace={contextNamespace}
        contextTypes={contextTypes}
        customStyleParams={mergedStyleParams}
      >
        {children}
      </MapPropsToContext>
    )
  }
}

export default context(contextTypes, contextNamespace)(StylesProvider)
