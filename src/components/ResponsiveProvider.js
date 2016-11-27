import React, { Component, PropTypes } from 'react'
import { MapPropsToContext } from 'react-ctx'

import windowDimensions from '../enhancers/windowDimensions'

// Primitive mobile detection
const detectMobile = () =>
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

const isMobile = detectMobile()

class ResponsiveProvider extends Component {

  static propTypes = {
    set: PropTypes.func,
  }

  static defaultProps = {
    set: () => {},
  }

  render() {
    const {children, window, set} = this.props

    return (
      <MapPropsToContext
        contextTypes={['responsive']}
        responsive={set({...window, isMobile})}
      >
        {children}
      </MapPropsToContext>
    )
  }
}

export default windowDimensions()(ResponsiveProvider)
