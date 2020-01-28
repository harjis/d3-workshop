// @flow
import { scaleOrdinal } from 'd3';

const DEFAULT_COLORS = {
  red: '#D64242',
  orange: '#F1C664',
  yellow: '#F4EB72',
  green: '#65C092',
  blue: '#4096C6',
  lightBlue: '#81C7EF',
  purple: '#D99BBE',
  black: '#414141'
};

// Instead of Function we would want to have an actual type for ordinal scale
export function getColorScale(domain: $ReadOnlyArray<string | number>): Function {
  return scaleOrdinal()
    .range(DEFAULT_COLORS)
    .domain(domain);
}
