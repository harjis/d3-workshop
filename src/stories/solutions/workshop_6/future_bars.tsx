import React, { useEffect, useRef } from "react";
import { select, Selection } from "d3";

import type { Props } from "./types";
import { BarsStore } from "./bars_store";
import { usePropsDiff } from "./usePropsDiff";

class BarsD3 {
  constructor(element: SVGGElement) {
    this.selection = select(element).append("g");
    this.store = new BarsStore();
  }

  selection: Selection<SVGGElement, unknown, null, undefined>;
  store: BarsStore;

  animate(props: Props) {
    const yScale = this.store.getYScale(props);
    const xScale = this.store.getXScale(props);

    this.selection
      .attr("transform", `translate(${props.marginLeft}, ${0})`)
      .selectAll("rect")
      .data(props.bars)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("fill", "black")
            .attr(
              "height",
              (d) => props.height - props.marginBottom - yScale(d.y)
            )
            .attr("width", xScale.bandwidth())
            .attr("y", (d) => yScale(d.y))
            .attr("x", (d) => xScale(d.x) as number),
        (update) =>
          update.attr("fill", "black").call((update) =>
            update
              .transition()
              .duration(750)
              .attr(
                "height",
                (d) => props.height - props.marginBottom - yScale(d.y)
              )
              .attr("width", xScale.bandwidth())
              .attr("y", (d) => yScale(d.y))
              .attr("x", (d) => xScale(d.x) as number)
          ),
        (exit) => exit
      );
  }

  render(props: Props) {
    const yScale = this.store.getYScale(props);
    const xScale = this.store.getXScale(props);

    this.selection
      .attr("transform", `translate(${props.marginLeft}, ${0})`)
      .selectAll("rect")
      .data(props.bars)
      .join("rect")
      .attr("fill", "black")
      .attr("height", (d) => props.height - props.marginBottom - yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.y))
      .attr("x", (d) => xScale(d.x) as number);
  }
}

export const FutureBars = (props: Props): JSX.Element => {
  const ref = useRef<SVGGElement>(null);
  const barRef = useRef<BarsD3 | null>(null);
  const changedKeys = usePropsDiff(props);

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      barRef.current = new BarsD3(ref.current);
    }
  }, []);

  useEffect(() => {
    if (changedKeys.length === 1 && changedKeys[0] === "bars") {
      barRef.current?.animate(props);
    } else {
      barRef.current?.render(props);
    }
  }, [props, changedKeys]);

  return <g ref={ref} />;
};
