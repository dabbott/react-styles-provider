react-styles-provider
=====================

[![npm version](https://img.shields.io/npm/v/react-styles-provider.svg?style=flat-square)](https://www.npmjs.com/package/react-styles-provider)

Powerful, dynamic styles for React and React Native.

```js
npm install --save react-styles-provider
```

## Usage

### 1. Passing styles to components

Use the `createStyles` decorator to provide a `styles` prop to the component.

```js
import React, { Component } from 'react'
import createStyles from 'react-styles-provider'

@createStyles({
  container: {
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  text: {
    color: 'black',
  },
})
export default class HelloButton extends Component {
  render() {
    const {styles} = this.props

    return (
      <div style={styles.container}>
        <span style={styles.text}>
          Hello World
        </span>
      </div>
    )
  }
}
```

### 2. Compute styles based on props

At any place in the `createStyles` call, you may use a function, which takes props as a parameter.

##### Compute a single value from props

```js
@createStyles({
  container: {
    padding: 20,
    backgroundColor: props => props.error ? 'red' : 'whitesmoke',
  },
  text: {
    color: 'black',
  },
})
```

##### Compute a style object from props

```js
@createStyles({
  container: props => ({
    padding: props.large ? 40 : 20,
    backgroundColor: props.error ? 'red' : 'whitesmoke',
  }),
  text: {
    color: 'black',
  },
})
```

##### Compute all style objects from props

```js
@createStyles(props => ({
  container: {
    padding: props.large ? 40 : 20,
    backgroundColor: props.error ? 'red' : 'whitesmoke',
  },
  text: {
    color: props.error ? 'white' : 'black',
  },
}))
```

### 3. Compute styles based on state

The `createStyles` decorator also adds a `getStyles` prop to the component. Calling `getStyles(state)` runs any functions in `createStyles` with `state` as the second parameter.

```js
import React, { Component } from 'react'
import createStyles from 'react-styles-provider'

@createStyles({
  container: {
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  text: {
    color: (props, state) => state.hover ? 'grey' : 'black',
  },
})
export default class HelloButton extends Component {

  state = {
    hover: false,
  }

  render() {
    const {getStyles} = this.props
    const styles = getStyles(this.state)

    return (
      <div
        style={styles.container}
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
      >
        <span style={styles.text}>
          Hello World
        </span>
      </div>
    )
  }
}
```

### 4. Style arrays (same behavior as React Native)

```js
@createStyles(props => {

  // Extended by both container and text
  const base = {
    margin: 30,
    backgroundColor: props.error ? 'red' : 'whitesmoke',
  }

  return {
    container: [
      base,
      {padding: props.large ? 40 : 20}
    ],
    text: [
      base,
      {color: props.error ? 'white' : 'black'}
    ],  
  }
})
```

### 5. Responsive helpers (React web only, for now)

The `responsive` decorator adds a responsive prop to your component, which can be used both to create style objects and in the render function.

```js
import React, { Component } from 'react'
import { ResponsiveProvider } from 'react-styles-provider'

// Choose how to define the `responsive` prop. In this case, we'll define it as
// a string like, "small-mobile" or "large-desktop". This gets called every time
// window dimensions change.
const calculateResponsiveBreakpoints = ({width, height, isMobile}) => {
  const attributes = []

  if (width > 1280) {
    attributes.push('large')
  } else if (width > 800) {
    attributes.push('medium')
  } else {
    attributes.push('small')
  }

  if (isMobile) {
    attributes.push('mobile')
  } else {
    attributes.push('desktop')
  }

  return attributes.join('-')
}

// Pass our responsive calculation function to ResponsiveProvider to make the
// `responsive` prop available to descendant components
export default class App extends Component {
  render() {
    return (
      <ResponsiveProvider set={calculateResponsiveBreakpoints}>
        <HelloButton />
      </ResponsiveProvider>
    )
  }
}
```

```js
import React, { Component } from 'react'
import { responsive } from 'react-styles-provider'

@responsive()
@createStyles({
  container: {
    padding: 20,
    backgroundColor: 'whitesmoke',
    width: props => props.responsive.match('small|mobile') ? 300 : 600,
  },
  text: {
    color: 'black',
  },
})
export default class HelloButton extends Component {
  render() {
    const {style, responsive} = this.props

    return (
      <div style={styles.container}>
        <span style={styles.text}>
          Hello World
        </span>
        {responsive.match('mobile') && (
          <span>On Mobile</span>
        )}
      </div>
    )
  }
}
```
