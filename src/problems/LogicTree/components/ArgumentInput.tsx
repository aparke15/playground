import { ChangeEvent, FC, useState } from "react";
import * as uuid from "uuid";

type ArgumentInputProps = {
  addArgument: (id: string, name: string, value: boolean) => void;
};

const ArgumentInput: FC<ArgumentInputProps> = ({ addArgument }) => {
  const [argId, setArgId] = useState(uuid.v4());
  const [name, setName] = useState("");
  const [value, setValue] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.currentTarget.value === "true");
  };

  const refresh = () => {
    setArgId(uuid.v4());
    setName("");
    setValue(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!addArgument}
      />
      <select
        id="selectBox"
        value={value.toString()}
        onChange={handleChange}
        disabled={!addArgument}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
      <button
        onClick={() => {
          addArgument(argId, name, value);
          refresh();
        }}
        disabled={name === ""}
      >
        Add
      </button>
    </div>
  );
};

export default ArgumentInput;
