import { FC, useEffect, useState } from "react";

type TEntry = {
  name: string;
  children?: TEntry[];
};

const FileBrowser: FC = () => {
  const test_files = {
    children: [
      {
        name: "main",
        children: [
          {
            name: "test_folder",
            children: [
              {
                name: "sup",
                children: [{ name: "psst.ts" }],
              },
              {
                name: "hello.json",
              },
              {
                name: "testing.js",
              },
            ],
          },
          {
            name: "second_folder",
            children: [],
          },
        ],
      },
    ],
  };

  const [files, setFiles] = useState(test_files);

  return (
    <div>
      {files.children.map((entry) => (
        <Entry {...entry} />
      ))}
    </div>
  );
};

const Entry: FC<TEntry> = ({ name, children }) => {
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<TEntry>();
  const [displayTextInput, setDisplayTextInput] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (newEntry?.name) {
      if (!open) {
        setOpen(true);
      }
      children?.push(newEntry);
      setNewEntry({
        name: "",
        children: undefined,
      });
    }
  }, [newEntry?.name]);

  const decodeHTML = function (html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const addNewFolder = () => {
    setNewEntry({
      name: newName,
      children: [],
    });
    setNewName("");
    setDisplayTextInput(false);
  };
  const addNewFile = () => {
    setNewEntry({
      name: newName,
      children: undefined,
    });
    setNewName("");
    setDisplayTextInput(false);
  };
  return (
    <div className="entry">
      <div className="folder">
        <button
          className="folder-toggle"
          onClick={() => setOpen((prev) => !prev)}
        >
          {`${
            children
              ? open
                ? decodeHTML("&#x1F4C2;")
                : decodeHTML("&#x1F4C1;")
              : decodeHTML("&#x1F4C4;")
          } ${name}`}
        </button>
        {children ? (
          <button className="add-btn" onClick={() => setDisplayTextInput(true)}>
            Add
          </button>
        ) : null}
      </div>
      {displayTextInput ? (
        <div>
          <input
            className="name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={!newName.includes(".") ? addNewFolder : addNewFile}>
            +
          </button>
        </div>
      ) : null}
      {open ? children?.map((entry) => <Entry {...entry} />) : null}
    </div>
  );
};

export default FileBrowser;
