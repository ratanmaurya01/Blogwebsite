import React, { useState, useEffect } from 'react';

const GRID_SIZE = 10; // 10x10 grid
const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default function Game() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction]);

  const handleKeyDown = (e) => {
    if (DIRECTIONS[e.key]) {
      setDirection(DIRECTIONS[e.key]);
    }
  };

  const handleTouchDirection = (newDirection) => {
    setDirection(newDirection);
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    // Check for wall collision or snake collision
    if (head.x >= GRID_SIZE || head.y >= GRID_SIZE || head.x < 0 || head.y < 0 || snakeCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
      setFood(generateRandomFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const snakeCollision = (head) => {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const generateRandomFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeCollision(newFood));
    return newFood;
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setGameOver(false);
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center h-screen bg-gray-800">
      <div>
        <h1 className="text-white text-4xl font-bold mb-6">Snake Game</h1>
      </div>

      {/* Game Grid */}
      <div className="grid gap-1 bg-gray-700"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-8 h-8 md:w-10 md:h-10 sm:w-6 sm:h-6 ${isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-600'}`}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="mt-4">
          <h2 className="text-red-400 text-2xl">Game Over!</h2>
          <button
            onClick={restartGame}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      )}

      {/* On-screen controls for mobile */}
      <div className="mt-6 flex flex-col items-center space-y-2">
        <div>
          <button
            className="p-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
            onClick={() => handleTouchDirection(DIRECTIONS.ArrowUp)}
          >
            Up
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
            onClick={() => handleTouchDirection(DIRECTIONS.ArrowLeft)}
          >
            Left
          </button>
          <button
            className="p-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
            onClick={() => handleTouchDirection(DIRECTIONS.ArrowDown)}
          >
            Down
          </button>
          <button
            className="p-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
            onClick={() => handleTouchDirection(DIRECTIONS.ArrowRight)}
          >
            Right
          </button>
        </div>
      </div>
    </div>
  );
}
