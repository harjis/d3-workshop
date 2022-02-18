import React from "react";
import { storiesOf } from "@storybook/react";
// If you want same blues as in solution
import { schemeBlues } from "d3";
storiesOf('Development/d3-workshop/2d', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('Band scale with bars', () => {
  return <BarChart width={500} height={400} bars={[]} />;
});
type Props = {
  height: number;
  bars: any;
  width: number;
};

class BarChart extends React.Component<Props> {
  componentDidMount() {
    drawBars(this.ref, this.props);
  }

  componentDidUpdate(nextProps: Props) {
    drawBars(this.ref, this.props);
  }

  applyRef = ref => this.ref = ref;
  ref: Element | null | undefined;

  render() {
    return <svg height={this.props.height} width={this.props.width} ref={this.applyRef} />;
  }

}

function drawBars(element: Element | null | undefined, props: Props) {}