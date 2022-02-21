import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";

storiesOf("Development/d3-workshop/3", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("BarChart", () => {
    return <BarChart margin={8} width={500} height={400} bars={[]} />;
  });
type Props = {
  height: number;
  margin: number;
  bars: any;
  width: number;
};

function drawChart(element: Element | null | undefined, props: Props) {
  drawXAxis();
  drawYAxis();
  drawBars();
}

function drawXAxis() {}

function drawYAxis() {}

function drawBars() {}

const BarChart = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  function subtractMargins(props: Props) {
    return {
      ...props,
      height: props.height - props.margin * 2,
      width: props.width - props.margin * 2,
    };
  }

  useEffect(() => {
    drawChart(ref.current, subtractMargins(props));
  }, [props]);

  return (
    <svg
      height={props.height}
      width={props.width}
      style={{
        background: "white",
      }}
    >
      <g transform={`translate(${props.margin},${props.margin})`} ref={ref} />
    </svg>
  );
};
