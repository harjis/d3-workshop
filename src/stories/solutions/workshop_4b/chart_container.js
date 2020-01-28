// @flow
import * as React from 'react';

export type ChildrenProps = {|
  getHeight: () => number,
  getMarginBottom: () => number,
  getMarginLeft: () => number,
  getWidth: () => number,
  setMarginBottom: (bottom: number) => void,
  setMarginLeft: (left: number) => void
|};
type Props = {|
  children: (childrenProps: ChildrenProps) => React.Node,
  height: number,
  margin: number,
  width: number
|};
type State = {|
  marginBottom: number,
  marginLeft: number
|};
export default class ChartContainer extends React.Component<Props, State> {
  state = {
    marginBottom: 0,
    marginLeft: 0
  };

  getHeight = () => this.props.height - this.props.margin * 2;
  getWidth = () => this.props.width - this.props.margin * 2;

  setMarginLeft = (marginLeft: number) => {
    if (this.state.marginLeft !== marginLeft) this.setState({ marginLeft });
  };

  setMarginBottom = (marginBottom: number) => {
    if (this.state.marginBottom !== marginBottom) this.setState({ marginBottom });
  };

  get childrenProps(): ChildrenProps {
    return {
      getHeight: this.getHeight,
      getMarginBottom: () => this.state.marginBottom,
      getMarginLeft: () => this.state.marginLeft,
      getWidth: this.getWidth,
      setMarginBottom: this.setMarginBottom,
      setMarginLeft: this.setMarginLeft
    };
  }
  render() {
    return (
      <svg height={this.props.height} width={this.props.width} style={{ background: 'white' }}>
        <g transform={`translate(${this.props.margin},${this.props.margin})`}>
          {this.props.children(this.childrenProps)}
        </g>
      </svg>
    );
  }
}
