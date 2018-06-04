import { combineReducers, createStore } from 'redux'
import { State } from 'godeptypes'
import { uiReducers } from './reducers/UIReducers'
import { dataReducers } from './reducers/DataReducers'

const rootReducers = combineReducers<State.IRootState>({
  ui: uiReducers,
  data: dataReducers
})

export default createStore(
  rootReducers,
  // @ts-ignore: window. ... for ReduxDevTool
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    // @ts-ignore: window. ... for ReduxDevTool
    window.__REDUX_DEVTOOLS_EXTENSION__()
)
