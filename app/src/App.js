import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';

const Rows = 40
const Cols = 40

const ops = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, -1]
]


function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < Rows; i++) {
      rows.push(Array.from(Array(Cols), () => 0))
    }
    return rows
  });

  const [active, setActive] = useState(false)

  const activeRef = useRef(active)
  activeRef.current = active

  const activeSim = useCallback(() => {
    if(!activeRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < Rows; i++) {
          for(let k = 0; k < Cols; k++) {
            let neighbors = 0;
            ops.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y
                if (newI >= 0 && newI < Rows && newK >= 0 && newK < Cols) {
                  neighbors += g[newI][newK]
                }
            })
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1
            }
          }
        }
      })
    })
    setTimeout(activeSim)
  }, [])

  
  return (
    <div className="Container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Cols}, 20px)`
      }}
      >
        {grid.map((rows, i) => rows.map((col, k) => (
          <div 
          key={`${i}-${k}`}
          style={{
            backgroundColor: grid[i][k] ? "white" : undefined,
            border: "1px solid white",
            width: 20,
            height: 20
          }}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = grid[i][k] ? 0 : 1
            });
            setGrid(newGrid)
          }}
          >
          </div>
        )))}
      </div>
      <div className="TextField">
      <h1>Game of Life</h1>
      <h2>Rules:</h2>
      <ol>
        <li>Any live cell with fewer than two live neighbors dies.</li>
        <li>Any live cell with two or three live neighbors lives on to the next generation.</li>
        <li>Any live cell with more than three live neighbors dies.</li>
        <li>And dead cell with exactly three live neighbors becomes a live cell.</li>
      </ol>
      <button onClick={() => {
        setActive(!active)
        if(!active) {
          activeRef.current = true
          activeSim()
        }
      }}>{active ? 'stop' : 'start'}
      </button>
      </div>
    </div>
  );
}

export default App;