import React, { useEffect, useRef, useState } from "react";
import { storiesOf } from "@storybook/react";
import { BaseType, select, Transition, transition } from "d3";

storiesOf("Development/d3-workshop/Solutions/1 - Static", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Join - Flat list of alphabet", () => {
    return <Alphabets />;
  });

type AlphabetType = string;

function draw(element: SVGSVGElement | null, alphabet: AlphabetType[]): void {
  if (!element) {
    return;
  }

  select<SVGSVGElement, AlphabetType[]>(element)
    .select("g")
    .selectAll<SVGTextElement, AlphabetType>("text")
    .data(alphabet, (d) => d)
    .join("text")
    .attr("fill", "black")
    .attr("y", 0)
    .attr("x", (d, i) => i * 32)
    .text((d) => d);
}

const Alphabets = (): JSX.Element => {
  const [state, setState] = useState<AlphabetType[]>(["a", "b", "c", "d"]);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    draw(ref.current, state);
  }, [state]);

  useEffect(() => {
    setTimeout(() => {
      setState(["b", "d"]);
    }, 1000);
    setTimeout(() => {
      setState(["e", "f"]);
    }, 2000);
    setTimeout(() => {
      setState(["f", "g", "h", "i"]);
    }, 3000);
  }, []);

  return (
    <svg height="100" width="200" ref={ref}>
      <g transform="translate(16, 16)" />
    </svg>
  );
};
