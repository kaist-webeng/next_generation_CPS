declare module 'godeptypes' {
  namespace Graph {
    export interface IListGraph {
      nodes: INode[]
      edges: IEdge[]
    }

    export interface INode extends vis.Node {
      id: string
      label: string
      type: NodeType
      meta: INodeMeta
    }

    export interface IEdge extends vis.Edge {
      id: string
      from: string
      to: string
      type: EdgeType
      arrows?: 'to' | 'from' | 'middle' | any // optional type that is not defined in vis.Edge, but actually can be used.
      color?: any // http://visjs.org/docs/network/edges.html
      meta: IEdgeMeta
    }

    export type NodeType = 'cps' | 'comp'

    export type EdgeType = 'http' | 'local'

    interface INodeMeta {
      [key: string]: string | { [id: string]: boolean }
      host: string
      location: string
      information: string
      sinkEdgeIDSet: { [id: string]: boolean }
      sourceEdgeIDSet: { [id: string]: boolean }
    }

    interface IEdgeMeta {
      [key: string]: string
      dataType: string
      information: string
    }
  }

  namespace State {
    export interface IRootState {
      readonly ui: IUIState
      readonly data: IDataState
    }

    export interface IUIState {
      readonly sideBarWidth: number
      readonly infoPanelHeight: number
      readonly isNodeVisible: boolean
      readonly isEdgeVisible: boolean
    }

    export interface IDataState {
      readonly selected: ISelectedState
      readonly sideBarData: ISideBarState
      readonly infoPanelData: ISelectedState
    }

    export interface ISelectedState {
      readonly nodeList: string[]
      readonly edgeList: string[]
    }

    export interface ISideBarData {
      readonly [type: string]: ISideBarDataSet
      readonly cps: ISideBarDataSet
      readonly comp: ISideBarDataSet
    }

    // key values are matched with PkgType.
    export interface ISideBarState {
      readonly data: ISideBarData
    }

    export interface ISideBarDataSet {
      readonly visibleList: string[]
      readonly invisibleList: string[]
    }
  }

  interface IElementSet<T> {
    [id: string]: T
  }

  export interface IGraphDataSet {
    nodeSet: IElementSet<Graph.INode>
    edgeSet: IElementSet<Graph.IEdge>
  }

  export interface ICommand {
    cmd: string
    arg: string | IAltCmdArg
  }

  export interface IAltCmdArg {
    target: Graph.IListGraph
    alternatives: Graph.IListGraph
  }
}
