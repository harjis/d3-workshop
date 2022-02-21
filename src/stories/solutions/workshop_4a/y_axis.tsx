import React, { useEffect, useRef } from "react";
import { axisLeft, select, scaleLinear, Selection, ScaleLinear } from "d3";

type Props = {
  afterRender: (width: number) => void;
  data: number[];
  height: number;
  isResizing: boolean;
  left: number;
  marginBottom: number;
};

class YAxisD3 {
  constructor(element: SVGGElement, props: Props) {
    this.axisWidth = 0;
    this.selection = select(element);
    const yScale = this.getScale(props);
    this.render(props, yScale);
  }

  selection: Selection<SVGGElement, unknown, null, undefined>;
  axisWidth: number;

  update(nextProps: Props) {
    const yScale = this.getScale(nextProps);
    this.render(nextProps, yScale);
  }

  getScale(props: Props) {
    return scaleLinear()
      .range([props.height - props.marginBottom, 0])
      .domain([0, Math.max(...props.data)]);
  }

  _axisWidth(props: Props): number {
    const node = this.selection.node();
    if (node && (this.axisWidth === 0 || !props.isResizing)) {
      this.axisWidth = node.getBBox().width;
    }

    return this.axisWidth;
  }

  render(props: Props, yScale: ScaleLinear<number, number>) {
    const axis = axisLeft(yScale);
    this.selection.call(axis);
    this.selection.attr(
      "transform",
      `translate(${props.left + this._axisWidth(props)},${0})`
    );
    props.afterRender(this._axisWidth(props));
  }
}

export const YAxis = (props: Props): JSX.Element => {
  const ref = useRef<SVGGElement>(null);
  const yAxisRef = useRef<YAxisD3 | null>(null);

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      yAxisRef.current = new YAxisD3(ref.current, props);
    }
    // Mistake #1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    yAxisRef.current?.update(props);
  }, [props]);

  return <g ref={ref} />;
};
