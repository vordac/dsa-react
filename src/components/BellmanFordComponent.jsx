import React from "react";

const BellmanFordComponent = ({
  distances,
  predecessors,
  currentStep,
  iterationDistances,
}) => {
  if (!distances) {
    return <div>Graph contains a negative weight cycle</div>;
  }

  const currentDistances = iterationDistances[currentStep] || distances;

  return (
    <div className="text-white w-full flex flex-col items-start overflow-auto rounded shadow-md text-center ">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-white p-2">Node</th>
            {Array.from(currentDistances.keys()).map((node) => (
              <th key={node} className="border border-white p-2">
                {node}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(currentDistances.entries()).map(([node, distance]) => (
            <tr key={node}>
              <td className="border border-white p-2">{node}</td>
              {Array.from(currentDistances.keys()).map((otherNode) => (
                <td key={otherNode} className="border border-white p-2">
                  {currentDistances.get(otherNode) === Infinity
                    ? "Inf"
                    : currentDistances.get(otherNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BellmanFordComponent;
