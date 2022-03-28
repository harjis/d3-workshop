import React, { useState } from "react";
import { storiesOf } from "@storybook/react";

import { FutureBars } from "./future_bars";
import { XAxis } from "../workshop_4a/x_axis";
import { YAxis } from "../workshop_4a/y_axis";
import ChartContainer, { ChildrenProps } from "../workshop_4b/chart_container";

storiesOf("Development/d3-workshop/Solutions/6 - FUTURE", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("BarChart with reusable components", () => {
    return <BarChart margin={8} width={500} height={400} />;
  });

type Bar = {
  x: number;
  y: number;
};
type Props = {
  height: number;
  margin: number;
  width: number;
};
type State = {
  ascendingData: boolean;
};

const BarChart = (props: Props): JSX.Element => {
  function xAxisData() {
    return getData(state.ascendingData).map((bar) => bar.x);
  }

  function yAxisData() {
    return getData(state.ascendingData).map((bar) => bar.y);
  }

  const [state, setState] = useState<State>({
    ascendingData: true,
  });

  const changeData = () => {
    setState({ ...state, ascendingData: !state.ascendingData });
  };

  return (
    <div>
      <button onClick={() => changeData()}>Change data</button>
      <ChartContainer
        height={props.height}
        margin={props.margin}
        width={props.width}
      >
        {(childrenProps: ChildrenProps) => (
          <React.Fragment>
            <YAxis
              afterRender={childrenProps.setMarginLeft}
              data={yAxisData()}
              height={childrenProps.getHeight()}
              isResizing={false}
              left={0}
              marginBottom={childrenProps.getMarginBottom()}
            />
            <XAxis
              afterRender={childrenProps.setMarginBottom}
              data={xAxisData()}
              isResizing={false}
              marginLeft={childrenProps.getMarginLeft()}
              top={childrenProps.getHeight()}
              width={childrenProps.getWidth()}
            />
            <FutureBars
              bars={getData(state.ascendingData)}
              height={childrenProps.getHeight()}
              marginBottom={childrenProps.getMarginBottom()}
              marginLeft={childrenProps.getMarginLeft()}
              width={childrenProps.getWidth()}
            />
          </React.Fragment>
        )}
      </ChartContainer>
    </div>
  );
};

function getData(ascendingData: boolean): Bar[] {
  if (ascendingData) {
    return [
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
    ];
  }

  return [
    {
      x: 0,
      y: 10,
    },
    {
      x: 1,
      y: 9,
    },
    {
      x: 2,
      y: 8,
    },
    {
      x: 3,
      y: 7,
    },
    {
      x: 4,
      y: 6,
    },
    {
      x: 5,
      y: 5,
    },
    {
      x: 6,
      y: 4,
    },
    {
      x: 7,
      y: 3,
    },
    {
      x: 8,
      y: 2,
    },
    {
      x: 9,
      y: 1,
    },
  ];
}
