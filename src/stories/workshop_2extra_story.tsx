import React from "react";
import { storiesOf } from "@storybook/react";
const config = {
  red: '#D64242',
  orange: '#F1C664',
  yellow: '#F4EB72',
  green: '#65C092',
  blue: '#4096C6',
  lightBlue: '#81C7EF',
  purple: '#D99BBE',
  black: '#414141'
};
storiesOf('Development/d3-workshop/2extra', module).addDecorator(getStory => {
  const style = {
    background: 'lightgrey',
    height: window.innerHeight,
    width: window.innerWidth,
    overflow: 'scroll'
  };
  return <div style={style}>{getStory()}</div>;
}).add('Plot per row checkboxes', () => {
  return <Boxes boxes={['1', '2', '3', '4', '5', '6']} />;
});
const colors = [config.red, config.orange, config.yellow, config.green, config.blue, config.lightBlue, config.purple, config.black];
type Props = {
  boxes: string[];
};

function Boxes(props: Props) {
  return <div style={containerStyles()}>
      {props.boxes.map(box => {
      return <div key={box} style={{ ...boxStyle(),
        background: 'white'
      }} onClick={() => console.log('Should toggle color')}>
            &nbsp;
          </div>;
    })}
    </div>;
}

function containerStyles() {
  return {
    display: 'flex',
    height: '100px',
    width: '600px'
  };
}

function boxStyle() {
  return {
    height: '100%',
    flexGrow: 1,
    border: '1px solid'
  };
}