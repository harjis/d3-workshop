/* eslint-disable */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { select, transition } from 'd3';



storiesOf('Development/d3-workshop/1', module)
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
  state = { alphabet: [['a', 'b'], ['c', 'd']] };
  componentDidMount() {
    draw(this.ref, this.state.alphabet);
    setTimeout(() => {
      this.setState({ alphabet: [['b'], ['d']] });
    }, 1000);
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

function draw(element, alphabet) {}
