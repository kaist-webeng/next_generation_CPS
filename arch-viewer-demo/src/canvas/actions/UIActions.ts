import { createAction } from 'typesafe-actions'
import { getReturnOfExpression } from 'utility-types'

export const uiActions = {
  updateWidth: createAction('UPDATE_WIDTH', (newWidth: number) => ({
    type: 'UPDATE_WIDTH',
    payload: newWidth
  })),
  updateHeight: createAction('UPDATE_HEIGHT', (newHeight: number) => ({
    type: 'UPDATE_HEIGHT',
    payload: newHeight
  })),
  changeNodeVisible: createAction('CHANGE_NODE_VISIBLE'),
  changeEdgeVisible: createAction('CHANGE_EDGE_VISIBLE')
}

const returnsOfActions = Object.values(uiActions).map(getReturnOfExpression)
export type UIAction = typeof returnsOfActions[number]
