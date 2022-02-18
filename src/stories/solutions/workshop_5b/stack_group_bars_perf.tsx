import React from "react";
import { select, scaleBand, scaleLinear } from "d3";
import groupBy from "../workshop_5a/group_by";
import { getColorScale } from "../helpers/scale";
import { totalHeight, totalWidth } from "../helpers/dimensions";
import type { PreResizeDimensions, TransformValues } from "../helpers/dimensions";
type ScaleByValueType = Record<string, (...args: Array<any>) => any>;
export type StackGroupValue = {
  groupId: string;
  valueId: string;
  valueType: string;
  x: number;
  y: number;
};
type Props = {
  bars: StackGroupValue[];
  height: number;
  isResizing: boolean;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width: number;
};
type InternalStackGroupValue = StackGroupValue & {
  yStart: number;
  yEnd: number;
};
type InternalStackGroupValues = {
  x: number;
  xIdValues: InternalStackGroupValue[];
  yEnds: number[];
};
type InternalStackGroupValuesByValueType = Record<string, InternalStackGroupValues[]>;
export default class StackGroupBarsPerf extends React.Component<Props> {
  static defaultProps = {
    height: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    width: 0
  };

  componentDidMount() {
    this.bar = new StackGroupBarsD3(this.ref, this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isResizing) {
      this.bar && this.bar.updateTransform(nextProps, this.preResizeDimensions);
    } else {
      this.updatePreResizeDimensions(nextProps);
      this.bar && this.bar.update(nextProps);
    }
  }

  ref: Element | null | undefined;
  bar: StackGroupBarsD3 | null | undefined;
  preResizeHeight: number = totalHeight(this.props);
  preResizeWidth: number = totalWidth(this.props);
  applyRef = (ref: Element | null | undefined) => this.ref = ref;

  get preResizeDimensions(): PreResizeDimensions {
    return {
      height: this.preResizeHeight,
      width: this.preResizeWidth
    };
  }

  updatePreResizeDimensions = (props: Props) => {
    this.preResizeHeight = totalHeight(props);
    this.preResizeWidth = totalWidth(props);
  };

  render() {
    return <g ref={this.applyRef} />;
  }

}

class StackGroupBarsD3 {
  constructor(element: Element | null | undefined, props: Props) {
    this.selection = select(element);
    const formattedValuesForYAxises = this.formatDataForYAxises(props.bars);
    const formattedValues = this.formatDataForRendering(props.bars);
    const yScales = this.getYScales(props, formattedValuesForYAxises);
    const xScale = this.getXScale(props);
    const groupScale = this.getGroupScale(props, xScale);
    this.render(props, xScale, yScales, groupScale, formattedValues);
  }

  selection: (...args: Array<any>) => any;

  update(nextProps: Props) {
    this.selection.selectAll('g').remove();
    const formattedValuesForYAxises = this.formatDataForYAxises(nextProps.bars);
    const formattedValues = this.formatDataForRendering(nextProps.bars);
    const yScales = this.getYScales(nextProps, formattedValuesForYAxises);
    const xScale = this.getXScale(nextProps);
    const groupScale = this.getGroupScale(nextProps, xScale);
    this.render(nextProps, xScale, yScales, groupScale, formattedValues);
  }

  updateTransform(nextProps: Props, preResizeDimensions: PreResizeDimensions) {
    this.selection.call(this.updateSelectionTransform, nextProps, computeResizeTransforms(nextProps, preResizeDimensions));
  }

  updateSelectionTransform = (selection: (...args: Array<any>) => any, props: Props, transformValues: TransformValues) => {
    const {
      xStart,
      xZoom,
      yStart,
      yZoom
    } = transformValues;
    selection.attr('transform', `translate(${xStart + props.marginLeft}, ${props.marginTop + yStart}) scale(${xZoom}, ${yZoom})`);
  };

  formatDataForYAxises(values: StackGroupValue[]): InternalStackGroupValuesByValueType {
    const valueTypesValues = groupBy(values, 'valueType');
    return Array.from(valueTypesValues).reduce((acc, [valueType, valueTypeValues]) => {
      const xIdValues = this.formatDataForRendering(valueTypeValues);
      return { ...acc,
        [valueType]: xIdValues
      };
    }, {});
  }

  formatDataForRendering(values: StackGroupValue[]): InternalStackGroupValues[] {
    const ids = [...new Set(values.map(value => value.x))];
    return ids.map(x => {
      const xIdValues = this.formatXIdValues(values.filter(value => value.x === x));
      return {
        xIdValues,
        yEnds: xIdValues.map(xIdValue => xIdValue.yEnd),
        x
      };
    });
  }

  formatXIdValues(valuesForXId: StackGroupValue[]): InternalStackGroupValue[] {
    const yStartPositiveByGroupId = {};
    const yStartNegativeByGroupId = {};
    return valuesForXId.map((value: StackGroupValue) => {
      if (!yStartPositiveByGroupId[value.groupId]) {
        yStartPositiveByGroupId[value.groupId] = 0;
      }

      if (!yStartNegativeByGroupId[value.groupId]) {
        yStartNegativeByGroupId[value.groupId] = 0;
      }

      let yStart;

      if (value.y && value.y >= 0) {
        yStart = yStartPositiveByGroupId[value.groupId];
        yStartPositiveByGroupId[value.groupId] += value.y;
      } else {
        yStart = yStartNegativeByGroupId[value.groupId];
        yStartNegativeByGroupId[value.groupId] += value.y;
      }

      return { ...value,
        yEnd: yStart + value.y,
        yStart: yStart
      };
    });
  }

  getYScales(props: Props, values: InternalStackGroupValuesByValueType): ScaleByValueType {
    const uniqueValueTypes = Object.keys(values);
    return uniqueValueTypes.reduce((acc, valueType) => {
      const valuesToBeUsed = values[valueType].reduce((acc, value) => [...acc, ...value.yEnds], []);
      const scale = scaleLinear().range([props.height - props.marginBottom, 0]).domain([0, Math.max(...valuesToBeUsed)]);
      return { ...acc,
        [valueType]: scale
      };
    }, {});
  }

  getXScale(props: Props): (...args: Array<any>) => any {
    return scaleBand().range([0, props.width - props.marginLeft]).domain(props.bars.map(bar => bar.x)).padding(0.1);
  }

  getGroupScale(props: Props, xScale: (...args: Array<any>) => any) {
    return scaleBand().domain(props.bars.map(value => value.groupId)).range([0, xScale.bandwidth()]).padding(0.1);
  }

  render(props: Props, xScale: (...args: Array<any>) => any, yScales: ScaleByValueType, groupScale: (...args: Array<any>) => any, formattedValues: InternalStackGroupValues[]) {
    const uniqueValues = [...new Set(props.bars.map(value => value.valueId))];
    this.selection.attr('transform', `translate(${props.marginLeft}, 0)`).selectAll('g').data(formattedValues).enter().append('g').attr('transform', (d: InternalStackGroupValues) => `translate(${xScale(d.x)}, 0)`).selectAll('rect').data(d => d.xIdValues).enter().append('rect').attr('fill', (d: InternalStackGroupValue) => getColorScale(uniqueValues)(d.valueId)).attr('x', (d: InternalStackGroupValue) => groupScale(d.groupId)).attr('y', (d: InternalStackGroupValue) => d.yStart < d.yEnd ? yScales[d.valueType](d.yEnd) : yScales[d.valueType](d.yStart)).attr('height', (d: InternalStackGroupValue) => Math.abs(yScales[d.valueType](d.yStart) - yScales[d.valueType](d.yEnd))).attr('width', groupScale.bandwidth());
  }

}

function computeResizeTransforms(props: Props, preResizeDimensions: PreResizeDimensions): TransformValues {
  const xZoom = totalWidth(props) / preResizeDimensions.width;
  const yZoom = totalHeight(props) / preResizeDimensions.height;
  return {
    xStart: 0,
    xZoom,
    yStart: 0,
    yZoom
  };
}