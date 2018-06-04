import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Root from './components/Root'
import Store from './Store'

class Container extends React.Component {
  public render() {
    return (
      <Provider store={Store}>
        <Root />
      </Provider>
    )
  }
}

// @ts-ignore: 'document' is working well.
ReactDOM.render(<Container />, document.getElementById('container'))
