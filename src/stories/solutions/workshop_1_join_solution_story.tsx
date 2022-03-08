import React, { useEffect, useRef, useState } from "react";
import { storiesOf } from "@storybook/react";
import { BaseType, select, Transition, transition } from "d3";

storiesOf("Development/d3-workshop/Solutions/1 - Join", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Flat list of alphabet", () => {
    return <Alphabets />;
  });

type AlphabetType = string;

function draw(element: SVGSVGElement | null, alphabet: AlphabetType[]): void {
  if (!element) {
    return;
  }

  // TODO ts-fix types on transition don't make sense. To me it seems like d3 type on top-level
  // .transition() is wrong. Usage of BaseType should not be needed either
  const t = transition().duration(750) as unknown as Transition<
    BaseType,
    void,
    null,
    void
  >;

  // JOIN new data with old elements.
  select<SVGSVGElement, AlphabetType[]>(element)
    .select("g")
    .selectAll<SVGTextElement, AlphabetType>("text")
    .data(alphabet, (d) => d)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("fill", "green")
          .attr("dy", ".35em")
          .attr("y", -60)
          .attr("x", (d, i) => i * 32)
          .style("fill-opacity", 1e-6)
          .text((d) => d)
          .call((enter) =>
            enter.transition(t).attr("y", 0).style("fill-opacity", 1)
          ),
      (update) =>
        update
          .attr("fill", "black")
          .attr("y", 0)
          .style("fill-opacity", 1)
          .call((update) => update.transition(t).attr("x", (d, i) => i * 32)),
      (exit) =>
        exit
          .attr("fill", "brown")
          .call((exit) =>
            exit
              .transition(t)
              .attr("y", 60)
              .style("fill-opacity", 1e-6)
              .remove()
          )
    );
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
  }, []);

  return (
    <svg height="100" width="200" ref={ref}>
      <g transform="translate(16, 16)" />
    </svg>
  );
};
