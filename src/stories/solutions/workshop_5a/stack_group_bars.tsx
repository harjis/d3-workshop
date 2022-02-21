import React, { useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  scaleLinear,
  Selection,
  ScaleBand,
  ScaleLinear,
} from "d3";
import groupBy from "./group_by";
import { getColorScale } from "../helpers/scale";

type ScaleByValueType = Record<string, ScaleLinear<number, number>>;
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
  marginBottom: number;
  marginLeft: number;
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
type InternalStackGroupValuesByValueType = Record<
  string,
  InternalStackGroupValues[]
>;

class StackGroupBarsD3 {
  constructor(element: SVGGElement, props: Props) {
    this.selection = select(element);
    const formattedValuesForYAxises = this.formatDataForYAxises(props.bars);
    const formattedValues = this.formatDataForRendering(props.bars);
    const yScales = this.getYScales(props, formattedValuesForYAxises);
    const xScale = this.getXScale(props);
    const groupScale = this.getGroupScale(props, xScale);
    this.render(props, xScale, yScales, groupScale, formattedValues);
  }

  selection: Selection<SVGGElement, unknown, null, undefined>;

  update(nextProps: Props) {
    this.selection.selectAll("g").remove();
    const formattedValuesForYAxises = this.formatDataForYAxises(nextProps.bars);
    const formattedValues = this.formatDataForRendering(nextProps.bars);
    const yScales = this.getYScales(nextProps, formattedValuesForYAxises);
    const xScale = this.getXScale(nextProps);
    const groupScale = this.getGroupScale(nextProps, xScale);
    this.render(nextProps, xScale, yScales, groupScale, formattedValues);
  }

  formatDataForYAxises(
    values: StackGroupValue[]
  ): InternalStackGroupValuesByValueType {
    const valueTypesValues = groupBy(values, "valueType");
    return Array.from(valueTypesValues).reduce(
      (acc, [valueType, valueTypeValues]) => {
        const xIdValues = this.formatDataForRendering(valueTypeValues);
        return { ...acc, [valueType]: xIdValues };
      },
      {}
    );
  }

  formatDataForRendering(
    values: StackGroupValue[]
  ): InternalStackGroupValues[] {
    const ids = [...new Set(values.map((value) => value.x))];
    return ids.map((x) => {
      const xIdValues = this.formatXIdValues(
        values.filter((value) => value.x === x)
      );
      return {
        xIdValues,
        yEnds: xIdValues.map((xIdValue) => xIdValue.yEnd),
        x,
      };
    });
  }

  formatXIdValues(valuesForXId: StackGroupValue[]): InternalStackGroupValue[] {
    const yStartPositiveByGroupId: Record<string, number> = {};
    const yStartNegativeByGroupId: Record<string, number> = {};
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

      return { ...value, yEnd: yStart + value.y, yStart: yStart };
    });
  }

  getYScales(
    props: Props,
    values: InternalStackGroupValuesByValueType
  ): ScaleByValueType {
    const uniqueValueTypes = Object.keys(values);
    return uniqueValueTypes.reduce<ScaleByValueType>((acc, valueType) => {
      const valuesToBeUsed = values[valueType].reduce<number[]>(
        (acc, value) => [...acc, ...value.yEnds],
        []
      );
      const scale = scaleLinear()
        .range([props.height - props.marginBottom, 0])
        .domain([0, Math.max(...valuesToBeUsed)]);
      return { ...acc, [valueType]: scale };
    }, {});
  }

  getXScale(props: Props): ScaleBand<number> {
    return scaleBand<number>()
      .range([0, props.width - props.marginLeft])
      .domain(props.bars.map((bar) => bar.x))
      .padding(0.1);
  }

  getGroupScale(props: Props, xScale: ScaleBand<number>) {
    return scaleBand()
      .domain(props.bars.map((value) => value.groupId))
      .range([0, xScale.bandwidth()])
      .padding(0.1);
  }

  render(
    props: Props,
    xScale: ScaleBand<number>,
    yScales: ScaleByValueType,
    groupScale: ScaleBand<string>,
    formattedValues: InternalStackGroupValues[]
  ) {
    const uniqueValues = [...new Set(props.bars.map((value) => value.valueId))];
    this.selection
      .attr("transform", `translate(${props.marginLeft}, 0)`)
      .selectAll("g")
      .data(formattedValues)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d: InternalStackGroupValues) => `translate(${xScale(d.x)}, 0)`
      )
      .selectAll("rect")
      .data((d) => d.xIdValues)
      .enter()
      .append("rect")
      .attr("fill", (d: InternalStackGroupValue) =>
        getColorScale(uniqueValues)(d.valueId)
      )
      .attr(
        "x",
        (d: InternalStackGroupValue) => groupScale(d.groupId) as number
      )
      .attr("y", (d: InternalStackGroupValue) =>
        d.yStart < d.yEnd
          ? yScales[d.valueType](d.yEnd)
          : yScales[d.valueType](d.yStart)
      )
      .attr("height", (d: InternalStackGroupValue) =>
        Math.abs(yScales[d.valueType](d.yStart) - yScales[d.valueType](d.yEnd))
      )
      .attr("width", groupScale.bandwidth());
  }
}

export const StackGroupBars = (props: Props): JSX.Element => {
  const ref = useRef<SVGGElement>(null);
  const barRef = useRef<StackGroupBarsD3 | null>(null);

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      barRef.current = new StackGroupBarsD3(ref.current, props);
    }
    // Mistake #1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    barRef.current?.update(props);
  }, [props]);

  return <g ref={ref} />;
};
