// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { select, scaleBand } from 'd3';



storiesOf('Development/d3-workshop/Solutions/2b', module)
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
  componentDidMount() {
    if (this.props.type === 'points') {
      drawPoints(this.ref, this.props);
    } else {
      drawBars(this.ref, this.props);
    }
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.type === 'points') {
      drawPoints(this.ref, nextProps);
    } else {
      drawBars(this.ref, nextProps);
    }
  }

  applyRef = ref => (this.ref = ref);

  ref: ?Element;

  render() {
    return <svg height={this.props.height} width={this.props.width} ref={this.applyRef} />;
  }
}

function drawPoints(element: ?Element, props: Props) {
  const points = select(element)
    .selectAll('circle')
    .data(props.points);
  const xScale = scaleBand()
    .range([0, props.width])
    .domain(props.points);

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

const BAR_HEIGHT = 10;
function drawBars(element: ?Element, props: Props) {
  const points = select(element)
    .selectAll('rect')
    .data(props.points);
  const xScale = scaleBand()
    .range([0, props.width])
    .domain(props.points)
    .padding(0.1);

  points
    .enter()
    .append('rect')
    .attr('fill', 'black')
    .attr('height', BAR_HEIGHT)
    .attr('width', xScale.bandwidth())
    .attr('y', props.height / 2)
    .attr('x', d => xScale(d));

  const texts = select(element)
    .selectAll('text')
    .data(props.points);

  texts
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('y', props.height / 2 - BAR_HEIGHT)
    .attr('x', d => xScale(d))
    .text(d => d);
}
