import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import MemoryGame from "./problems/MemoryGame/MemoryGame";
import FileBrowser from "./problems/FileBrowser/FileBrowser";
import Thesaurus from "./problems/Thesaurus/Thesaurus";
import { Button } from "@mui/material";
import Graphs from "./problems/Graphs/Graphs";
import InsertIntoList from "./problems/InsertIntoList/InsertIntoList";
import ShoppingQueue from "./problems/ShoppingQueue/ShoppingQueue";
import LogicTree from "./problems/LogicTree/LogicTree";
import { Sudoku } from "./problems/Sudoku";

function App() {
  return (
    <>
      <Sudoku />
      {/*<div className="App">
  </div>*/}
    </>
  );
}

export default App;
