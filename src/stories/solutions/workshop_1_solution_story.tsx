/* eslint-disable */
import React from "react";
import { storiesOf } from "@storybook/react";
import { select, transition } from "d3";
storiesOf('Development/d3-workshop/Solutions/1', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('Flat list of alphabet', () => {
  return <Alphabet />;
});

class Alphabet extends React.Component {
  state = {
    alphabet: ['a', 'b', 'c', 'd']
  };

  componentDidMount() {
    draw(this.ref, this.state.alphabet);
    setTimeout(() => {
      this.setState({
        alphabet: ['b', 'd']
      });
    }, 1000);
  }

  componentDidUpdate() {
    draw(this.ref, this.state.alphabet);
  }

  applyRef = ref => this.ref = ref;

  render() {
    return <svg height="100" width="200" ref={this.applyRef}>
        <g transform="translate(16, 16)" />
      </svg>;
  }

}

function draw(element, alphabet) {
  const t = transition().duration(750);
  // JOIN new data with old elements.
  const text = select(element).select('g').selectAll('text').data(alphabet, d => d);
  // EXIT old elements not present in new data.
  text.exit().attr('fill', 'brown').transition(t).attr('y', 60).style('fill-opacity', 1e-6).remove();
  // UPDATE old elements present in new data.
  text.attr('fill', 'black').attr('y', 0).style('fill-opacity', 1).transition(t).attr('x', (d, i) => i * 32);
  // ENTER new elements present in new data.
  text.enter().append('text').attr('fill', 'green').attr('dy', '.35em').attr('y', -60).attr('x', (d, i) => i * 32).style('fill-opacity', 1e-6).text(d => d).transition(t).attr('y', 0).style('fill-opacity', 1);
}