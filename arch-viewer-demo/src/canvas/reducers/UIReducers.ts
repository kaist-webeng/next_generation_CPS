import { getType } from 'typesafe-actions'
import { State } from 'godeptypes'
import { UIAction, uiActions } from '../Actions'

const INITIAL_STATE: State.IUIState = {
  infoPanelHeight: 300,
  isEdgeVisible: true,
  isNodeVisible: true,
  sideBarWidth: 300
}

export function uiReducers(state = INITIAL_STATE, action: UIAction) {
  switch (action.type) {
    case getType(uiActions.updateWidth):
      return { ...state, sideBarWidth: action.payload }
    case getType(uiActions.updateHeight):
      return { ...state, infoPanelHeight: action.payload }
    case getType(uiActions.changeNodeVisible):
      return { ...state, isNodeVisible: !state.isNodeVisible }
    case getType(uiActions.changeEdgeVisible):
      return { ...state, isEdgeVisible: !state.isEdgeVisible }
    default:
      return state
  }
}
