import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import DirectedWeightedGraphComponent from "./components/DirectedWeightedGraphComponent";
import BinarySearchTreeComponent from "./components/BinarySearchTreeComponent";

function App() {
  let navigate = useNavigate();

  const navigateGraph = () => {
    let path = `/graph`;
    navigate(path);
  };

  const navigateBinTree = () => {
    let path = `/binaryTree`;
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen w-screen ">
      <div className="flex gap-x-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center text-center w-[256px] h-[300px] bg-red-500 text-lg rounded-md font-bold">
            <p>Орієнтований</p>
            <p>Зважений</p>
            <p>Граф</p>
          </div>
          <button
            className="px-4 py-2 text-white rounded font-bold"
            onClick={navigateGraph}
          >
            Почати
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center text-center w-[256px] h-[300px] bg-blue-500 text-lg rounded-md font-bold">
            <p>Бінарне</p>
            <p>Дерево</p>
          </div>
          <button
            className="px-4 py-2 text-white rounded font-bold"
            onClick={navigateBinTree}
          >
            Почати
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
        <Route path="/graph" element={<DirectedWeightedGraphComponent />} />
        <Route path="/binaryTree" element={<BinarySearchTreeComponent />} />
      </Routes>
    </Router>
  );
}

export default Main;
