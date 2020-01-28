// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';



storiesOf('Development/d3-workshop/2c', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('Linear scale with margins', () => {
    return <LinearScale xMargin={8} yMargin={8} width={200} height={100} points={[0, 5, 10]} />;
  });

type Props = {|
  height: number,
  points: number[],
  width: number,
  xMargin: number,
  yMargin: number
|};
class LinearScale extends React.Component<Props> {
  componentDidMount() {
    draw(this.ref, this.props);
  }

  componentDidUpdate(nextProps: Props) {
    draw(this.ref, nextProps);
  }

  applyRef = ref => (this.ref = ref);

  ref: ?Element;

  render() {
    return <svg height={this.props.height} width={this.props.width} ref={this.applyRef} />;
  }
}

function draw(element: ?Element, props: Props) {}
