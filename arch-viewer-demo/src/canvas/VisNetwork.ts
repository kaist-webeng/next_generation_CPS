import * as vis from 'vis'
import { Graph, State } from 'godeptypes'
import * as _ from 'lodash'
import { remote } from 'electron'
import DataSet from './DataSet'
import Store from './Store'
import { dataActions } from './Actions'
import { EdgeType, NodeType } from './enums'

enum ElemType {
  node,
  edge
}

interface IHoveredElement {
  type: ElemType
  ID: string
}

const NETWORK_OPTS: vis.Options = {
  nodes: {
    shape: 'dot',
    size: 10
  },
  groups: {
    cps: {
      color: '#5CC9F5'
    },
    comp: {
      color: '#A1A9B8'
    }
  },
  layout: {
    randomSeed: 2,
    improvedLayout: true,
    hierarchical: {
      direction: 'LR',
      sortMethod: 'directed'
    }
  },
  interaction: {
    multiselect: true,
    hover: true,
    hoverConnectedEdges: false
  },
  physics: {
    stabilization: {
      enabled: true
    }
  }
}

let hovered: IHoveredElement
let releaseParams: any = {}

class VisNetwork {
  private nodes: vis.DataSet<Graph.INode> = new vis.DataSet([])
  private edges: vis.DataSet<Graph.IEdge> = new vis.DataSet([])
  private visNetwork: vis.Network

  public init(mountHTML: HTMLElement) {
    this.visNetwork = new vis.Network(
      mountHTML,
      { nodes: this.nodes, edges: this.edges },
      NETWORK_OPTS
    )

    this.visNetwork.on('click', click)
    this.visNetwork.on('oncontext', openContextMenu)
    this.visNetwork.on('hoverNode', recordHoveredParams)
    this.visNetwork.on('hoverEdge', recordHoveredParams)
    this.visNetwork.on('deselectNode', deselectNode)
    this.visNetwork.on('deselectEdge', deselectEdge)
    this.visNetwork.on('release', recordReleaseParams)
  }

  public refresh(idList: string[]) {
    // @ts-ignore nodeID is always string in this system.
    const currentVisibleNodeIDList: string[] = this.nodes.getIds()
    const removedIDList = _.difference(currentVisibleNodeIDList, idList)

    this.show(idList)
    this.hide(removedIDList)
  }

  public show(id: string | string[]) {
    // @ts-ignore nodeID is always string in this system.
    const currentVisibleNodeIDList: string[] = this.nodes.getIds()
    const dataList = Array.isArray(id)
      ? DataSet.getVisibleElements(_.concat(id, currentVisibleNodeIDList))
      : DataSet.getVisibleElements([id, ...currentVisibleNodeIDList])

    this.nodes.update(dataList.nodeList.map(styleNode))
    this.edges.update(dataList.edgeList.map(styleEdge))
  }

  public hide(id: string | string[]) {
    this.nodes.remove(id)

    Array.isArray(id)
      ? _.forEach(id, singleID =>
          this.edges.remove(DataSet.selectNode(singleID).edgeList)
        )
      : this.edges.remove(DataSet.selectNode(id).edgeList)
  }

  public setSelection(selected: State.ISelectedState) {
    this.visNetwork.setSelection({
      nodes: _.filter(
        selected.nodeList,
        nodeID => this.nodes.get(nodeID) !== null
      ),
      edges: _.filter(
        selected.edgeList,
        edgeID => this.edges.get(edgeID) !== null
      )
    })
  }

  public setErrorNode(errorID: string) {
    const node = this.nodes.get(errorID)
    if (node) {
      // @ts-ignore 'font' exists in vis.Node
      node.font = { color: 'red' }
      node.color = { background: 'red' }
      this.nodes.update(node)
    }
  }

  public substitute(
    target: { nodeIDs: string[]; edgeIDs: string[] },
    alternatives: Graph.IListGraph
  ) {
    this.nodes.remove(target.nodeIDs)
    this.edges.remove(target.edgeIDs)

    this.nodes.update(alternatives.nodes.map(node => {
      // @ts-ignore 'font' exists in vis.Node
      node.font = { color: 'blue' }
      node.color = { background: 'blue' }

      return node
    }))
    this.edges.update(alternatives.edges.map(styleEdge))
  }
}

function styleEdge(edge: Graph.IEdge) {
  if (edge.type === EdgeType.LOCAL) {
    edge.color = { color: '#FF7035' }
    edge.arrows = 'to'
  } else if (edge.type === EdgeType.HTTP) {
    edge.arrows = 'to'
  }

  return edge
}

function styleNode(node: Graph.INode) {
  node.color =
    node.type === NodeType.CPS
      ? { background: '#5CC9F5' }
      : { background: '#A1A9B8' }

  return node
}

function getRelatedEdgeIDs(nodeID: string) {
  const node = DataSet.getNode(nodeID)
  return _.concat(
    _.keys(node.meta.sinkEdgeIDSet),
    _.keys(node.meta.sourceEdgeIDSet)
  )
}

function getRelatedNodeIDs(edgeID: string) {
  const edge = DataSet.getEdge(edgeID)
  return [edge.from, edge.to]
}

function click(params: any) {
  const selected: State.ISelectedState = {
    nodeList: params.nodes,
    edgeList: params.edges
  }

  if (selected.nodeList.length !== 0 || selected.edgeList.length !== 0) {
    Store.dispatch(dataActions.select(selected))
  }
}

function openContextMenu() {
  const menuTemplate = [
    {
      label: 'show info',
      click() {
        if (hovered.type === ElemType.node) {
          Store.dispatch(dataActions.showInfo(DataSet.selectNode(hovered.ID)))
        } else if (hovered.type === ElemType.edge) {
          Store.dispatch(
            dataActions.showInfo({ nodeList: [], edgeList: [hovered.ID] })
          )
        }
      }
    }
  ]

  if (hovered.type === ElemType.node && hovered.ID) {
    menuTemplate.unshift({
      label: 'hide',
      click() {
        Store.dispatch(
          dataActions.hideNode(hovered.ID, DataSet.getNode(hovered.ID).type)
        )
      }
    })
  }

  const menu = remote.Menu.buildFromTemplate(menuTemplate)
  menu.popup({ window: remote.getCurrentWindow() })
}

function deselectNode(params: any) {
  if (params.nodes.length === 0) {
    _.forEach(releaseParams.nodes, nodeID =>
      Store.dispatch(
        dataActions.deselect({
          nodeList: [nodeID],
          edgeList: getRelatedEdgeIDs(nodeID)
        })
      )
    )
  }
}

function deselectEdge(params: any) {
  if (params.edges.length === 0) {
    _.forEach(releaseParams.edges, edgeID =>
      Store.dispatch(
        dataActions.deselect({
          nodeList: getRelatedNodeIDs(edgeID),
          edgeList: [edgeID]
        })
      )
    )
  }
}

function recordHoveredParams(params: any) {
  hovered = params.node
    ? { type: ElemType.node, ID: params.node }
    : { type: ElemType.edge, ID: params.edge }
}

function recordReleaseParams(params: any) {
  releaseParams = params
}

export default new VisNetwork()
