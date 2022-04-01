import { Bar, Props } from "./types";
import { scaleBand, ScaleBand, scaleLinear, ScaleLinear } from "d3";

export class BarsStore {
  barHeight(props: Props, bar: Bar): number {
    const yScale = this.getYScale(props);
    return props.height - props.marginBottom - yScale(bar.y);
  }

  barWidth(props: Props): number {
    const xScale = this.getXScale(props);
    return xScale.bandwidth();
  }

  barYPosition(props: Props, bar: Bar): number {
    const yScale = this.getYScale(props);
    return yScale(bar.y);
  }

  barXPosition(props: Props, bar: Bar): number | null {
    const xScale = this.getXScale(props);
    return xScale(bar.x) || null;
  }

  private getYScale(props: Props): ScaleLinear<number, number> {
    return scaleLinear()
      .range([props.height - props.marginBottom, 0])
      .domain([0, Math.max(...props.bars.map((bar) => bar.y))]);
  }

  private getXScale(props: Props): ScaleBand<number> {
    return scaleBand<number>()
      .range([0, props.width - props.marginLeft])
      .domain(props.bars.map((bar) => bar.x))
      .padding(0.1);
  }
}
