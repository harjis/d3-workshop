import { ScaleOrdinal, scaleOrdinal } from "d3";

const DEFAULT_COLORS = {
  red: "#D64242",
  orange: "#F1C664",
  yellow: "#F4EB72",
  green: "#65C092",
  blue: "#4096C6",
  lightBlue: "#81C7EF",
  purple: "#D99BBE",
  black: "#414141",
};

export function getColorScale(domain: string[]): ScaleOrdinal<string, string> {
  return scaleOrdinal<string, string>()
    .range(Object.values(DEFAULT_COLORS))
    .domain(domain);
}
