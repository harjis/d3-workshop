// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';

import ChartContainer from '../workshop_4b/chart_container';
import ResizableContainer from '../helpers/resizable_container_helper';
import StackGroupBarsPerf from './stack_group_bars_perf';
import XAxis from '../workshop_4a/x_axis';
import YAxis from '../workshop_4a/y_axis';

import type { ChildrenProps } from '../workshop_4b/chart_container';
import type { StackGroupValue } from './stack_group_bars_perf';



const wrapperStyle = ({ height, width }) => ({
  background: 'white',
  border: '1px solid lightgrey',
  height,
  width
});

/*
 * CPU throttling: 4x slowdown
 *
 * With no perf improvements: 4-8 fps
 * With all possible perf improvements: 13-22 fps
 *
 * CPU throttling: No throttling
 *
 * With no perf improvements: ~40 fps
 * With all possible perf improvements: ~60 fps
 * */

storiesOf('Development/d3-workshop/Solutions/5b', module)
  .addDecorator(getStory => {
    const style = {
      background: 'lightgrey',
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: 'scroll'
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add('StackGroupBarPerfChart with reusable components and a container', () => {
    return (
      <div>
        <ResizableContainer>
          {({ height, width, isResizing }) => (
            <div style={wrapperStyle({ height, width })}>
              <BarChart
                bars={getBars()}
                height={height}
                isResizing={isResizing}
                margin={8}
                width={width}
              />
            </div>
          )}
        </ResizableContainer>
      </div>
    );
  });

type Props = {|
  bars: StackGroupValue[],
  height: number,
  isResizing: boolean,
  margin: number,
  width: number
|};
const BarChart = (props: Props) => (
  <ChartContainer height={props.height} margin={props.margin} width={props.width}>
    {(childrenProps: ChildrenProps) => (
      <React.Fragment>
        <YAxis
          afterRender={childrenProps.setMarginLeft}
          data={getAxisDataForValueType(props.bars)}
          height={childrenProps.getHeight()}
          isResizing={props.isResizing}
          left={0}
          marginBottom={childrenProps.getMarginBottom()}
        />
        <XAxis
          afterRender={childrenProps.setMarginBottom}
          data={props.bars.map(bar => bar.x)}
          isResizing={props.isResizing}
          marginLeft={childrenProps.getMarginLeft()}
          top={childrenProps.getHeight()}
          width={childrenProps.getWidth()}
        />
        <StackGroupBarsPerf
          bars={props.bars}
          height={childrenProps.getHeight()}
          isResizing={props.isResizing}
          marginBottom={childrenProps.getMarginBottom()}
          marginLeft={childrenProps.getMarginLeft()}
          width={childrenProps.getWidth()}
        />
      </React.Fragment>
    )}
  </ChartContainer>
);

export const getAxisDataForValueType = (values: StackGroupValue[]): number[] => {
  const allValues = Array.from(
    values
      .reduce((acc, value) => {
        const key = `${value.x}${value.groupId}`;

        if (!acc.get(key)) {
          return acc.set(key, value.y || 0);
        } else {
          return acc.set(key, acc.get(key) + value.y);
        }
      }, new Map())
      .values()
  );
  return [0, Math.max(...allValues)];
};

function getBars() {
  const bars1 = [
    { groupId: '0', valueId: '0', valueType: 'value', x: 0, y: 1 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 1, y: 2 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 2, y: 3 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 3, y: 4 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 4, y: 5 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 5, y: 6 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 6, y: 7 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 7, y: 8 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 8, y: 9 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 9, y: 10 }
  ];
  const bars2 = [
    { groupId: '0', valueId: '0', valueType: 'value', x: 0, y: 1 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 1, y: 2 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 2, y: 3 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 3, y: 4 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 4, y: 5 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 5, y: 6 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 6, y: 7 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 7, y: 8 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 8, y: 9 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 9, y: 10 },

    { groupId: '1', valueId: '1', valueType: 'value', x: 0, y: 1 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 1, y: 2 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 2, y: 3 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 3, y: 4 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 4, y: 5 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 5, y: 6 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 6, y: 7 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 7, y: 8 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 8, y: 9 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 9, y: 10 }
  ];

  const bars3 = [
    { groupId: '0', valueId: '0', valueType: 'value', x: 0, y: 1 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 1, y: 2 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 2, y: 3 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 3, y: 4 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 4, y: 5 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 5, y: 6 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 6, y: 7 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 7, y: 8 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 8, y: 9 },
    { groupId: '0', valueId: '0', valueType: 'value', x: 9, y: 10 },

    { groupId: '1', valueId: '1', valueType: 'value', x: 0, y: 1 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 1, y: 1 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 2, y: 2 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 3, y: 2 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 4, y: 2 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 5, y: 3 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 6, y: 3 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 7, y: 4 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 8, y: 4 },
    { groupId: '1', valueId: '1', valueType: 'value', x: 9, y: 5 },

    { groupId: '1', valueId: '2', valueType: 'value', x: 0, y: 1 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 1, y: 2 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 2, y: 3 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 3, y: 4 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 4, y: 5 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 5, y: 6 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 6, y: 7 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 7, y: 8 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 8, y: 9 },
    { groupId: '1', valueId: '2', valueType: 'value', x: 9, y: 10 }
  ];
  return bars3;
}
