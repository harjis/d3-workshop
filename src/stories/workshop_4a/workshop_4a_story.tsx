import React from "react";
import { storiesOf } from "@storybook/react";
// import Bars from './bars';
// import XAxis from './x_axis';
// import YAxis from './y_axis';
storiesOf('Development/d3-workshop/4a', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('BarChart with reusable components', () => {
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
type State = {
  yAxisWidth: number;
  xAxisHeight: number;
};

class BarChart extends React.Component<Props, State> {
  state = {
    yAxisWidth: 0,
    xAxisHeight: 0
  };
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