import React, { useEffect, useRef } from "react";
import { axisBottom, select, scaleBand, Selection, ScaleBand } from "d3";

type Props = {
  afterRender: (height: number) => void;
  data: number[];
  marginLeft: number;
  top: number;
  width: number;
};

class XAxisD3 {
  constructor(element: SVGGElement, props: Props) {
    this.axisHeight = 0;
    this.selection = select(element);
    const xScale = this.getScale(props);
    this.render(props, xScale);
  }

  selection: Selection<SVGGElement, unknown, null, undefined>;
  axisHeight: number;

  update(nextProps: Props) {
    const xScale = this.getScale(nextProps);
    this.render(nextProps, xScale);
  }

  getScale(props: Props): ScaleBand<number> {
    return scaleBand<number>()
      .range([0, props.width - props.marginLeft])
      .domain(props.data)
      .padding(0.1);
  }

  _axisHeight(): number {
    const node = this.selection.node();
    if (node && this.axisHeight === 0) {
      this.axisHeight = node.getBBox().height;
    }

    return this.axisHeight;
  }

  render(props: Props, xScale: ScaleBand<number>) {
    const axis = axisBottom(xScale);
    this.selection.call(axis);
    this.selection.attr(
      "transform",
      `translate(${props.marginLeft},${props.top - this._axisHeight()})`
    );
    props.afterRender(this._axisHeight());
  }
}

export const XAxis = (props: Props): JSX.Element => {
  const ref = useRef<SVGGElement>(null);
  const xAxisRef = useRef<XAxisD3 | null>(null);

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      xAxisRef.current = new XAxisD3(ref.current, props);
    }
    // Mistake #1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    xAxisRef.current?.update(props);
  }, [props]);

  return <g ref={ref} />;
};
