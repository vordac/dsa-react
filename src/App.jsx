import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Graph from "./Graph";
import BinTree from "./BinTree";

function App() {
  let navigate = useNavigate();

  const navigateGraph = () => {
    let path = `/graph`;
    navigate(path);
  };

  const navigateBinTree = () => {
    let path = `/bintree`;
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen w-screen">
      <div className="flex gap-x-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center text-center w-[256px] h-[300px] bg-red-500 text-lg rounded-md font-bold">
            <p>Directed</p>
            <p>Weighted</p>
            <p>Graph</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded font-bold"
            onClick={navigateGraph}
          >
            Start
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center text-center w-[256px] h-[300px] bg-blue-500 text-lg rounded-md font-bold">
            Binary Tree
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded font-bold"
            onClick={navigateBinTree}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/bintree" element={<BinTree />} />
      </Routes>
    </Router>
  );
}

export default Main;
