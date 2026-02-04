import { Button } from "@mui/material";
import { FC } from "react";
import { coolGraph, graph, pathGraph } from "./constants";
import {
  breadthFirstPrint,
  depthFirstPrint,
  depthFirstRec,
  hasPath,
} from "./utils";

const Graphs: FC = () => {
  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button variant="outlined" onClick={() => depthFirstPrint(graph, "a")}>
          Depth First Traverse
        </Button>
        <Button
          variant="outlined"
          onClick={() => breadthFirstPrint(graph, "a")}
        >
          Breadth First Traverse
        </Button>
      </div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button variant="outlined" onClick={() => depthFirstRec(graph, "a")}>
          Depth First Recursive
        </Button>
      </div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button variant="outlined" onClick={() => hasPath(coolGraph, "a", "f")}>
          Has Path
        </Button>
      </div>
    </div>
  );
};

export default Graphs;
