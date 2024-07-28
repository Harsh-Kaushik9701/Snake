import { useEffect, useRef, useState } from "react";

const Game_Size = 20;
const GAMEGRID = Array.from({ length: Game_Size }, () => new Array(Game_Size).fill(""));
const Initial_Snake = [[5, 5]];

const generateFood = () => {
    const x = Math.floor(Math.random() * Game_Size);
    const y = Math.floor(Math.random() * Game_Size);
    return [x, y];
}

export default function SnakeGame() {
    const [snakeBody, setSnakeBody] = useState(Initial_Snake);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const directionRef = useRef([1, 0]);
    const foodRef = useRef(generateFood());

    const isSnakeBodyDiv = (xc, yc) => {
        return snakeBody.some(([x, y]) => x === xc && y === yc);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isPaused) return;

            setSnakeBody((prevSnakeBody) => {
                const newHead = [prevSnakeBody[0][0] + directionRef.current[0], prevSnakeBody[0][1] + directionRef.current[1]];

                if (
                    newHead[0] < 0 ||
                    newHead[0] >= Game_Size ||
                    newHead[1] < 0 ||
                    newHead[1] >= Game_Size ||
                    prevSnakeBody.some(([x, y]) => newHead[0] === x && newHead[1] === y)
                ) {
                    setIsPaused(true); // Pause the game
                    return prevSnakeBody;
                }

                const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);

                if (newHead[0] === foodRef.current[0] && newHead[1] === foodRef.current[1]) {
                    foodRef.current = generateFood();
                    setScore(score + 1);
                } else {
                    copySnakeBody.pop();
                }

                copySnakeBody.unshift(newHead);
                return copySnakeBody;
            });
        }, 500);

        const handleDirection = (e) => {
            const key = e.key;
            if (key === "ArrowUp" && directionRef.current[1] !== 1) {
                directionRef.current = [0, -1];
            } else if (key === "ArrowDown" && directionRef.current[1] !== -1) {
                directionRef.current = [0, 1];
            } else if (key === "ArrowLeft" && directionRef.current[0] !== 1) {
                directionRef.current = [-1, 0];
            } else if (key === "ArrowRight" && directionRef.current[0] !== -1) {
                directionRef.current = [1, 0];
            }
        };

        window.addEventListener("keydown", handleDirection);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleDirection);
        };
    }, [score, isPaused]);

    return (
        <>
            <div className="heading"><h1>Let's play the Snake Game</h1></div>
            <div className="score"><h2>Score: {score}</h2></div>
            {isPaused && <div className="game-over"><h2>Game Over</h2></div>}
            <div className="container">
                {GAMEGRID.map((row, yc) => {
                    return row.map((cell, xc) => {
                        return (
                            <div
                                key={`${xc}-${yc}`}
                                className={`cell ${isSnakeBodyDiv(xc, yc) ? "snake" : ""} ${foodRef.current[0] === xc && foodRef.current[1] === yc ? 'food' : ""}`}
                            ></div>
                        );
                    });
                })}
            </div>
        </>
    );
}
