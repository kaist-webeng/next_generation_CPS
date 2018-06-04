import { createAction } from 'typesafe-actions'
import { getReturnOfExpression } from 'utility-types'
import { State, Graph, IAltCmdArg } from 'godeptypes'

export const dataActions = {
  initSideBarData: createAction(
    'INIT_SIDEBARDATA',
    (initSideBarState: State.ISideBarData) => ({
      type: 'INIT_SIDEBARDATA',
      payload: initSideBarState
    })
  ),
  showNode: createAction('SHOW_NODE', (id: string, type: Graph.NodeType) => ({
    type: 'SHOW_NODE',
    payload: { id, type }
  })),
  hideNode: createAction('HIDE_NODE', (id: string, type: Graph.NodeType) => ({
    type: 'HIDE_NODE',
    payload: { id, type }
  })),
  select: createAction('SELECT', (selected: State.ISelectedState) => ({
    type: 'SELECT',
    payload: selected
  })),
  deselect: createAction('DESELECT', (deselected: State.ISelectedState) => ({
    type: 'DESELECT',
    payload: deselected
  })),
  showInfo: createAction(
    'SHOW_INFO',
    (infoPanelData: State.ISelectedState) => ({
      type: 'SHOW_INFO',
      payload: infoPanelData
    })
  ),
  substitute: createAction('SUBSTITUTE', (arg: IAltCmdArg) => ({
    type: 'SUBSTITUTE',
    payload: arg
  }))
}

const returnsOfActions = Object.values(dataActions).map(getReturnOfExpression)
export type DataAction = typeof returnsOfActions[number]
