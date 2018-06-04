import Resizable from 're-resizable'
import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import { uiActions } from '../../Actions'
import SideBarList from './SideBarList'

interface ISideBarProps {
  width: number
  sideBarData: State.ISideBarState
  selected: State.ISelectedState
  updateWidth: (newWidth: number) => any
}

class SideBar extends React.Component<ISideBarProps> {
  constructor(props: ISideBarProps) {
    super(props)

    this.updateWidth = this.updateWidth.bind(this)
  }

  public render() {
    const selectedSet = this.props.selected.nodeList.reduce(
      (accumulated: { [key: string]: boolean }, current) => {
        accumulated[current] = true
        return accumulated
      },
      {}
    )

    return (
      <Resizable
        className="position-fixed fixed-top bg-secondary"
        style={style.ResizableComp}
        size={{ height: '100%', width: this.props.width }}
        enable={resizeEnabled}
        onResizeStop={this.updateWidth}
        minWidth={200}
        maxWidth={800}
      >
        <div style={{ ...style.ContentContainer, overflow: 'auto' }}>
          <SideBarList
            header="CPS Services"
            visibleList={this.props.sideBarData.data.cps.visibleList}
            invisibleList={this.props.sideBarData.data.cps.invisibleList}
            selectedSet={selectedSet}
          />
          <SideBarList
            header="Common Components"
            visibleList={this.props.sideBarData.data.comp.visibleList}
            invisibleList={this.props.sideBarData.data.comp.invisibleList}
            selectedSet={selectedSet}
          />
        </div>
      </Resizable>
    )
  }

  private updateWidth(
    event: MouseEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number }
  ) {
    this.props.updateWidth(delta.width + this.props.width)
  }
}

const style = {
  ResizableComp: {
    borderStyle: 'none outset none none',
    padding: '66px 10px 10px 10px',
    zIndex: 1010
  },
  ContentContainer: {
    height: '100%'
  }
}

const resizeEnabled = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: true,
  top: false,
  topLeft: false,
  topRight: false
}

function mapStateToProps(state: State.IRootState) {
  return {
    width: state.ui.sideBarWidth,
    sideBarData: state.data.sideBarData,
    selected: state.data.selected
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateWidth: (newWidth: number) => {
      dispatch(uiActions.updateWidth(newWidth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
