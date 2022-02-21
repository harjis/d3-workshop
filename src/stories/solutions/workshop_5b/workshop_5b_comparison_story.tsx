import * as React from "react";
import { storiesOf } from "@storybook/react";

import type { ChildrenProps } from "../workshop_4b/chart_container";
import ChartContainer from "../workshop_4b/chart_container";
import ResizableContainer from "../helpers/resizable_container_helper";
import type { StackGroupValue } from "./stack_group_bars_perf";
import { StackGroupBarsPerf } from "./stack_group_bars_perf";
import { XAxis } from "../workshop_4a/x_axis";
import { YAxis } from "../workshop_4a/y_axis";
import { StackGroupBars } from "../workshop_5a/stack_group_bars";
import { range } from "d3";
import { useMemo } from "react";

const wrapperStyle = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => ({
  background: "white",
  border: "1px solid lightgrey",
  height,
  width,
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
storiesOf("Development/d3-workshop/Solutions/5b", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("StackGroupBarPerfChart compared with non performance optimized", () => {
    const bars = useMemo(() => getBars(), []);
    return (
      <div>
        <ResizableContainer>
          {({ height, width, isResizing }) => (
            <div
              style={wrapperStyle({
                height,
                width,
              })}
            >
              <BarChartPerf
                bars={bars}
                height={height}
                isResizing={isResizing}
                margin={8}
                width={width}
              />
            </div>
          )}
        </ResizableContainer>
        <ResizableContainer>
          {({ height, width, isResizing }) => (
            <div
              style={wrapperStyle({
                height,
                width,
              })}
            >
              <BarChart
                bars={bars}
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
type Props = {
  bars: StackGroupValue[];
  height: number;
  isResizing: boolean;
  margin: number;
  width: number;
};

const BarChartPerf = (props: Props) => (
  <ChartContainer
    height={props.height}
    margin={props.margin}
    width={props.width}
  >
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
          data={props.bars.map((bar) => bar.x)}
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

const BarChart = (props: Props) => (
  <ChartContainer
    height={props.height}
    margin={props.margin}
    width={props.width}
  >
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
          data={props.bars.map((bar) => bar.x)}
          isResizing={props.isResizing}
          marginLeft={childrenProps.getMarginLeft()}
          top={childrenProps.getHeight()}
          width={childrenProps.getWidth()}
        />
        <StackGroupBars
          bars={props.bars}
          height={childrenProps.getHeight()}
          marginBottom={childrenProps.getMarginBottom()}
          marginLeft={childrenProps.getMarginLeft()}
          width={childrenProps.getWidth()}
        />
      </React.Fragment>
    )}
  </ChartContainer>
);

export const getAxisDataForValueType = (
  values: StackGroupValue[]
): number[] => {
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

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getBars() {
  return range(0, 1000)
    .map((r) => [
      {
        groupId: "0",
        valueId: "0",
        valueType: "value",
        x: r,
        y: randomBetween(0, 20),
      },
      {
        groupId: "1",
        valueId: "1",
        valueType: "value",
        x: r,
        y: randomBetween(0, 20),
      },
      {
        groupId: "1",
        valueId: "2",
        valueType: "value",
        x: r,
        y: randomBetween(0, 20),
      },
    ])
    .flat();
}
