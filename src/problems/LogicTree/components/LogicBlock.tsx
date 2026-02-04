import { FC, useState } from "react";

type Operator = "and" | "or" | "not";

const LogicBlock: FC = () => {
  const [operator, setOperator] = useState("and" as Operator);
  return (
    <div>
      <select
        id="selectBox"
        value={operator}
        onChange={(e) => setOperator(e.currentTarget.value as Operator)}
      >
        <option value="and">AND</option>
        <option value="or">OR</option>
        <option value="not">NOT</option>
      </select>
    </div>
  );
};

export default LogicBlock;
