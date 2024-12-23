
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectionPage from "./components/SelectionPage";
import GamePage from "./components/Game";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
