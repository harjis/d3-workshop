// @flow
import * as React from 'react';
import { select, scaleBand, scaleLinear } from 'd3';

type Bar = {|
  x: number,
  y: number
|};
type Props = {|
  bars: Bar[],
  height: number,
  marginBottom: number,
  marginLeft: number,
  width: number
|};

export default class Bars extends React.Component<Props> {
  static defaultProps = {
    height: 0,
    marginBottom: 0,
    marginLeft: 0,
    width: 0
  };

  componentDidMount() {
    this.bar = new BarsD3(this.ref, this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.bar && this.bar.update(nextProps);
  }

  ref: ?Element;
  bar: ?BarsD3;

  applyRef = (ref: ?Element) => (this.ref = ref);

  render() {
    return <g ref={this.applyRef} />;
  }
}

class BarsD3 {
  constructor(element: ?Element, props: Props) {
    this.selection = select(element).append('g');
    const yScale = this.getYScale(props);
    const xScale = this.getXScale(props);
    this.render(props, xScale, yScale);
  }

  selection: Function;

  update(nextProps: Props) {
    this.selection.selectAll('rect').remove();
    const yScale = this.getYScale(nextProps);
    const xScale = this.getXScale(nextProps);
    this.render(nextProps, xScale, yScale);
  }

  getYScale(props: Props): Function {
    return scaleLinear()
      .range([props.height - props.marginBottom, 0])
      .domain([0, Math.max(...props.bars.map(bar => bar.y))]);
  }

  getXScale(props: Props): Function {
    return scaleBand()
      .range([0, props.width - props.marginLeft])
      .domain(props.bars.map(bar => bar.x))
      .padding(0.1);
  }

  render(props: Props, xScale: Function, yScale: Function) {
    const bars = this.selection
      .attr('transform', `translate(${props.marginLeft}, ${0})`)
      .selectAll('rect')
      .data(props.bars);

    bars
      .enter()
      .append('rect')
      .attr('fill', 'black')
      .attr('height', d => props.height - props.marginBottom - yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.y))
      .attr('x', d => xScale(d.x));
  }
}
