import React from "react";
import { axisLeft, select, scaleLinear } from "d3";
type Props = {
  afterRender: (width: number) => void;
  data: number[];
  height: number;
  isResizing: boolean;
  left: number;
  marginBottom: number;
};
export default class YAxis extends React.Component<Props> {
  static defaultProps = {
    isResizing: false,
    marginBottom: 0
  };

  componentDidMount() {
    this.axis = new YAxisD3(this.ref, this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.axis && this.axis.update(nextProps);
  }

  ref: Element | null | undefined;
  axis: YAxisD3 | null | undefined;
  applyRef = (ref: Element | null | undefined) => this.ref = ref;

  render() {
    return <g ref={this.applyRef} />;
  }

}

class YAxisD3 {
  constructor(element: Element | null | undefined, props: Props) {
    this.axisWidth = null;
    this.selection = select(element);
    const yScale = this.getScale(props);
    this.render(props, yScale);
  }

  selection: (...args: Array<any>) => any;
  axisWidth: number | null | undefined;

  update(nextProps: Props) {
    const yScale = this.getScale(nextProps);
    this.render(nextProps, yScale);
  }

  getScale(props: Props) {
    return scaleLinear().range([props.height - props.marginBottom, 0]).domain([0, Math.max(...props.data)]);
  }

  _axisWidth(props: Props): number {
    if (this.axisWidth === null || this.axisWidth === undefined || !props.isResizing) {
      this.axisWidth = this.selection.node().getBBox().width;
    }

    return this.axisWidth;
  }

  render(props: Props, yScale: (...args: Array<any>) => any) {
    const axis = axisLeft(yScale);
    this.selection.call(axis);
    this.selection.attr('transform', `translate(${props.left + this._axisWidth(props)},${0})`);
    props.afterRender(this._axisWidth(props));
  }

}