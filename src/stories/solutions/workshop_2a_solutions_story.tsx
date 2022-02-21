import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { extent, select, scaleLinear } from "d3";

storiesOf("Development/d3-workshop/Solutions/2a", module)
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

function draw(element: SVGSVGElement | null, props: Props) {
  if (!element) {
    return;
  }

  const points = select(element).selectAll("circle").data(props.points);
  // Returns the minimum and maximum value in the given iterable using natural order.
  // If the iterable contains no comparable values, returns [undefined, undefined].
  // We know that the array does contain comparable values so for that reason we can type cast it
  const xScale = scaleLinear()
    .range([0, props.width])
    .domain(extent(props.points) as [number, number]);
  points
    .enter()
    .append("circle")
    .attr("fill", "black")
    .attr("r", 2)
    .attr("cy", props.height / 2)
    .attr("cx", (d) => xScale(d));
  const texts = select(element).selectAll("text").data(props.points);
  texts
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", props.height / 2 - 8)
    .attr("x", (d) => xScale(d))
    .text((d) => d);
}

const LinearScale = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    draw(ref.current, props);
  }, [props]);

  return <svg height={props.height} width={props.width} ref={ref} />;
};
