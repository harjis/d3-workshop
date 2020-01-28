// @flow
// $FlowFixMe shut the fuck up, Flow!
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { scaleOrdinal } from 'd3';

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

/**
 * You can find tests for the color bucket here
 * https://github.com/manko/processor-edge/blob/487e97a6212cc84e8c4cd0856793be46756b6e8e/frontend/test/unit/utils/color_test.js
 * */

storiesOf('Development/d3-workshop/Solutions/2extra', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('Plot per row checkboxes', () => {
    return <Boxes boxes={['1', '2', '3', '4', '5', '6']} />;
  });

type Props = {|
  boxes: string[]
|};
const colorBucket = initColorBucket();
function Boxes(props: Props) {
  const [selectedBoxes, setBoxes] = useState([]);
  const toggleBox = box =>
    setBoxes(
      selectedBoxes.includes(box)
        ? [...new Set(selectedBoxes.filter(selectedBox => selectedBox !== box))]
        : [...new Set(selectedBoxes.concat(box))]
    );
  return (
    <div style={containerStyles()}>
      {props.boxes.map(box => {
        return (
          <div
            key={box}
            style={{ ...boxStyle(), background: colorBucket(selectedBoxes)(box) }}
            onClick={() => toggleBox(box)}
          >
            &nbsp;
          </div>
        );
      })}
    </div>
  );
}

function getColorScale(domain: string[]): Function {
  const colors = [
    config.red,
    config.orange,
    config.yellow,
    config.green,
    config.blue,
    config.lightBlue,
    config.purple,
    config.black
  ];
  return scaleOrdinal()
    .range(colors)
    .domain(domain)
    .unknown('white');
}

function initColorBucket() {
  let currentIds = [];
  let notFoundIndex = 0;
  const removeNotExisting = (currentIds, newIds) =>
    currentIds.map(currentId => {
      if (newIds.findIndex(id => currentId === id) === -1) {
        return `nf${notFoundIndex++}`;
      } else {
        return currentId;
      }
    });
  const addToFirstAvailable = (currentIds, newIds) => {
    const _currentIds = [...currentIds];
    newIds.forEach(newId => {
      if (_currentIds.findIndex(id => newId === id) === -1) {
        const firstAvailableIndex = _currentIds.findIndex(id => id.toString().includes('nf'));
        if (firstAvailableIndex === -1) {
          _currentIds.push(newId);
        } else {
          _currentIds[firstAvailableIndex] = newId;
        }
      }
    });
    return _currentIds;
  };
  return function(newIds) {
    currentIds = removeNotExisting(currentIds, newIds);
    currentIds = addToFirstAvailable(currentIds, newIds);
    return function(id) {
      return getColorScale(currentIds)(id);
    };
  };
}

function containerStyles() {
  return { display: 'flex', height: '100px', width: '600px' };
}
function boxStyle() {
  return { height: '100%', flexGrow: 1, border: '1px solid' };
}
