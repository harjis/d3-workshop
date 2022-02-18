import React from "react";
import { axisBottom, select, scaleBand } from "d3";
type Props = {
  afterRender: (height: number) => void;
  data: number[];
  isResizing: boolean;
  marginLeft: number;
  top: number;
  width: number;
};
export default class XAxis extends React.Component<Props> {
  static defaultProps = {
    isResizing: false,
    marginLeft: 0
  };

  componentDidMount() {
    this.axis = new XAxisD3(this.ref, this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.axis && this.axis.update(nextProps);
  }

  ref: Element | null | undefined;
  axis: XAxisD3 | null | undefined;
  applyRef = (ref: Element | null | undefined) => this.ref = ref;

  render() {
    return <g ref={this.applyRef} />;
  }

}

class XAxisD3 {
  constructor(element: Element | null | undefined, props: Props) {
    this.axisHeight = null;
    this.selection = select(element);
    const xScale = this.getScale(props);
    this.render(props, xScale);
  }

  selection: (...args: Array<any>) => any;
  axisHeight: number | null | undefined;

  update(nextProps: Props) {
    const xScale = this.getScale(nextProps);
    this.render(nextProps, xScale);
  }

  getScale(props: Props) {
    return scaleBand().range([0, props.width - props.marginLeft]).domain(props.data).padding(0.1);
  }

  _axisHeight(props: Props): number {
    if (this.axisHeight === null || this.axisHeight === undefined || !props.isResizing) {
      this.axisHeight = this.selection.node().getBBox().height;
    }

    return this.axisHeight;
  }

  render(props: Props, xScale: (...args: Array<any>) => any) {
    const axis = axisBottom(xScale);
    this.selection.call(axis);
    this.selection.attr('transform', `translate(${props.marginLeft},${props.top - this._axisHeight(props)})`);
    props.afterRender(this._axisHeight(props));
  }

}