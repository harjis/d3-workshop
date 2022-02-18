import React from "react";
import { storiesOf } from "@storybook/react";
import { axisBottom, axisLeft, select, scaleBand, scaleLinear } from "d3";
storiesOf('Development/d3-workshop/Solutions/3', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('BarChart', () => {
  return <BarChart margin={8} width={500} height={400} bars={[{
    x: 0,
    y: 1
  }, {
    x: 1,
    y: 2
  }, {
    x: 2,
    y: 3
  }, {
    x: 3,
    y: 4
  }, {
    x: 4,
    y: 5
  }, {
    x: 5,
    y: 6
  }, {
    x: 6,
    y: 7
  }, {
    x: 7,
    y: 8
  }, {
    x: 8,
    y: 9
  }, {
    x: 9,
    y: 10
  }]} />;
});
type Bar = {
  x: number;
  y: number;
};
type Props = {
  height: number;
  margin: number;
  bars: Bar[];
  width: number;
};

class BarChart extends React.Component<Props> {
  componentDidMount() {
    drawChart(this.ref, this.subtractMargins(this.props));
  }

  componentDidUpdate(nextProps: Props) {
    drawChart(this.ref, this.subtractMargins(nextProps));
  }

  subtractMargins(props: Props) {
    return { ...props,
      height: props.height - props.margin * 2,
      width: props.width - props.margin * 2
    };
  }

  applyRef = ref => this.ref = ref;
  ref: Element | null | undefined;

  render() {
    return <svg height={this.props.height} width={this.props.width} style={{
      background: 'white'
    }}>
        <g transform={`translate(${this.props.margin},${this.props.margin})`} ref={this.applyRef} />
      </svg>;
  }

}

function drawChart(element: Element | null | undefined, props: Props) {
  const yAxisWidth = 18;
  const xAxisHeight = 18;
  const selection = select(element);
  const xAxisGroup = selection.append('g');
  const yAxisGroup = selection.append('g');
  const barGroup = selection.append('g');
  const xScale = scaleBand().range([0, props.width - yAxisWidth]).domain(props.bars.map(bar => bar.x)).padding(0.1);
  // Because of svg coordinate system I would prefer this one
  const yScale = scaleLinear().range([props.height - xAxisHeight, 0]).domain([0, Math.max(...props.bars.map(bar => bar.y))]);
  // OPTION 1.5
  // const yScale = scaleLinear()
  //   .range([0, props.height - xAxisHeight])
  //   .domain([Math.max(...props.bars.map(bar => bar.y)), 0]);
  // OPTION 2
  const yScaleBar = scaleLinear().range([0, props.height - xAxisHeight]).domain([0, Math.max(...props.bars.map(bar => bar.y))]);
  drawXAxis(xAxisGroup, props, xScale, yAxisWidth, xAxisHeight);
  drawYAxis(yAxisGroup, props, yScale, yAxisWidth, xAxisHeight);
  drawBars(barGroup, props, xScale, yScale, yAxisWidth, xAxisHeight); // OPTION 2
  // drawBars(barGroup, props, xScale, yScaleBar, yAxisWidth, xAxisHeight);
}

function drawXAxis(selection: (...args: Array<any>) => any, props: Props, xScale: (...args: Array<any>) => any, yAxisWidth: number, xAxisHeight: number) {
  const axis = axisBottom(xScale);
  selection.call(axis).attr('transform', `translate(${yAxisWidth}, ${props.height - xAxisHeight})`);
}

function drawYAxis(selection: (...args: Array<any>) => any, props: Props, yScale: (...args: Array<any>) => any, yAxisWidth: number, xAxisHeight: number) {
  const axis = axisLeft(yScale);
  selection.call(axis).attr('transform', `translate(${yAxisWidth}, ${0})`);
}

function drawBars(selection: (...args: Array<any>) => any, props: Props, xScale: (...args: Array<any>) => any, yScale: (...args: Array<any>) => any, yAxisWidth: number, xAxisHeight: number) {
  const bars = selection.attr('transform', `translate(${yAxisWidth}, ${0})`).selectAll('rect').data(props.bars);
  bars.enter().append('rect').attr('fill', 'black').attr('width', xScale.bandwidth()).attr('x', d => xScale(d.x)).attr('height', d => props.height - xAxisHeight - yScale(d.y)).attr('y', d => yScale(d.y)); // OPTION 2
  // .attr('height', d => yScale(d.y))
  // .attr('y', d => props.height - xAxisHeight - yScale(d.y));
}