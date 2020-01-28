// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Bars from './bars';
import XAxis from './x_axis';
import YAxis from './y_axis';



storiesOf('Development/d3-workshop/Solutions/4a', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('BarChart with reusable components', () => {
    return (
      <BarChart
        margin={8}
        width={500}
        height={400}
        bars={[
          { x: 0, y: 1 },
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 4 },
          { x: 4, y: 5 },
          { x: 5, y: 6 },
          { x: 6, y: 7 },
          { x: 7, y: 8 },
          { x: 8, y: 9 },
          { x: 9, y: 10 }
        ]}
      />
    );
  });

type Bar = {|
  x: number,
  y: number
|};
type Props = {|
  height: number,
  margin: number,
  bars: Bar[],
  width: number
|};
type State = {|
  yAxisWidth: number,
  xAxisHeight: number
|};
class BarChart extends React.Component<Props, State> {
  state = {
    yAxisWidth: 0,
    xAxisHeight: 0
  };

  setYAxisWidth = (yAxisWidth: number) => {
    if (this.state.yAxisWidth !== yAxisWidth) this.setState({ yAxisWidth });
  };

  setXAxisHeight = (xAxisHeight: number) => {
    if (this.state.xAxisHeight !== xAxisHeight) this.setState({ xAxisHeight });
  };

  get subtractMargins() {
    return {
      ...this.props,
      height: this.props.height - this.props.margin * 2,
      width: this.props.width - this.props.margin * 2
    };
  }

  get xAxisData() {
    return this.props.bars.map(bar => bar.x);
  }

  get yAxisData() {
    return this.props.bars.map(bar => bar.y);
  }

  render() {
    return (
      <svg height={this.props.height} width={this.props.width} style={{ background: 'white' }}>
        <g transform={`translate(${this.props.margin},${this.props.margin})`}>
          <YAxis
            afterRender={this.setYAxisWidth}
            data={this.yAxisData}
            height={this.subtractMargins.height}
            left={0}
            marginBottom={this.state.xAxisHeight}
          />
          <XAxis
            afterRender={this.setXAxisHeight}
            data={this.xAxisData}
            marginLeft={this.state.yAxisWidth}
            top={this.subtractMargins.height}
            width={this.subtractMargins.width}
          />
          <Bars
            bars={this.props.bars}
            height={this.subtractMargins.height}
            marginBottom={this.state.xAxisHeight}
            marginLeft={this.state.yAxisWidth}
            width={this.subtractMargins.width}
          />
        </g>
      </svg>
    );
  }
}
