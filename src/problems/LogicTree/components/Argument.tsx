import * as uuid from "uuid";
import { FC, useState } from "react";

interface ArgumentProps {
  argData: { id: string; name: string; value: boolean };
  removeArgument: (id: string) => void;
}

const Argument: FC<ArgumentProps> = ({ argData, removeArgument }) => {
  if (argData) {
    console.log(argData);
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "50%" }}>
      <div
        style={{
          border: "0.5px solid",
          padding: "7.5px",
          width: "50%",
          height: "25px",
          backgroundColor: argData?.value ? "green" : "red",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{`${argData?.name}`}</div>
        <button
          style={{
            backgroundColor: "transparent",
          }}
          onClick={() => removeArgument(argData.id)}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Argument;
