import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { extent, select, scaleLinear } from "d3";

storiesOf("Development/d3-workshop/2a", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Linear scale", () => {
    return <LinearScale width={200} height={100} points={[0, 5, 10]} />;
  });
type Props = {
  height: number;
  points: number[];
  width: number;
};

function draw(element: SVGSVGElement | null, props: Props) {}

const LinearScale = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    draw(ref.current, props);
  }, [props]);

  return <svg height={props.height} width={props.width} ref={ref} />;
};
