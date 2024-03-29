import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  select,
  scaleBand,
  scaleLinear,
  ScaleLinear,
  Selection,
  ScaleBand,
} from "d3";

import groupBy from "../workshop_5a/group_by";
import { getColorScale } from "../helpers/scale";
import { totalHeight, totalWidth } from "../helpers/dimensions";
import type {
  PreResizeDimensions,
  TransformValues,
} from "../helpers/dimensions";
type ScaleByValueType = Record<string, ScaleLinear<number, number>>;
export type StackGroupValue = {
  groupId: string;
  valueId: string;
  valueType: string;
  x: number;
  y: number;
};

// Umm... what is the correct way to use defaultProps nowadays?
const defaultProps = {
  height: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  width: 0,
};
type PublicProps = {
  bars: StackGroupValue[];
  isResizing: boolean;
} & Partial<typeof defaultProps>;
type Props = {
  bars: StackGroupValue[];
  isResizing: boolean;
} & typeof defaultProps;

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

  updateTransform(nextProps: Props, preResizeDimensions: PreResizeDimensions) {
    this.selection.call(
      this.updateSelectionTransform,
      nextProps,
      computeResizeTransforms(nextProps, preResizeDimensions)
    );
  }

  updateSelectionTransform = (
    selection: Selection<SVGGElement, unknown, null, undefined>,
    props: Props,
    transformValues: TransformValues
  ) => {
    const { xStart, xZoom, yStart, yZoom } = transformValues;
    selection.attr(
      "transform",
      `translate(${xStart + props.marginLeft}, ${
        props.marginTop + yStart
      }) scale(${xZoom}, ${yZoom})`
    );
  };

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

function computeResizeTransforms(
  props: Props,
  preResizeDimensions: PreResizeDimensions
): TransformValues {
  const xZoom = totalWidth(props) / preResizeDimensions.width;
  const yZoom = totalHeight(props) / preResizeDimensions.height;
  return {
    xStart: 0,
    xZoom,
    yStart: 0,
    yZoom,
  };
}

export const StackGroupBarsPerf = (_props: PublicProps): JSX.Element => {
  const props = useMemo(() => ({ ...defaultProps, ..._props }), [_props]);
  const ref = useRef<SVGGElement>(null);
  const barRef = useRef<StackGroupBarsD3 | null>(null);
  const preResizeRef = useRef({
    preResizeHeight: 0,
    preResizeWidth: 0,
  });

  const updatePreResizeDimensions = useCallback((nextProps: Props) => {
    preResizeRef.current = {
      preResizeHeight: totalHeight(nextProps),
      preResizeWidth: totalWidth(nextProps),
    };
  }, []);

  function preResizeDimensions(): PreResizeDimensions {
    return {
      height: preResizeRef.current.preResizeHeight,
      width: preResizeRef.current.preResizeWidth,
    };
  }

  useEffect(() => {
    if (ref.current instanceof SVGGElement) {
      barRef.current = new StackGroupBarsD3(ref.current, props);
    }
    // Mistake #1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.isResizing) {
      barRef.current?.updateTransform(props, preResizeDimensions());
    } else {
      updatePreResizeDimensions(props);
      barRef.current?.update(props);
    }
  }, [props, updatePreResizeDimensions]);

  return <g ref={ref} />;
};
