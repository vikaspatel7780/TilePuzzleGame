import { useNavigate } from "react-router-dom";
import image1 from '../components/klipartz.com.png'
const SelectionPage = () => {
  const navigate = useNavigate();

  const handleBoardSize3 = () => {
    const size = 3;
    navigate("/game", { state: { boardSize: size } });
  };

  const handleBoardSize4 = () => {
    const size = 4;
    navigate("/game", { state: { boardSize: size } });
  };

  const handleBoardSize5 = () => {
    const size = 5;
    navigate("/game", { state: { boardSize: size } });
  };

  return (
    <div className="h-screen flex gap-10 flex-col items-center">
    <div className=" w-full flex flex-col items-center justify-center mt-4 gap-12">
        <h1>Slide Puzzle</h1>
        <h5 className=" text-blue-600 ">
          Challenge accepted! Ready to solve the puzzle? 🕹️🧩
        </h5>
      </div>
    <div className=" fixed h-[140%] w-[75%] text-red-300 rounded-lg opacity-15" style={{
        backgroundImage: `url(${image1})`, // Set background image
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: ""
      }}></div>
      <div className=" bg-transparent mt-8 w-96 text-center  ">
        <h1 className="text-4xl font-bold mb-4">Select Board Size</h1>
        <div className="mb-2">
          <div className="flex flex-col space-y-6 items-center ">
          <button className="btn btn-primary fs-4 w-48 rounded-pill shadow-md shadow-slate-800 bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-700 hover:scale-105" onClick={handleBoardSize3} >
              3 x 3
            </button>
            <button className="btn btn-primary fs-4 w-48 rounded-pill shadow-md shadow-slate-800 bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-700 hover:scale-105" onClick={handleBoardSize4} >
              4 x 4
            </button>
            <button className="btn btn-primary fs-4 w-48 rounded-pill shadow-md shadow-slate-800 bg-gradient-to-r from-blue-500 to-red-500 transform transition duration-700 hover:scale-105" onClick={handleBoardSize5} >
              5 x 5
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
