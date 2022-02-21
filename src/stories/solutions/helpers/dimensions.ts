export type TransformValues = {
  xStart: number;
  xZoom: number;
  yStart: number;
  yZoom: number;
};
export type PreResizeDimensions = {
  height: number;
  width: number;
};
export function totalWidth(props: {
  marginLeft: number;
  marginRight: number;
  width: number;
}): number {
  const width = props.width - horizontalMargins(props);
  return width > 0 ? width : 0;
}
export function totalHeight(props: {
  height: number;
  marginBottom: number;
  marginTop: number;
}): number {
  const height = props.height - verticalMargins(props);
  return height > 0 ? height : 0;
}

function horizontalMargins(props: {
  marginLeft: number;
  marginRight: number;
}): number {
  return props.marginLeft + props.marginRight;
}

function verticalMargins(props: any): number {
  return props.marginTop + props.marginBottom;
}