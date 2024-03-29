import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import { select, scaleBand, scaleLinear, scaleQuantize, schemeBlues } from "d3";

storiesOf("Development/d3-workshop/Solutions/2d", module)
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
    return (
      <BarChart
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
  bars: Bar[];
  width: number;
};

function drawBars(element: SVGSVGElement | null, props: Props): void {
  if (!element) {
    return;
  }

  const bars = select<SVGSVGElement, Bar[]>(element)
    .selectAll("rect")
    .data(props.bars);
  const xScale = scaleBand<number>()
    .range([0, props.width])
    .domain(props.bars.map((bar) => bar.x))
    .padding(0.1);
  const yScale = scaleLinear()
    .range([0, props.height])
    .domain([0, Math.max(...props.bars.map((bar) => bar.y))]);
  const colorScale = scaleQuantize<string>()
    .domain([0, Math.max(...props.bars.map((bar) => bar.y))])
    .range(schemeBlues[9]);
  bars
    .enter()
    .append("rect")
    .attr("fill", (d) => colorScale(d.y))
    .attr("height", (d) => yScale(d.y))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => props.height - yScale(d.y))
    .attr("x", (d) => xScale(d.x) as number);
}

const BarChart = (props: Props): JSX.Element => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    drawBars(ref.current, props);
  }, [props]);

  return <svg height={props.height} width={props.width} ref={ref} />;
};
