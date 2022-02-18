import React from "react";
import { storiesOf } from "@storybook/react";
storiesOf('Development/d3-workshop/3', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('BarChart', () => {
  return <BarChart margin={8} width={500} height={400} bars={[]} />;
});
type Props = {
  height: number;
  margin: number;
  bars: any;
  width: number;
};

class BarChart extends React.Component<Props> {
  componentDidMount() {
    drawChart(this.ref, this.props);
  }

  componentDidUpdate(nextProps: Props) {
    drawChart(this.ref, nextProps);
  }

  applyRef = ref => this.ref = ref;
  ref: Element | null | undefined;

  render() {
    return <svg height={this.props.height} width={this.props.width} style={{
      background: 'white'
    }}>
        <g ref={this.applyRef} />
      </svg>;
  }

}

function drawChart(element: Element | null | undefined, props: Props) {
  drawXAxis();
  drawYAxis();
  drawBars();
}

function drawXAxis() {}

function drawYAxis() {}

function drawBars() {}