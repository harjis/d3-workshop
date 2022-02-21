import React, { useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  scaleLinear,
  Selection,
  ScaleLinear,
  ScaleBand,
} from "d3";

type Bar = {
  x: number;
  y: number;
};
type Props = {
  bars: Bar[];
  height: number;
  marginBottom: number;
  marginLeft: number;
  width: number;
};

class BarsD3 {
  constructor(element: SVGGElement, props: Props) {
    this.selection = select(element).append("g");
    const yScale = this.getYScale(props);
    const xScale = this.getXScale(props);
    this.render(props, xScale, yScale);
  }

  selection: Selection<SVGGElement, unknown, null, undefined>;

  update(nextProps: Props) {
    this.selection.selectAll("rect").remove();
    const yScale = this.getYScale(nextProps);
    const xScale = this.getXScale(nextProps);
    this.render(nextProps, xScale, yScale);
  }

  getYScale(props: Props): ScaleLinear<number, number> {
    return scaleLinear()
      .range([props.height - props.marginBottom, 0])
      .domain([0, Math.max(...props.bars.map((bar) => bar.y))]);
  }

  getXScale(props: Props): ScaleBand<number> {
    return scaleBand<number>()
      .range([0, props.width - props.marginLeft])
      .domain(props.bars.map((bar) => bar.x))
      .padding(0.1);
  }

  render(
    props: Props,
    xScale: ScaleBand<number>,
    yScale: ScaleLinear<number, number>
  ) {
    const bars = this.selection
      .attr("transform", `translate(${props.marginLeft}, ${0})`)
      .selectAll("rect")
      .data(props.bars);
    bars
      .enter()
      .append("rect")
      .attr("fill", "black")
      .attr("height", (d) => props.height - props.marginBottom - yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.y))
      .attr("x", (d) => xScale(d.x) as number);
  }
}

export const Bars = (props: Props): JSX.Element => {
  const ref = useRef<SVGGElement>(null);
  const barRef = useRef<BarsD3 | null>(null);

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      barRef.current = new BarsD3(ref.current, props);
    }
    // Mistake #1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    barRef.current?.update(props);
  }, [props]);

  return <g ref={ref} />;
};
