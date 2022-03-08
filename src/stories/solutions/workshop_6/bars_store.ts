import { Props } from "./types";
import { scaleBand, ScaleBand, scaleLinear, ScaleLinear } from "d3";

export class BarsStore {
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
}
