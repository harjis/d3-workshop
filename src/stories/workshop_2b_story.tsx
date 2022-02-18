import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { select, scaleBand } from "d3";

storiesOf("Development/d3-workshop/2b", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Band scale with points", () => {
    return (
      <BandScale type="points" width={200} height={100} points={[0, 5, 10]} />
    );
  })
  .add("Band scale with bars", () => {
    return (
      <BandScale type="bars" width={200} height={100} points={[0, 5, 10]} />
    );
  });
type Props = {
  type: "points" | "bars";
  height: number;
  points: number[];
  width: number;
};

function drawPoints(element: SVGSVGElement | null, props: Props): void {}

const BAR_HEIGHT = 10;

function drawBars(element: SVGSVGElement | null, props: Props): void {}

const BandScale = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (props.type === "points") {
      drawPoints(ref.current, props);
    } else {
      drawBars(ref.current, props);
    }
  }, [props]);

  return <svg height={props.height} width={props.width} ref={ref} />;
};
