import React from "react";
import { Resizable } from "react-resizable";

type ResizeCallbackData = {
  node: HTMLElement;
  size: {
    height: number;
    width: number;
  };
};
type Props = {
  children: (arg0: {
    height: number;
    width: number;
    isResizing: boolean;
  }) => React.ReactNode;
  height?: number;
  width?: number;
};
type State = {
  height: number;
  width: number;
  isResizing: boolean;
};
export default class ResizableContainer extends React.Component<Props, State> {
  state = {
    height: this.props.height || 500,
    width: this.props.width || 500,
    isResizing: false,
  };
  onResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    const { height, width } = data.size;
    this.setState({
      height,
      width,
    });
  };
  onResizeStart = () =>
    this.setState({
      isResizing: true,
    });
  onResizeStop = () =>
    this.setState({
      isResizing: false,
    });

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
        {this.props.children({
          height,
          width,
          isResizing,
        })}
      </Resizable>
    );
  }
}
