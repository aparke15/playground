import { FC, useState, useRef, useEffect, useMemo } from "react";
import "./index.css";
import { Checkbox, IconButton, Switch } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

export enum InputMode {
  VALUE = "value",
  CANDIDATE = "candidate",
  CLUE = "clue",
  NONE = "",
}

export const compareHistorieEntries = (h1: History, h2: History) => {
  const candidatesEqual = h1.candidates.every(
    (cellICandidates, index) =>
      cellICandidates.length === h2.candidates[index].length &&
      cellICandidates.every((c) => h2.candidates[index].includes(c))
  );
  const valuesEqual = h1.values.every(
    (value, index) => value === h2.values[index]
  );
  return candidatesEqual && valuesEqual;
};

export const validValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export interface History {
  candidates: number[][];
  values: number[];
}

export const Sudoku = () => {
  const [candidates, setCandidates] = useState<number[][]>(
    Array.from({ length: 81 }, () => [])
  );
  const [values, setValues] = useState<number[]>(
    Array.from({ length: 81 }, () => 0)
  );
  // const [autoCandidates, setAutoCandidates] = useState<number[][]>(findAutoCandidates());
  const [showAutoCandidates, setShowAutoCandidates] = useState<boolean>(false);
  const [clueCellIndices, setClueCellIndices] = useState<number[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.CLUE);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [history, setHistory] = useState<History[]>([{ candidates, values }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isRestoring = useRef(false);

  const serializeHistory = () =>
    JSON.stringify(
      { history, historyIndex, clueCellIndices, inputMode },
      null,
      2
    );

  const restoreFromJson = (text: string) => {
    try {
      const data = JSON.parse(text);
      if (
        !data ||
        !Array.isArray(data.history) ||
        typeof data.historyIndex !== "number"
      ) {
        console.error("Invalid history file format");
        return;
      }
      const restoredClues = Array.isArray(data.clueCellIndices)
        ? data.clueCellIndices
        : [];
      const restoredInputMode =
        data.inputMode === InputMode.VALUE ||
        data.inputMode === InputMode.CANDIDATE ||
        data.inputMode === InputMode.CLUE ||
        data.inputMode === InputMode.NONE
          ? data.inputMode
          : InputMode.NONE;
      const targetIndex = Math.min(
        Math.max(0, data.historyIndex),
        data.history.length - 1
      );
      const entry = data.history[targetIndex];
      if (
        !entry ||
        !Array.isArray(entry.candidates) ||
        !Array.isArray(entry.values)
      ) {
        console.error("Invalid history entry structure");
        return;
      }
      isRestoring.current = true;
      setHistory(data.history);
      setHistoryIndex(targetIndex);
      setCandidates(entry.candidates);
      setValues(entry.values);
      setClueCellIndices(restoredClues);
      setInputMode(restoredInputMode);
    } catch (e) {
      console.error("Failed to parse history JSON", e);
    }
  };

  const saveToLocal = () => {
    try {
      localStorage.setItem("sudoku:history", serializeHistory());
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const loadFromLocal = () => {
    try {
      const raw = localStorage.getItem("sudoku:history");
      if (!raw) return;
      restoreFromJson(raw);
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  };

  const exportToFile = async () => {
    const blob = new Blob([serializeHistory()], {
      type: "application/json",
    });
    const fileName = "sudoku-history.json";
    try {
      if ((window as any).showSaveFilePicker) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
      }
    } catch (e) {
      console.error("Failed to export history", e);
    }
  };

  const importFromFile = async () => {
    try {
      if ((window as any).showOpenFilePicker) {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
          multiple: false,
        });
        const file = await handle.getFile();
        const text = await file.text();
        restoreFromJson(text);
      } else {
        const input = document.getElementById(
          "sudoku-file-input"
        ) as HTMLInputElement | null;
        input?.click();
      }
    } catch (e) {
      console.error("Failed to import history", e);
    }
  };

  const autoCandidates = useMemo(() => {
    return values.map((value, index) => {
      if (value !== 0) return [];
      const usedValues = new Set<number>();
      const rowStart = Math.floor(index / 9) * 9;
      const colStart = index % 9;
      const boxRowStart = Math.floor(Math.floor(index / 9) / 3) * 3;
      const boxColStart = Math.floor((index % 9) / 3) * 3;

      // Check row and column
      for (let i = 0; i < 9; i++) {
        const rowValue = values[rowStart + i];
        const colValue = values[colStart + i * 9];
        if (rowValue !== 0) usedValues.add(rowValue);
        if (colValue !== 0) usedValues.add(colValue);
      }

      // Check 3x3 box
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const boxValue = values[(boxRowStart + r) * 9 + (boxColStart + c)];
          if (boxValue !== 0) usedValues.add(boxValue);
        }
      }

      const candidates = [];
      for (let n = 1; n <= 9; n++) {
        if (!usedValues.has(n)) {
          candidates.push(n);
        }
      }
      return candidates;
    });
  }, [values]);

  useEffect(() => {
    console.log("historyIndex", historyIndex);
    console.log("history", history);
  }, [historyIndex]);

  useEffect(() => {
    if (isRestoring.current) {
      // Skip auto-append when restoring a snapshot
      isRestoring.current = false;
      return;
    }
    if (inputMode === InputMode.CLUE) {
      setClueCellIndices(
        values
          .map((value, index) => (value !== 0 ? index : -1))
          .filter((index) => index !== -1)
      );
    }
    if (
      historyIndex === history.length - 1 &&
      !compareHistorieEntries(history[historyIndex], { candidates, values }) &&
      inputMode !== InputMode.CLUE
    ) {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push({ candidates, values });
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
    }
  }, [candidates, values]);

  return (
    <div className="board">
      <div className="persistence-controls">
        <button onClick={saveToLocal}>Save</button>
        <button onClick={loadFromLocal}>Load</button>
        <button onClick={exportToFile}>Export</button>
        <button onClick={importFromFile}>Import</button>
      </div>
      <input
        id="sudoku-file-input"
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const text = await file.text();
          restoreFromJson(text);
          // Reset input value so selecting the same file again retriggers
          e.currentTarget.value = "";
        }}
      />
      <div className="game-mode-toggle">
        <Switch
          checked={inputMode === InputMode.CLUE}
          checkedIcon={<EditIcon />}
          icon={<EditOffIcon />}
          onChange={(event) => {
            if (!event.target.checked) {
              setHistory([{ candidates, values }]);
              setHistoryIndex(0);
              setInputMode(
                event.target.checked ? InputMode.CLUE : InputMode.NONE
              );
              setSelectedCell(null);
            }
          }}
          disabled={clueCellIndices.length < 17}
        />
      </div>
      <div className="grid">
        {Array.from({ length: 81 }, (_, i) => {
          const isRowBorder = i <= 54 && i % 27 >= 18 && i % 27 < 27;
          const isColBorder = i % 3 === 2 && i % 9 !== 8;
          const classes = `${isRowBorder ? "row-border" : ""} ${
            isColBorder ? "col-border" : ""
          }`;
          const handleCandidatesChange = (newCandidates: number[]) => {
            const updatedCandidates = [...candidates];
            updatedCandidates[i] = newCandidates;
            setCandidates(updatedCandidates);
          };
          const handleValueChange = (newValue: number) => {
            const updatedValues = [...values];
            updatedValues[i] = newValue;
            setValues(updatedValues);
            if (newValue !== 0) {
              const updatedCandidates = [...candidates];
              updatedCandidates[i] = [];

              // Remove the new value from candidates in affected cells
              for (let j = 0; j < 81; j++) {
                if (j === i) continue;

                const isAffected =
                  Math.floor(i / 9) === Math.floor(j / 9) || // Same row
                  i % 9 === j % 9 || // Same column
                  (Math.floor(i / 27) === Math.floor(j / 27) && // Same 3x3 box
                    Math.floor((i % 9) / 3) === Math.floor((j % 9) / 3));

                if (isAffected) {
                  updatedCandidates[j] = updatedCandidates[j].filter(
                    (c) => c !== newValue
                  );
                }
              }

              setCandidates(updatedCandidates);
            }
          };
          return (
            <SudokuCell
              key={i}
              index={i}
              candidates={candidates[i]}
              classes={classes}
              inputMode={inputMode}
              cellHighlighted={
                selectedCell !== null &&
                (Math.floor(selectedCell / 9) === Math.floor(i / 9) ||
                  selectedCell % 9 === i % 9 ||
                  (Math.floor(selectedCell / 27) === Math.floor(i / 27) &&
                    Math.floor((selectedCell % 9) / 3) ===
                      Math.floor((i % 9) / 3)))
              }
              valueHighlighted={
                values[selectedCell ?? -1] !== 0 &&
                values[i] === values[selectedCell ?? -1] &&
                selectedCell !== i
              }
              isClueCell={clueCellIndices.includes(i)}
              isSelected={i === selectedCell}
              selectedCell={selectedCell}
              value={values[i]}
              selectCell={(cell: number | null) => setSelectedCell(cell)}
              setCandidates={handleCandidatesChange}
              setValue={handleValueChange}
            />
          );
        })}
      </div>
      <div className="board-toolbar">
        <div className="input-mode-toggle">
          <button
            className={
              inputMode === InputMode.VALUE ? "input-mode-selected" : ""
            }
            onClick={() => setInputMode(InputMode.VALUE)}
            disabled={inputMode === InputMode.CLUE}
          >
            Value
          </button>
          <button
            className={
              inputMode === InputMode.CANDIDATE ? "input-mode-selected" : ""
            }
            onClick={() => setInputMode(InputMode.CANDIDATE)}
            disabled={inputMode === InputMode.CLUE}
          >
            Candidate
          </button>
        </div>
        <div className="undo-redo">
          <IconButton
            disabled={historyIndex === 0}
            onClick={() => {
              if (historyIndex > 0) {
                const prevIndex = historyIndex - 1;
                setCandidates(history[prevIndex].candidates);
                setValues(history[prevIndex].values);
                setHistoryIndex(prevIndex);
              }
            }}
            color="info"
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            disabled={historyIndex >= history.length - 1}
            onClick={() => {
              if (historyIndex < history.length - 1) {
                const nextIndex = historyIndex + 1;
                setCandidates(history[nextIndex].candidates);
                setValues(history[nextIndex].values);
                setHistoryIndex(nextIndex);
              }
            }}
          >
            <RedoIcon />
          </IconButton>
        </div>
      </div>
      <div>
        <Checkbox
          checked={showAutoCandidates}
          onChange={(e) => {
            setShowAutoCandidates(e.target.checked);
            if (e.target.checked) {
              setCandidates(autoCandidates);
            }
          }}
        />{" "}
        Auto Candidates
      </div>
    </div>
  );
};

interface SudokuCellProps {
  candidates: number[];
  classes: string;
  index: number;
  inputMode: InputMode;
  cellHighlighted: boolean;
  valueHighlighted: boolean;
  isSelected: boolean;
  isClueCell: boolean;
  value: number;
  selectedCell: number | null;
  selectCell: (cell: number | null) => void;
  setCandidates: (candidates: number[]) => void;
  setValue: (value: number) => void;
}

export const SudokuCell: FC<SudokuCellProps> = ({
  candidates = [],
  classes,
  index,
  inputMode,
  cellHighlighted,
  valueHighlighted,
  isSelected,
  isClueCell,
  selectedCell,
  value,
  selectCell,
  setCandidates,
  setValue,
}) => {
  const cellValue = value && value > 0 ? value.toString() : "";
  const cellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSelected) {
      cellRef.current?.focus();
    }
  }, [isSelected]);
  return (
    <div
      ref={cellRef}
      tabIndex={0}
      className={`cell ${classes} ${isSelected ? "selected" : ""} ${
        cellHighlighted && !isSelected ? "affected" : ""
      } ${valueHighlighted && !isSelected ? "value-highlighted" : ""} ${
        isClueCell ? "clue-value" : ""
      }`}
      onClick={() => selectCell(index === selectedCell ? null : index)}
      onKeyDown={(event) => {
        if (
          event.key === "Backspace" ||
          event.key === "Delete" ||
          event.key === "0" ||
          event.key === `${value}`
        ) {
          if (inputMode === InputMode.VALUE || inputMode === InputMode.CLUE) {
            setValue(0);
          }
        } else if (validValues.includes(event.key)) {
          const numericValue = parseInt(event.key, 10);
          if (inputMode === InputMode.VALUE || inputMode === InputMode.CLUE) {
            setValue(numericValue);
          } else if (inputMode === InputMode.CANDIDATE) {
            let newCandidates = [...candidates];
            if (newCandidates.includes(numericValue)) {
              newCandidates = newCandidates.filter((c) => c !== numericValue);
            } else {
              newCandidates.push(numericValue);
              newCandidates.sort();
            }
            setCandidates(newCandidates);
          }
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          const newIndex = index - 9 >= 0 ? index - 9 : index + 72;
          const cell = document.querySelectorAll(".cell")[newIndex] as
            | HTMLDivElement
            | undefined;
          cell?.focus();
          selectCell(newIndex);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          const newIndex = index + 9 <= 80 ? index + 9 : index - 72;
          const cell = document.querySelectorAll(".cell")[newIndex] as
            | HTMLDivElement
            | undefined;
          cell?.focus();
          selectCell(newIndex);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          const newIndex = index % 9 !== 0 ? index - 1 : index + 8;
          const cell = document.querySelectorAll(".cell")[newIndex] as
            | HTMLDivElement
            | undefined;
          cell?.focus();
          selectCell(newIndex);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          const newIndex = index % 9 !== 8 ? index + 1 : index - 8;
          const cell = document.querySelectorAll(".cell")[newIndex] as
            | HTMLDivElement
            | undefined;
          cell?.focus();
          selectCell(newIndex);
        }
      }}
    >
      <div className="candidates">
        {candidates.map((candidate, index) => (
          <span
            key={`${candidate}-${index}`}
            className={`candidate-${candidate}`}
          >
            {candidate}
          </span>
        ))}
      </div>
      {cellValue}
    </div>
  );
};
