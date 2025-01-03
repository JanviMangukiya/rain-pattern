import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const GRID_ROWS = 15;
const GRID_COLS = 20;
const DROP_LENGTH = 5;
const MIN_DROPS = 10;
const OPACITIES = [1, 0.8, 0.6, 0.4];

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

const randomGradient = () => {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  return `linear-gradient(45deg, ${color1}, ${color2})`;
};

const generateDrop = () => ({
  id: Math.random(),
  col: Math.floor(Math.random() * GRID_COLS),
  row: 0,
  color: randomGradient(),
});

const App = () => {
  const [rainDrops, setRainDrops] = useState([]);

  const addDrop = useCallback(() => {
    setRainDrops((prevDrops) => {
      const activeDrops = prevDrops.filter((drop) => drop.row < GRID_ROWS + DROP_LENGTH - 1);
      if (activeDrops.length < MIN_DROPS) {
        return [...activeDrops, generateDrop()];
      }
      return activeDrops;
    });
  }, []);

  useEffect(() => {
    const addDropInterval = setInterval(addDrop, 500);
    return () => clearInterval(addDropInterval);
  }, [addDrop]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setRainDrops((prevDrops) =>
        prevDrops.map((drop) => ({ ...drop, row: drop.row + 1 }))
      );
    }, 200);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="app">
      <h1 className="title">Falling Rain Pattern</h1>
      <div className="grid">
        {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {Array.from({ length: GRID_COLS }).map((_, colIndex) => {
              const drop = rainDrops.find(
                (drop) =>
                  drop.col === colIndex &&
                  rowIndex >= drop.row &&
                  rowIndex < drop.row + DROP_LENGTH
              );
              const opacityIndex = rowIndex - (drop ? drop.row : 0);
              const opacity = drop ? OPACITIES[DROP_LENGTH - 1 - opacityIndex] : 1;

              return (
                <div
                  key={colIndex}
                  className="grid-cell"
                  style={{
                    background: drop ? drop.color : 'transparent',
                    opacity,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
