import { useMemo } from "react";
import { diff } from "deep-object-diff";

import { usePrevious } from "./usePrevious";

// TODO Decide if this is good or not: https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export const usePropsDiff = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  props: T
): K[] => {
  const prevProps = usePrevious(props);
  return useMemo(() => keys(diff(prevProps, props)), [props, prevProps]);
};
