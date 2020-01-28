/* eslint-disable */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { select, transition } from 'd3';



storiesOf('Development/d3-workshop/Solutions/1', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('Nested list of alphabet', () => {
    return <Alphabet />;
  });

class Alphabet extends React.Component {
  state = { alphabet: [{ id: 1, values: ['a', 'b'] }, { id: 2, values: ['c', 'd'] }] };
  componentDidMount() {
    draw(this.ref, this.state.alphabet);
    setTimeout(() => {
      this.setState({ alphabet: [{ id: 1, values: ['b'] }, { id: 2, values: ['d'] }] });
    }, 1000);

    setTimeout(() => {
      this.setState({
        alphabet: [{ id: 1, values: ['b'] }, { id: 3, values: ['f'] }, { id: 2, values: ['d'] }]
      });
    }, 2000);
  }

  componentDidUpdate() {
    draw(this.ref, this.state.alphabet);
  }

  applyRef = ref => (this.ref = ref);

  render() {
    return (
      <svg height="100" width="200" ref={this.applyRef}>
        <g transform="translate(16, 16)" />
      </svg>
    );
  }
}

function draw(element, alphabet) {
  const t = transition().duration(750);

  const groups = select(element)
    .select('g')
    .selectAll('g')
    .data(alphabet, d => d.id);

  groups.transition(t).attr('transform', (d, i) => `translate(${i * 32},0)`);

  groups
    .exit()
    .transition(t)
    .remove();

  const groupsEnter = groups
    .enter()
    .append('g')
    .transition(t)
    .attr('transform', (d, i) => `translate(${i * 32},0)`);

  const texts = groups
    .merge(groupsEnter)
    .selectAll('text')
    .data(d => d.values, d => d);

  texts
    .exit()
    .transition(t)
    .attr('fill', 'brown')
    .attr('y', 60)
    .style('fill-opacity', 1e-6)
    .remove();

  texts
    .attr('fill', 'black')
    .attr('y', 0)
    .style('fill-opacity', 1)
    .transition(t)
    .attr('x', (d, i) => i * 10);

  texts
    .enter()
    .append('text')
    .attr('fill', 'green')
    .attr('dy', '.35em')
    .attr('y', -60)
    .attr('x', (d, i) => i * 10)
    .style('fill-opacity', 1e-6)
    .text(d => d)
    .transition(t)
    .attr('y', 0)
    .style('fill-opacity', 1);
}
