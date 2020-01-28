// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';



storiesOf('Development/d3-workshop/2b', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('Band scale with points', () => {
    return <BandScale type="points" width={200} height={100} points={[0, 5, 10]} />;
  })
  .add('Band scale with bars', () => {
    return <BandScale type="bars" width={200} height={100} points={[0, 5, 10]} />;
  });

type Props = {|
  type: 'points' | 'bars',
  height: number,
  points: number[],
  width: number
|};
class BandScale extends React.Component<Props> {
  componentDidMount() {}

  componentDidUpdate(nextProps: Props) {}

  applyRef = ref => (this.ref = ref);

  ref: ?Element;

  render() {
    return <svg height={this.props.height} width={this.props.width} ref={this.applyRef} />;
  }
}
