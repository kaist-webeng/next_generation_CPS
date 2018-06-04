import { combineReducers } from 'redux'
import { State } from 'godeptypes'
import SideBarReducers from './SideBarReducers'
import SelectedReducers from './SelectedReducers'
import InfoPanelReducers from './InfoPanelReducers'

export const dataReducers = combineReducers<State.IDataState>({
  selected: SelectedReducers,
  infoPanelData: InfoPanelReducers,
  sideBarData: SideBarReducers
})
