import { ipcRenderer, remote } from 'electron'
import * as React from 'react'
import { connect } from 'react-redux'
import { IAltCmdArg, State } from 'godeptypes'
import * as IPCType from '../../IPCTypes'
import { dataActions } from '../Actions'
import DataSet from '../DataSet'
import Canvas from './canvas/Canvas'
import InfoPanel from './infoPanel/InfoPanel'
import SideBar from './sideBar/SideBar'
import VisNetwork from '../VisNetwork'

interface IRootProps {
  initSideBarData: (initSideBarState: State.ISideBarData) => any
  substitute: (arg: IAltCmdArg) => any
  showInfo: (ids: State.ISelectedState) => any
  select: (selected: State.ISelectedState) => any
  deselect: (deselected: State.ISelectedState) => any
}

class Root extends React.Component<IRootProps> {
  constructor(props: IRootProps) {
    super(props)

    ipcRenderer.on(
      IPCType.ErrorOccurredChannel,
      (event: any, errorID: string) => {
        VisNetwork.setErrorNode(errorID)
        const selectedData = DataSet.selectNode(errorID)
        if (selectedData) {
          this.props.showInfo(selectedData)
          
        }
      }
    )

    ipcRenderer.on(
      IPCType.GraphSubstitutionChannel,
      (event: any, arg: IAltCmdArg) => {
        DataSet.substitute(arg.target, arg.alternatives)
        this.props.substitute(arg)

        const selected = {
          nodeList: arg.alternatives.nodes.map(node => node.id),
          edgeList: arg.alternatives.edges.map(edge => edge.id)
        }
        const deselected = {
          nodeList: arg.target.nodes.map(node => node.id),
          edgeList: arg.target.edges.map(edge => edge.id)
        }
        this.props.showInfo(selected)
        
        this.props.deselect(deselected)
      }
    )
  }

  public componentDidMount() {
    // @ts-ignore
    const initGraph = remote.getCurrentWindow().initGraph
    if (initGraph) {
      this.props.initSideBarData(DataSet.init(initGraph))
    }
  }

  public render() {
    return (
      <div style={{ width: 'inherit', height: 'inherit' }}>
        <SideBar />
        <InfoPanel />
        <Canvas />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    initSideBarData: (initSideBarState: State.ISideBarData) => {
      dispatch(dataActions.initSideBarData(initSideBarState))
    },
    substitute: (arg: IAltCmdArg) => {
      dispatch(dataActions.substitute(arg))
    },
    showInfo: (ids: State.ISelectedState) => {
      dispatch(dataActions.showInfo(ids))
    },
    select: (selected: State.ISelectedState) => {
      dispatch(dataActions.select(selected))
    },
    deselect: (deselected: State.ISelectedState) => {
      dispatch(dataActions.deselect(deselected))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)
