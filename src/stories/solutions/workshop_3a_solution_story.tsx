import React, { useEffect, useRef } from "react";
import { storiesOf } from "@storybook/react";
import {
  axisBottom,
  axisLeft,
  select,
  scaleBand,
  scaleLinear,
  Selection,
  ScaleBand,
  ScaleLinear,
} from "d3";

storiesOf("Development/d3-workshop/Solutions/3", module)
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
    return (
      <BarChart
        margin={8}
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
  margin: number;
  bars: Bar[];
  width: number;
};

function drawChart(element: SVGSVGElement | null, props: Props) {
  if (!element) {
    return;
  }

  const yAxisWidth = 18;
  const xAxisHeight = 18;
  const selection = select<SVGSVGElement, Bar[]>(element);
  const xAxisGroup = selection.append("g");
  const yAxisGroup = selection.append("g");
  const barGroup = selection.append("g");
  const xScale = scaleBand<number>()
    .range([0, props.width - yAxisWidth])
    .domain(props.bars.map((bar) => bar.x))
    .padding(0.1);
  // Because of svg coordinate system I would prefer this one
  const yScale = scaleLinear<number>()
    .range([props.height - xAxisHeight, 0])
    .domain([0, Math.max(...props.bars.map((bar) => bar.y))]);
  // OPTION 1.5
  // const yScale = scaleLinear()
  //   .range([0, props.height - xAxisHeight])
  //   .domain([Math.max(...props.bars.map(bar => bar.y)), 0]);
  // OPTION 2
  const yScaleBar = scaleLinear<number>()
    .range([0, props.height - xAxisHeight])
    .domain([0, Math.max(...props.bars.map((bar) => bar.y))]);
  drawXAxis(xAxisGroup, props, xScale, yAxisWidth, xAxisHeight);
  drawYAxis(yAxisGroup, props, yScale, yAxisWidth, xAxisHeight);
  drawBars(barGroup, props, xScale, yScale, yAxisWidth, xAxisHeight); // OPTION 2
  // drawBars(barGroup, props, xScale, yScaleBar, yAxisWidth, xAxisHeight);
}

function drawXAxis(
  selection: Selection<SVGGElement, Bar[], null, undefined>,
  props: Props,
  xScale: ScaleBand<number>,
  yAxisWidth: number,
  xAxisHeight: number
) {
  const axis = axisBottom(xScale);
  selection
    .call(axis)
    .attr(
      "transform",
      `translate(${yAxisWidth}, ${props.height - xAxisHeight})`
    );
}

function drawYAxis(
  selection: Selection<SVGGElement, Bar[], null, undefined>,
  props: Props,
  yScale: ScaleLinear<number, number>,
  yAxisWidth: number,
  xAxisHeight: number
) {
  const axis = axisLeft(yScale);
  selection.call(axis).attr("transform", `translate(${yAxisWidth}, ${0})`);
}

function drawBars(
  selection: Selection<SVGGElement, Bar[], null, undefined>,
  props: Props,
  xScale: ScaleBand<number>,
  yScale: ScaleLinear<number, number>,
  yAxisWidth: number,
  xAxisHeight: number
) {
  const bars = selection
    .attr("transform", `translate(${yAxisWidth}, ${0})`)
    .selectAll("rect")
    .data(props.bars);
  bars
    .enter()
    .append("rect")
    .attr("fill", "black")
    .attr("width", xScale.bandwidth())
    .attr("x", (d) => xScale(d.x) as number)
    .attr("height", (d) => props.height - xAxisHeight - yScale(d.y))
    .attr("y", (d) => yScale(d.y)); // OPTION 2
  // .attr('height', d => yScale(d.y))
  // .attr('y', d => props.height - xAxisHeight - yScale(d.y));
}

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
