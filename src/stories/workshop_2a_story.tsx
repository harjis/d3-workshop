import React from "react";
import { storiesOf } from "@storybook/react";
storiesOf('Development/d3-workshop/2a', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('Linear scale', () => {
  return <LinearScale width={200} height={100} points={[0, 5, 10]} />;
});
type Props = {
  height: number;
  points: number[];
  width: number;
};

class LinearScale extends React.Component<Props> {
  componentDidMount() {
    draw(this.ref, this.props);
  }

  componentDidUpdate(nextProps: Props) {
    draw(this.ref, nextProps);
  }

  applyRef = ref => this.ref = ref;
  ref: Element | null | undefined;

  render() {
    return <svg height={this.props.height} width={this.props.width} ref={this.applyRef} />;
  }

}

function draw(element: Element | null | undefined, props: Props) {}