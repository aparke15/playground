import * as uuid from "uuid";

import { FC, useState } from "react";
import Argument from "./components/Argument";
import ArgumentInput from "./components/ArgumentInput";
import LogicBlock from "./components/LogicBlock";

type TArgument = {
  id: string;
  name: string;
  value: boolean;
};

type TLogic = {
  id: string;
  operator: "and" | "or" | "not";
  args: (TArgument | TLogic)[];
  result: boolean;
};

const LogicTree: FC = () => {
  const [argmnts, setArgmnts] = useState<TArgument[]>([]);
  const [logics, setLogics] = useState<TLogic[]>([]);

  const addArgument = (id: string, name: string, value: boolean) => {
    setArgmnts([...argmnts, { id, name, value }]);
  };

  const removeArgument = (id: string) => {
    setArgmnts(argmnts.filter((arg) => arg.id !== id));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ border: "1px solid red", width: "50%" }}>
        <h1>Logic Tree</h1>
        <br />
        <ArgumentInput addArgument={addArgument} />
        <br />
        {argmnts.map((arg, idx) => (
          <Argument argData={arg} removeArgument={removeArgument} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          border: "1px solid red",
          width: "50%",
          justifyContent: "center",
        }}
      >
        <LogicBlock />
      </div>
    </div>
  );
};

export default LogicTree;
