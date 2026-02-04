import { FC, useState } from "react"


const InsertIntoList: FC = () => {
    
    const [blocks, setBlocks] = useState(['a', 'b', 'c'])
    
    const addBlock = (index: number) => {
        setBlocks(prevblocks => [
            ...prevblocks.slice(0, index+1),
            '_',
            ...prevblocks.slice(index + 1)
        ]);
    }

    const editBlockLabel = (value: string, idx: number) => {
        setBlocks((prev) => prev.map((block, i) => (i === idx ? value : block)))
    }
    

    return (
        <div style={{display: 'flex'}}>{
            blocks?.map((blockLabel, idx) => (
                <div key={`${blockLabel}-${idx}`} style={{display: 'flex'}}>
                    <div className="block">
                        <input onChange={(e) => editBlockLabel(e.currentTarget.value, idx)} value={blockLabel} />
                    </div>
                    {idx < blocks.length - 1 ? <div style={{padding: '2.5px', cursor: 'pointer'}} onClick={() => addBlock(idx)}/> : null}
                </div>
            ))
        }</div>
    )
}

export default InsertIntoList;