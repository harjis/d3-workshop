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
    this.selection
      .attr("transform", `translate(${props.marginLeft}, ${0})`)
      .selectAll("rect")
      .data(props.bars)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("fill", "black")
            .attr("height", (d) => this.store.barHeight(props, d))
            .attr("width", this.store.barWidth(props))
            .attr("y", (d) => this.store.barYPosition(props, d))
            .attr("x", (d) => this.store.barXPosition(props, d)),
        (update) =>
          update.attr("fill", "black").call((update) =>
            update
              .transition()
              .duration(750)
              .attr("height", (d) => this.store.barHeight(props, d))
              .attr("width", this.store.barWidth(props))
              .attr("y", (d) => this.store.barYPosition(props, d))
              .attr("x", (d) => this.store.barXPosition(props, d))
          ),
        (exit) => exit
      );
  }

  render(props: Props) {
    this.selection
      .attr("transform", `translate(${props.marginLeft}, ${0})`)
      .selectAll("rect")
      .data(props.bars)
      .join("rect")
      .attr("fill", "black")
      .attr("height", (d) => this.store.barHeight(props, d))
      .attr("width", this.store.barWidth(props))
      .attr("y", (d) => this.store.barYPosition(props, d))
      .attr("x", (d) => this.store.barXPosition(props, d));
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
