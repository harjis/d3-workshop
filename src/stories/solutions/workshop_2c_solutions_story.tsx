import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { extent, select, scaleLinear } from "d3";

storiesOf("Development/d3-workshop/Solutions/2c", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Linear scale with margins", () => {
    return (
      <LinearScale
        xMargin={8}
        yMargin={8}
        width={200}
        height={100}
        points={[0, 5, 10]}
      />
    );
  });
type Props = {
  height: number;
  points: number[];
  width: number;
  xMargin: number;
  yMargin: number;
};

function draw(element: SVGSVGElement | null, props: Props): void {
  if (!element) {
    return;
  }

  const points = select<SVGSVGElement, number[]>(element)
    .selectAll("circle")
    .data(props.points);
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

function subtractMargins(props: Props) {
  return {
    ...props,
    height: props.height - props.xMargin * 2,
    width: props.width - props.yMargin * 2,
  };
}
const LinearScale = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    draw(ref.current, subtractMargins(props));
  }, [props]);

  return (
    <svg height={props.height} width={props.width}>
      <g transform={`translate(${props.xMargin},${props.yMargin})`} ref={ref} />
    </svg>
  );
};
