import { useNavigate } from "react-router-dom";

function BinTree() {
  const navigate = useNavigate();

  const navigateApp = () => {
    navigate("/");
  };

  return (
    <div>
      <p>BinTree</p>
      <button onClick={navigateApp}>Back</button>
    </div>
  );
}

export default BinTree;
