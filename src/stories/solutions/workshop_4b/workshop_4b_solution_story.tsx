import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Bars } from "../workshop_4a/bars";
import ChartContainer from "./chart_container";
import { XAxis } from "../workshop_4a/x_axis";
import { YAxis } from "../workshop_4a/y_axis";
import type { ChildrenProps } from "./chart_container";

storiesOf("Development/d3-workshop/Solutions/4b", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("BarChart with reusable components and a container", () => {
    return (
      <BarChart
        margin={8}
        width={500}
        height={400}
        bars={[
          {
            x: 0,
            y: 1,
          },
          {
            x: 1,
            y: 2,
          },
          {
            x: 2,
            y: 3,
          },
          {
            x: 3,
            y: 4,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 6,
          },
          {
            x: 6,
            y: 7,
          },
          {
            x: 7,
            y: 8,
          },
          {
            x: 8,
            y: 9,
          },
          {
            x: 9,
            y: 10,
          },
        ]}
      />
    );
  });
type Bar = {
  x: number;
  y: number;
};
type Props = {
  height: number;
  margin: number;
  bars: Bar[];
  width: number;
};

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
          data={props.bars.map((bar) => bar.y)}
          height={childrenProps.getHeight()}
          left={0}
          marginBottom={childrenProps.getMarginBottom()}
        />
        <XAxis
          afterRender={childrenProps.setMarginBottom}
          data={props.bars.map((bar) => bar.x)}
          marginLeft={childrenProps.getMarginLeft()}
          top={childrenProps.getHeight()}
          width={childrenProps.getWidth()}
        />
        <Bars
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
