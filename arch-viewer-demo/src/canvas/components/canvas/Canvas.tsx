import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'godeptypes'
import VisNetwork from '../../VisNetwork'

interface ICanvasProps {
  selected: State.ISelectedState
}

const VisNetworkCompID = 'vis-canvas'

class Canvas extends React.Component<ICanvasProps> {
  public componentDidMount() {
    // @ts-ignore document works well.
    VisNetwork.init(document.getElementById(VisNetworkCompID))
  }

  public componentWillUpdate(nextProps: ICanvasProps) {
    VisNetwork.setSelection(nextProps.selected)
  }

  public render() {
    return (
      <div style={style.container}>
        <div id={VisNetworkCompID} style={style.canvas} key="canvas-vis" />,
      </div>
    )
  }
}

const style = {
  canvas: {
    height: 'inherit',
    width: 'inherit'
  },
  container: {
    height: 'inherit',
    marginTop: '-150px',
    width: 'inherit'
  }
}

function mapStateToProps(state: State.IRootState) {
  return {
    selected: state.data.selected
  }
}

export default connect(mapStateToProps)(Canvas)
