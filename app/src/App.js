import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';

let Rows = 40;
let Cols = 40;
let Count = 0;

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

const resetGrid = () => {
  const rows = [];
    for (let i = 0; i < Rows; i++) {
      rows.push(Array.from(Array(Cols), () => 0));
    }
    Count = 0;
    return rows;
}

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < Rows; i++) {
      rows.push(Array.from(Array(Cols), () => 0))
    }
    return rows
  });

  const [active, setActive] = useState(false)
  const [speed, setSpeed] = useState(50)

  const activeRef = useRef(active)
  activeRef.current = active

  const speedRef = useRef(speed);
  speedRef.current = speed

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
    setTimeout(activeSim, speedRef.current)
    Count++
  }, [])

  const handleChange = event => {
    setSpeed(event.target.value)
  }
  
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
        <p>Generations: {Count}</p>
        <button onClick={() => {
          setActive(!active)
          if(!active) {
            activeRef.current = true;
            Count = 0;
            activeSim();
          }
        }}
        id="button"
        >{active ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => {
          Rows = 40;
          Cols = 40;
          setGrid(resetGrid());
        }}
        className="reset"
        id="button"
        >
          Reset
        </button>
        <button onClick={() => {
          const rows = [];
          for (let i = 0; i < Rows; i++) {
            rows.push(Array.from(Array(Cols), () => Math.random() > .5))
          }
          Count = 0;
          setGrid(rows)
        }}
        id="button"
        >Random</button>
        <p>Speed: {speed}</p>
        <input
          type="range"
          name='speed'
          className="slider"
          onChange={handleChange} 
          value={speed.value}
        />
        <p>Rows: {Rows}</p>
        <button onClick={( ) => {
        Rows++;
          setGrid(resetGrid());
        }}
        className="margin"
        id="button"
        >+</button>
        <button onClick={( ) => {
        Rows--;
          setGrid(resetGrid());
        }}
        id="button"
        >-</button>
        <p>Columns: {Cols}</p>
        <button onClick={( ) => {
        Cols++;
          setGrid(resetGrid());
        }}
        className="margin"
        id="button"
        >+</button>
        <button onClick={( ) => {
        Cols--;
          setGrid(resetGrid());
        }}
        id="button">-
        </button>
      </div>
    </div>
  );
}

export default App;