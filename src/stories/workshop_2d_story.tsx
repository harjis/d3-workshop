import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { select, scaleBand, scaleLinear, scaleQuantize, schemeBlues } from "d3";

storiesOf("Development/d3-workshop/2d", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Band scale with bars", () => {
    return <BarChart width={500} height={400} bars={[]} />;
  });

type Props = {
  height: number;
  bars: unknown;
  width: number;
};

function drawBars(element: SVGSVGElement | null, props: Props): void {}

const BarChart = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    drawBars(ref.current, props);
  }, [props]);

  return <svg height={props.height} width={props.width} ref={ref} />;
};
