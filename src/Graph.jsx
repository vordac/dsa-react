import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdjacencyList from "./AdjacencyList";

function Graph() {
  const navigate = useNavigate();
  const [adjacencyList, setAdjacencyList] = useState(new Map());

  const navigateApp = () => {
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Graph Area */}
      <div className="flex flex-col">
        {/* Modelling Area */}
        <div className="flex flex-col">
          <div className="text-lg font-bold">Graph</div>
          <div className="bg-white m-8 w-[512px] h-[440px]"></div>
        </div>

        {/* Buttons Area */}
        <div className="flex gap-x-8 items-center justify-center">
          <button>Start</button>
          <button>Stop</button>
          <button>Back</button>
          <button onClick={navigateApp}>Home</button>
        </div>
      </div>
      {/* Adjacency List Area*/}
      <div>
        {/* Adjacency List */}
        <div className="flex flex-col">
          <AdjacencyList
            adjacencyList={adjacencyList}
            setAdjacencyList={setAdjacencyList}
          />
        </div>
      </div>
    </div>
  );
}

export default Graph;
