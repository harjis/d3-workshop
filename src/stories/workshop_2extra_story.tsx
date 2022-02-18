import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { ScaleOrdinal, scaleOrdinal } from "d3";

const config = {
  red: "#D64242",
  orange: "#F1C664",
  yellow: "#F4EB72",
  green: "#65C092",
  blue: "#4096C6",
  lightBlue: "#81C7EF",
  purple: "#D99BBE",
  black: "#414141",
};

/**
 * You can find tests for the color bucket here
 * https://github.com/manko/processor-edge/blob/487e97a6212cc84e8c4cd0856793be46756b6e8e/frontend/test/unit/utils/color_test.js
 * */
storiesOf("Development/d3-workshop/2extra", module)
  .addDecorator((getStory) => {
    const style = {
      background: "lightgrey",
      height: window.innerHeight,
      width: window.innerWidth,
      overflow: "scroll",
    };
    return <div style={style}>{getStory()}</div>;
  })
  .add("Plot per row checkboxes", () => {
    return <Boxes boxes={["1", "2", "3", "4", "5", "6"]} />;
  });
type Props = {
  boxes: string[];
};

function Boxes(props: Props) {
  const [selectedBoxes, setBoxes] = useState<string[]>([]);

  const toggleBox = (box: string) => console.log("should toggle box");

  return (
    <div style={containerStyles()}>
      {props.boxes.map((box) => {
        return (
          <div
            key={box}
            style={{
              ...boxStyle(),
              // background: colorBucket(selectedBoxes)(box),
              background: "white",
            }}
            onClick={() => toggleBox(box)}
          >
            &nbsp;
          </div>
        );
      })}
    </div>
  );
}

function containerStyles() {
  return {
    display: "flex",
    height: "100px",
    width: "600px",
  };
}

function boxStyle() {
  return {
    height: "100%",
    flexGrow: 1,
    border: "1px solid",
  };
}
