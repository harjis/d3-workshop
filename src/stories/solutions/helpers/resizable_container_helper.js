// @flow
import * as React from 'react';
import { Resizable } from 'react-resizable';

type ResizeCallbackData = {|
  node: HTMLElement,
  size: { height: number, width: number }
|};

type Props = {|
  children: ({ height: number, width: number, isResizing: boolean }) => React.Node,
  height?: number,
  width?: number
|};

type State = {|
  height: number,
  width: number,
  isResizing: boolean
|};

export default class ResizableContainer extends React.Component<Props, State> {
  state = {
    height: this.props.height || 500,
    width: this.props.width || 500,
    isResizing: false
  };

  onResize = (e: SyntheticEvent<>, data: ResizeCallbackData) => {
    const { height, width } = data.size;
    this.setState({ height, width });
  };

  onResizeStart = () => this.setState({ isResizing: true });
  onResizeStop = () => this.setState({ isResizing: false });

  render() {
    const { height, width, isResizing } = this.state;
    return (
      <Resizable
        height={height}
        width={width}
        onResize={this.onResize}
        onResizeStart={this.onResizeStart}
        onResizeStop={this.onResizeStop}
      >
        {this.props.children({ height, width, isResizing })}
      </Resizable>
    );
  }
}
