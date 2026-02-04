import { Button } from "@mui/material";
import { FC, useEffect, useState } from "react";

const MemoryGame = () => {
  const [gameBoard, setGameBoard] = useState<string[][]>();

  const [guess, setGuess] = useState<string>("");
  const [matches, setMatches] = useState<string[]>([]);
  const [incorrect, setIncorrect] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (incorrect) {
      const delay = setTimeout(() => setIncorrect(false), 1000);
      return () => {
        clearTimeout(delay);
      };
    }
  }, [incorrect]);

  useEffect(() => {
    if (gameBoard && matches.length) {
      const totalLetters = gameBoard.length*gameBoard.length * 0.5 
      if (matches.length === totalLetters) {
        setGameOver(true);
      } else {
        setCorrect(true);
        const delay = setTimeout(() => setCorrect(false), 1000);
        return () => {
          clearTimeout(delay);
        };
      }
    }
  }, [matches]);

  const checkIfLetterNeeded = (letter: string, list: string[]) => {
    const count = list.reduce((a, v) => (v === letter ? a + 1 : a), 0);
    return count < 2;
  };

  const refresh = () => {
    setGuess('');
    setMatches([]);
    setIncorrect(false);
    setCorrect(false);
    setGameBoard(undefined);
    setGameOver(false);
  }

  const generateGameBoard = (side: number) => {
    refresh();
    const n = side * side * 0.5;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const start = Math.round(Math.random() * (25 - n));
    const end = start + n;
    const gameLetters = [...letters.substring(start, end)];

    const board: string[][] = [];
    const usedLetters: string[] = [];

    for (let i = 0; i < side; i++) {
      board.push([]);
    }
    board.forEach((column) => {
      for (let i = 0; i < side; i++) {
        let x = Math.round(Math.random() * (n - 1));

        while (!checkIfLetterNeeded(gameLetters[x], usedLetters)) {
          x = Math.round(Math.random() * (n - 1));
        }
        column.push(gameLetters[x]);
        usedLetters.push(gameLetters[x]);
      }
    });
    console.log(board);

    setGameBoard(board);
  };

  const makeGuess = (cardValue: string) => {
    if (!guess) {
      // firstGuess - store in state
      console.log(cardValue);

      setGuess(cardValue);
    } else {
      if (guess === cardValue) {
        // it's a match - store matched value
        console.log(`setting ${cardValue} in matched`);

        setMatches([...matches, cardValue]);
      } else {
        console.log("NOT A MATCH");
        setIncorrect(true);
      }
      console.log(guess, matches);

      setGuess("");
    }
  };

  return (
    <>
      <div>
        <Button onClick={() => generateGameBoard(4)}>{gameBoard ? 'REFRESH' : "GENERATE BOARD"}</Button>

        {incorrect ? (
          <div style={{ color: "red", padding: "50px" }}>Sorry, try again!</div>
        ) : correct ? (
          <div style={{ color: "green", padding: "50px" }}>
            You found a match!
          </div>
        ) : gameOver ? (
          <div style={{ color: "green", padding: "50px" }}>
            Congratulations, You Won!!
          </div>
        ) : (
          <div style={{ color: "red", padding: "50px" }} />
        )}
      </div>
      <div style={{ display: "flex" }}>
        {gameBoard ? (
          <GameBoard
            gameBoard={gameBoard}
            matches={matches}
            makeGuess={makeGuess}
            currentGuess={!!guess}
            error={incorrect}
          />
        ) : null}
      </div>
    </>
  );
};

type Card = {
  value: string;
};

const GameBoard: FC<{
  gameBoard: string[][];
  matches: string[];
  makeGuess: (val: string) => void;
  currentGuess: boolean;
  error: boolean;
}> = ({ gameBoard, matches, makeGuess, currentGuess, error }) => {
  return (
    <>
      {gameBoard.map((column, i) => {
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column" }}>
            {column.map((cardVal: string) => {
              const matched = matches.includes(cardVal);
              return (
                <GameCard
                  card={{ value: cardVal }}
                  matched={matched}
                  makeGuess={makeGuess}
                  currentGuess={currentGuess}
                  error={error}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const GameCard: FC<{
  card: Card;
  matched: boolean;
  makeGuess: (cardVal: string) => void;
  currentGuess: boolean;
  error: boolean;
}> = ({ card, matched, makeGuess, currentGuess, error }) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (!currentGuess) {
      const delay = setTimeout(() => setDisplay(matched), 1000);
      return () => {
        clearTimeout(delay);
      };
    }
  });

  const handleClick = () => {
    if (!matched) {
      makeGuess(card.value);
      setDisplay((prev) => !prev);
    }
  };

  const getButtonColor = () => {
    if (matched) {
      return "success";
    }
    if (error && display) {
      return "error";
    }
    return "inherit";
  }

  return (
    <Button
      style={{ width: "100px", height: "100px", margin: "20px" }}
      variant="outlined"
      color={getButtonColor()}
      onClick={!matched && !error ? handleClick : undefined}
    >
      {matched ? card.value : display ? card.value : null}
    </Button>
  );
};

export default MemoryGame;
