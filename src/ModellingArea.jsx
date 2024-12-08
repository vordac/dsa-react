import { useNavigate } from "react-router-dom";

function ModellingArea() {
  const navigate = useNavigate();

  const navigateApp = () => {
    navigate("/");
  };

  return (
    <div>
      <p>ModellingArea</p>
      <button onClick={navigateApp}>Back</button>
    </div>
  );
}

export default ModellingArea;
