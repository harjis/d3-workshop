import * as React from "react";
import { storiesOf } from "@storybook/react";
import { FutureBars } from "./future_bars";
import { XAxis } from "../workshop_4a/x_axis";
import { YAxis } from "../workshop_4a/y_axis";
import { useState } from "react";

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
  yAxisWidth: number;
  xAxisHeight: number;
};

const BarChart = (props: Props): JSX.Element => {
  function subtractMargins(props: Props) {
    return {
      ...props,
      height: props.height - props.margin * 2,
      width: props.width - props.margin * 2,
    };
  }
  function xAxisData(props: Props) {
    return getData(state.ascendingData).map((bar) => bar.x);
  }

  function yAxisData(props: Props) {
    return getData(state.ascendingData).map((bar) => bar.y);
  }

  const [state, setState] = useState<State>({
    ascendingData: true,
    yAxisWidth: 0,
    xAxisHeight: 0,
  });
  const setYAxisWidth = (yAxisWidth: number) => {
    if (state.yAxisWidth !== yAxisWidth)
      setState({
        ...state,
        yAxisWidth,
      });
  };
  const setXAxisHeight = (xAxisHeight: number) => {
    if (state.xAxisHeight !== xAxisHeight)
      setState({
        ...state,
        xAxisHeight,
      });
  };

  const changeData = () => {
    setState({ ...state, ascendingData: !state.ascendingData });
  };

  return (
    <div>
      <button onClick={() => changeData()}>Change data</button>
      <svg
        height={props.height}
        width={props.width}
        style={{
          background: "white",
        }}
      >
        <g transform={`translate(${props.margin},${props.margin})`}>
          <YAxis
            afterRender={setYAxisWidth}
            data={yAxisData(props)}
            height={subtractMargins(props).height}
            isResizing={false}
            left={0}
            marginBottom={state.xAxisHeight}
          />
          <XAxis
            afterRender={setXAxisHeight}
            data={xAxisData(props)}
            isResizing={false}
            marginLeft={state.yAxisWidth}
            top={subtractMargins(props).height}
            width={subtractMargins(props).width}
          />
          <FutureBars
            bars={getData(state.ascendingData)}
            height={subtractMargins(props).height}
            marginBottom={state.xAxisHeight}
            marginLeft={state.yAxisWidth}
            width={subtractMargins(props).width}
          />
        </g>
      </svg>
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
