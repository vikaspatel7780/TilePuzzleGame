import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import image1 from "./klipartz.com.png";
import { IoIosUndo, IoIosRedo, IoMdRefresh } from "react-icons/io";

const Game = () => {
  const location = useLocation();
  let boardSize = location.state?.boardSize || 3;
  const [tilesArray, setTilesArray] = useState([]);
  const [emptyTileIndex, setEmptyTileIndex] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [boardSizeUser, setBoardSizeUser] = useState(boardSize);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isBoardSelected, setIsBoardSelected] = useState(true);
  const [stopTimer, setStopTimer] = useState(false);
  const [undoCount, setUndoCount] = useState(5);
  const [redoCount, setRedoCount] = useState(5);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isChangeBoardSize, setIsChangeBoardSize] = useState(false);
  const [userSelectSize, setUserSelectSize] = useState(3);
  const [isGameStatus, setIsGameStatus] = useState(false)

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0 && gameStatus === null && !stopTimer) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === null) {
      setIsGameStatus(true)
      setGameStatus("lost");
      setIsActive(false);
    }
   

    return () => clearInterval(timer);
  }, [isActive, timeLeft, gameStatus, stopTimer]);

  const startTimer = () => {
    setTimeLeft((boardSizeUser - 1) * 45);
    setIsActive(true);
    setGameStatus(null);
    setIsPageLoaded(true);
  };

  useEffect(() => {
    if (moveCount === 1) {
      startTimer();
    }
  }, [moveCount]);

  useEffect(() => {
    generateRandomNumbers();
    setIsPageLoaded(true);
  }, [boardSizeUser]);

  const generateRandomNumbers = () => {
    const numbers = Array.from(
      { length: boardSizeUser * boardSizeUser },
      (_, i) => i
    );
    
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setTilesArray(numbers);
    setEmptyTileIndex(numbers.indexOf(0));
    setMoveCount(0);
    setGameStatus(null);
    setIsGameStatus(false)
    setIsActive(false);
    setTimeLeft((boardSizeUser - 1) * 45);
    setUndoCount(5);
    setRedoCount(5);
    setHistory([numbers]);
    setCurrentStep(0);
  };

  const checkWinCondition = () => {
    // Loop through the tiles array, excluding the last tile
    for (let i = 0; i < tilesArray.length - 1; i++) {
      // Check if each tile is in its correct position
      if (tilesArray[i] !== i + 1) {
        return false; // Game is not won
      }
    }
    // The last tile should be 0 (the empty tile)
    return tilesArray[tilesArray.length - 1] === 0;
  };
  useEffect( ()=>{
    if (timeLeft !== 0) {
   
      if (checkWinCondition()) {
        setGameStatus("won");
        setIsGameStatus(true)
        setIsActive(false);
      }
      
    }
  },[ timeLeft,tilesArray, gameStatus, stopTimer])

  const handleTileClick = (index) => {
    if (checkIfAdjacent(emptyTileIndex, index) && timeLeft !== 0) {
      swapTiles(emptyTileIndex, index);

     
      if (checkWinCondition()) {
        setGameStatus("won");
        isGameStatus(true)
        setIsActive(false);
      }
    }
  };
  useEffect(() => {
    
    setIsPageLoaded(true);
  }, []);

  const checkIfAdjacent = (emptyIndex, index) => {
    const emptyRow = Math.floor(emptyIndex / boardSizeUser);
    const emptyCol = emptyIndex % boardSizeUser;
    const tileRow = Math.floor(index / boardSizeUser);
    const tileCol = index % boardSizeUser;
    return (
      (emptyRow === tileRow && Math.abs(emptyCol - tileCol) === 1) ||
      (emptyCol === tileCol && Math.abs(emptyRow - tileRow) === 1)
    );
  };

  const swapTiles = (emptyIndex, index) => {
    const newTilesArray = [...tilesArray];
    [newTilesArray[emptyIndex], newTilesArray[index]] = [
      newTilesArray[index],
      newTilesArray[emptyIndex],
    ];
    setTilesArray(newTilesArray);
    setEmptyTileIndex(index);
    setMoveCount((prevCount) => prevCount + 1);

    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newTilesArray);
    setHistory(newHistory);
    setCurrentStep(currentStep + 1);
  };

  const handleBoardSizeClick = (size) => {
    setUserSelectSize(size);
    if (moveCount != 0) {
      setIsChangeBoardSize(true);
      setStopTimer(true);
    } else {
      setBoardSizeUser(size);
      setIsBoardSelected(true);
    }
  };
  const handleCancelButton = () => {
   
    setIsGameStatus(false);
  };

  const handleUndoOption = () => {
    if (undoCount > 0 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTilesArray(history[currentStep - 1]);
      setEmptyTileIndex(history[currentStep - 1].indexOf(0));
      setUndoCount(undoCount - 1);
    }
  };
  const handleRedoOption = () => {
    if (redoCount > 0 && currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setTilesArray(history[currentStep + 1]);
      setEmptyTileIndex(history[currentStep + 1].indexOf(0));
      setRedoCount(redoCount - 1);
    }
  };

  const handleNewGame = () => {
    setBoardSizeUser(userSelectSize); // Set the board size
    setIsBoardSelected(true);
    setStopTimer(false);
    setIsChangeBoardSize(false);
  };
  const handleCancelButton2 = () => {
    setIsChangeBoardSize(false);
    setStopTimer(false);
  };

  return (
    <div className="h-screen w-full flex-col items-center  ">
      <div className=" w-full flex flex-col items-center justify-center mt-4 gap-12 ">
        <h1>Slide Puzzle</h1>
        <h5 className="  text-blue-600 ">
          Challenge accepted! Ready to solve the puzzle? 🕹️🧩
        </h5>
      </div>
      <div className=" flex items-center w-full justify-center">
        <div
          className=" fixed h-[140%] w-[75%] rounded-lg opacity-10"
          style={{
            backgroundImage: `url(${image1})`, // Set background image
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundColor: "",
          }}
        ></div>

        <div
          className={`flex flex-row-reverse w-full justify-around z-40 transform transition duration-700 ${
            isPageLoaded ? "translate-y-6" : "-translate-y-20 opacity-0"
          }`}
        >
          <div
            className={`flex flex-col items-center transform transition duration-700 ${
              isBoardSelected ? "translate-x-0" : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="w-full flex flex-row-reverse justify-between items-end">
              <div
                className={`text-xl ${
                  timeLeft <= 10
                    ? "text-red-600"
                    : 10 < timeLeft && timeLeft < ((boardSizeUser - 1) * 45) / 2
                    ? "text-blue-700"
                    : "text-green-700"
                }`}
              >
                {gameStatus === "lost"? (
                  "Time's Up!"
                ) : gameStatus === "won" ? (
                  "You Win!"
                ) : (
                  <>
                    <span className="text-black font-bold">Time: </span>
                    {timeLeft}s
                  </>
                )}
              </div>
              <div className="flex gap-4 relative">
                {moveCount >= 1 ? (
                  <>
                    {hoveredIcon === "undo" && (
                      <div className="absolute -top-7 p-1 rounded-lg left-0 text-lg text-slate-100 w-64 bg-slate-500 opacity-80">
                        You Can Undo Only {undoCount} moves
                      </div>
                    )}
                    <div
                      className=" cursor-pointer "
                      onMouseEnter={() => setHoveredIcon("undo")}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <IoIosUndo
                        className={` hover:text-blue-500 ${
                          undoCount === 0
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        size={24}
                        onClick={handleUndoOption}
                      />
                    </div>
                  </>
                ) : null}

                {undoCount <= 4 ? (
                  <>
                    {hoveredIcon === "redo" && (
                      <div className="absolute -top-7 p-1 rounded-lg left-12 text-lg text-slate-100 w-64 bg-slate-500 opacity-80">
                        You Can Redo Only {redoCount} moves
                      </div>
                    )}
                    <div>
                      {" "}
                      <IoIosRedo
                        className={` hover:text-blue-500 ${
                          redoCount === 0
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        size={24}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Redo"
                        onClick={handleRedoOption}
                        onMouseEnter={() => setHoveredIcon("redo")}
                        onMouseLeave={() => setHoveredIcon(null)}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div
              className={`grid my-6 border-8 border-slate-700 rounded-lg cursor-pointer transform transition-all duration-700 ${
                timeLeft <= 10 ? "shadow-2xl shadow-red-400" : ""
              } ${gameStatus === "won" ? "bg-green-400" : ""}`}
              style={{
                gridTemplateColumns: `repeat(${boardSizeUser}, minmax(0, 1fr))`,
                transform: `scale(${1 + (boardSizeUser - 3) * 0.05})`, // slight scaling effect for board sizes
                opacity: 1,
                transition: "transform 0.5s ease, opacity 0.5s ease", // smooth transition for transform and opacity
              }}
            >
              {tilesArray.map((tile, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center  text-3xl sm:text-6xl font-bold cursor-pointer z-50 bg-transparent   ${
                    tile === 0
                      ? "bg-gray-50"
                      : "bg-white text-black border-8 border-t-slate-500 border-r-slate-300 border-b-slate-300 border-l-slate-500 shadow-lg"
                  }`}
                  style={{
                    transform: `scale(${tile !== 0 ? 1 : 0.9})`,
                    opacity: tile !== 0 ? 1 : 0.7,
                    transition: "all 0.4s ease-in-out", //
                    height:
                      boardSizeUser === 3
                        ? "5rem"
                        : boardSizeUser === 4
                        ? "4rem"
                        : "3.5rem", // Adjust for each board size
                    width:
                      boardSizeUser === 3
                        ? "5rem"
                        : boardSizeUser === 4
                        ? "4rem"
                        : "3.5rem", // Adjust for each board size
                    fontSize:
                      boardSizeUser === 3
                        ? "1.5rem"
                        : boardSizeUser === 4
                        ? "1.5rem"
                        : "1.25rem",
                  }}
                  onClick={() => handleTileClick(index)}
                >
                  {tile !== 0 ? tile : ""}
                </div>
              ))}
            </div>

            <div className="flex w-full justify-between items-center">
              <div className=" " onClick={generateRandomNumbers}>
                <IoMdRefresh
                  size={24}
                  className=" font-bold cursor-pointer hover:text-blue-500"
                />
                <span>Refresh</span>
              </div>

              <div className="flex items-center rounded-md text-black">
                <span className="text-lg font-bold">Moves:</span>
                <span className="ml-2 font-bold">{moveCount}</span>
              </div>
            </div>
          </div>
          <div
            className={` md:flex hidden  flex-col z-50  bg-transparent p-6 rounded-lg w-1/2 items-center text-center ${
              isPageLoaded ? "translate-x-0" : "translate-x-20 opacity-0"
            }`}
          >
            <h1 className="text-2xl font-bold w-full mb-4">
              Wish You Change Your Board ? Choose Here!{" "}
            </h1>
            <h1 className="text-3xl font-bold mb-4 items-center w-full">
              Select Board Size
            </h1>
            <div className="flex flex-col space-y-6 items-center">
              {boardSizeUser === 3 ? (
                ""
              ) : (
                <button
                  className="btn btn-primary fs-3 w-48 shadow-md rounded-pill text-white font-bold bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-2000 hover:scale-105"
                  onClick={() => handleBoardSizeClick(3)}
                >
                  3 x 3
                </button>
              )}
              {boardSizeUser === 4 ? (
                ""
              ) : (
                <button
                  className="btn btn-primary fs-3 w-48 rounded-pill  text-white font-bold bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-2000 hover:scale-105"
                  onClick={() => handleBoardSizeClick(4)}
                >
                  4 x 4
                </button>
              )}
              {boardSizeUser === 5 ? (
                ""
              ) : (
                <button
                  className="btn btn-primary  fs-3 w-48 shadow-md rounded-pill text-white font-bold bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-2000 hover:scale-105"
                  onClick={() => handleBoardSizeClick(5)}
                >
                  5 x 5
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      {isGameStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm text-center">
            <h1
              className={`text-2xl font-bold mb-4 ${
                gameStatus === "lost" ? "text-red-600" : "text-green-600"
              }`}
            >
              {gameStatus === "lost" ? (
                <>
                  <span role="img" aria-label="crying face">
                    😞
                  </span>{" "}
                  You Lost!
                </>
              ) : (
                <>
                  <span role="img" aria-label="trophy">
                    🏆
                  </span>{" "}
                  You Win!
                </>
              )}
            </h1>

            {gameStatus === "lost" ? (
              <p className="text-lg font-medium text-gray-700 mb-2">
                Don't worry, you'll get it next time! 💪
              </p>
            ) : (
              <p className="text-lg font-medium text-gray-700 mb-2">
                Amazing job! Keep up the great work! 🎉
              </p>
            )}

            <p className="text-lg font-medium text-gray-700 mb-2">
              Moves:{" "}
              <span className="font-bold text-blue-600">{moveCount}</span>
            </p>

            <p className="text-lg font-medium text-gray-700 mb-2">
              Undo:{" "}
              <span className="font-bold text-blue-600">{5 - undoCount}</span>
            </p>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Redo:{" "}
              <span className="font-bold text-blue-600">{5 - redoCount}</span>
            </p>
            <p className="text-lg font-medium text-gray-700 mb-4">
              Time left:{" "}
              <span className="font-bold text-yellow-500">
                {timeLeft} seconds
              </span>
            </p>

            <div className=" flex w-full justify-between">
              <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={generateRandomNumbers}
              >
                Play Again
              </button>
              <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleCancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isChangeBoardSize && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl max-w-md w-full text-center space-y-6 mx-4 md:mx-0">
            <p className="text-gray-800 text-lg font-semibold">
              Starting a new game will erase your latest move. Are you sure you
              want to start fresh?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                onClick={handleNewGame}
              >
                New Game
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                onClick={handleCancelButton2}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
