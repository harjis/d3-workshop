// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { extent, select, scaleLinear } from 'd3';



storiesOf('Development/d3-workshop/Solutions/2a', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('Linear scale', () => {
    return <LinearScale width={200} height={100} points={[0, 5, 10]} />;
  });

type Props = {|
  height: number,
  points: number[],
  width: number
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

function draw(element: ?Element, props: Props) {
  const points = select(element)
    .selectAll('circle')
    .data(props.points);
  const xScale = scaleLinear()
    .range([0, props.width])
    .domain(extent(props.points));

  points
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('r', 2)
    .attr('cy', props.height / 2)
    .attr('cx', d => xScale(d));

  const texts = select(element)
    .selectAll('text')
    .data(props.points);

  texts
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('y', props.height / 2 - 8)
    .attr('x', d => xScale(d))
    .text(d => d);
}
