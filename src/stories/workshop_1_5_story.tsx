import React, { useEffect, useRef, useState } from "react";
import { storiesOf } from "@storybook/react";
import { select, transition, Transition, BaseType } from "d3";

storiesOf("Development/d3-workshop/Solutions/1", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Nested list of alphabet", () => {
    return <Alphabets />;
  });

type AlphabetsType = {
  id: number;
  values: string[];
};

function draw(element: SVGSVGElement | null, alphabet: AlphabetsType[]): void {}

const Alphabets = (): JSX.Element => {
  const [state, setState] = useState<AlphabetsType[]>([
    {
      id: 1,
      values: ["a", "b"],
    },
    {
      id: 2,
      values: ["c", "d"],
    },
  ]);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    draw(ref.current, state);
  }, [state]);

  useEffect(() => {
    setTimeout(() => {
      setState([
        {
          id: 1,
          values: ["b"],
        },
        {
          id: 2,
          values: ["d"],
        },
      ]);
    }, 1000);
    setTimeout(() => {
      setState([
        {
          id: 1,
          values: ["b"],
        },
        {
          id: 3,
          values: ["f"],
        },
        {
          id: 2,
          values: ["d"],
        },
      ]);
    }, 2000);
  }, []);

  return (
    <svg height="100" width="200" ref={ref}>
      <g transform="translate(16, 16)" />
    </svg>
  );
};
