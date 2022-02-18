import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { select, scaleBand } from "d3";

storiesOf("Development/d3-workshop/Solutions/2b", module)
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

function drawPoints(element: SVGSVGElement | null, props: Props): void {
  if (!element) {
    return;
  }
  const points = select<SVGSVGElement, number[]>(element)
    .selectAll("circle")
    .data(props.points);
  const xScale = scaleBand<number>()
    .range([0, props.width])
    .domain(props.points);
  points
    .enter()
    .append("circle")
    .attr("fill", "black")
    .attr("r", 2)
    .attr("cy", props.height / 2)
    // Return type of band-scale is number | undefined
    // attr doesn't accept undefined
    .attr("cx", (d) => xScale(d) as number);
  const texts = select(element).selectAll("text").data(props.points);
  texts
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", props.height / 2 - 8)
    // Return type of band-scale is number | undefined
    // attr doesn't accept undefined
    .attr("x", (d) => xScale(d) as number)
    .text((d) => d);
}

const BAR_HEIGHT = 10;

function drawBars(element: SVGSVGElement | null, props: Props): void {
  if (!element) {
    return;
  }
  const points = select<SVGSVGElement, number[]>(element)
    .selectAll("rect")
    .data(props.points);
  const xScale = scaleBand<number>()
    .range([0, props.width])
    .domain(props.points)
    .padding(0.1);
  points
    .enter()
    .append("rect")
    .attr("fill", "black")
    .attr("height", BAR_HEIGHT)
    .attr("width", xScale.bandwidth())
    .attr("y", props.height / 2)
    // Return type of band-scale is number | undefined
    // attr doesn't accept undefined
    .attr("x", (d) => xScale(d) as number);
  const texts = select<SVGSVGElement, number[]>(element)
    .selectAll("text")
    .data(props.points);
  texts
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", props.height / 2 - BAR_HEIGHT)
    // Return type of band-scale is number | undefined
    // attr doesn't accept undefined
    .attr("x", (d) => xScale(d) as number)
    .text((d) => d);
}

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
