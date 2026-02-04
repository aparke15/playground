import { FC, useState } from "react";

type TSynonym = {
  word: string;
  score: number;
};

const Thesaurus: FC = () => {
  const [word, setWord] = useState("");
  const [synonyms, setSynonyms] = useState<TSynonym[]>();

  const BASE_URL = "https://api.datamuse.com/words?";

  const getSynonyms = () => {
    fetch(`${BASE_URL}rel_syn=${word}`)
      .then((res) => res.json())
      .then((data) => setSynonyms(data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={getSynonyms}>Find Synonyms</button>
      </div>
      {synonyms ? (
        <div>
          {synonyms.map((syn, idx) => {
            return <div>{`${idx + 1}: ${syn.word}`}</div>;
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Thesaurus;
