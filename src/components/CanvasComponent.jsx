import React, { useRef, useEffect, useState } from "react";

const CanvasComponent = ({
  graphData,
  setGraphData,
  currentStep,
  animationQueue,
  isPlaying,
}) => {
  const canvasRef = useRef(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { nodes, links } = graphData;

    const draw = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw links
      links.forEach((link) => {
        const { source, target, weight } = link;
        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(
            targetNode.y - sourceNode.y,
            targetNode.x - sourceNode.x
          );
          const arrowSize = 10;
          const arrowOffset = 15; // Offset to avoid overlapping with the node
          ctx.fillStyle = "black";
          const arrowX = targetNode.x - arrowOffset * Math.cos(angle);
          const arrowY = targetNode.y - arrowOffset * Math.sin(angle);

          ctx.save();
          ctx.translate(arrowX, arrowY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-arrowSize, -arrowSize / 2);
          ctx.lineTo(-arrowSize, arrowSize / 2);
          ctx.closePath();
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.restore();

          // Draw weight label
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = "yellow";
          ctx.font = "bold 16px sans-serif"; // Make the font bold
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(weight, midX, midY);
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHighlighted =
          currentStep < animationQueue.length &&
          (node.id === animationQueue[currentStep][0] ||
            node.id === animationQueue[currentStep][1]);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = isHighlighted ? "red" : "black";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.id, node.x, node.y);
      });

      ctx.restore();
    };

    const getMousePos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (evt.clientX - rect.left - pan.x) / zoom,
        y: (evt.clientY - rect.top - pan.y) / zoom,
      };
    };

    const onMouseDown = (evt) => {
      const mousePos = getMousePos(evt);
      const clickedNode = nodes.find(
        (node) =>
          Math.pow(node.x - mousePos.x, 2) + Math.pow(node.y - mousePos.y, 2) <=
          15 * 15
      );
      if (clickedNode) {
        setDraggingNode(clickedNode);
        setOffset({
          x: mousePos.x - clickedNode.x,
          y: mousePos.y - clickedNode.y,
        });
      } else {
        setIsPanning(true);
        setPanStart({ x: evt.clientX, y: evt.clientY });
      }
    };

    const onMouseMove = (evt) => {
      if (draggingNode) {
        const mousePos = getMousePos(evt);
        setGraphData((prevGraphData) => {
          const newNodes = prevGraphData.nodes.map((node) =>
            node.id === draggingNode.id
              ? { ...node, x: mousePos.x - offset.x, y: mousePos.y - offset.y }
              : node
          );
          return { ...prevGraphData, nodes: newNodes };
        });
      } else if (isPanning) {
        const dx = evt.clientX - panStart.x;
        const dy = evt.clientY - panStart.y;
        setPan({ x: pan.x + dx, y: pan.y + dy });
        setPanStart({ x: evt.clientX, y: evt.clientY });
      }
    };

    const onMouseUp = () => {
      setDraggingNode(null);
      setIsPanning(false);
    };

    const onWheel = (evt) => {
      evt.preventDefault();
      const scale = evt.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prevZoom) => Math.max(0.1, Math.min(prevZoom * scale, 5)));
    };

    const debouncedDraw = () => {
      requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel);

    draw();

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [
    graphData,
    draggingNode,
    offset,
    setGraphData,
    zoom,
    pan,
    isPanning,
    panStart,
    currentStep,
    animationQueue,
    isPlaying,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const { nodes, links } = graphData;
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw links
      links.forEach((link) => {
        const { source, target, weight } = link;
        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.fillStyle = "black";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(
            targetNode.y - sourceNode.y,
            targetNode.x - sourceNode.x
          );
          const arrowSize = 10;
          const arrowOffset = 15; // Offset to avoid overlapping with the node
          const arrowX = targetNode.x - arrowOffset * Math.cos(angle);
          const arrowY = targetNode.y - arrowOffset * Math.sin(angle);

          ctx.save();
          ctx.translate(arrowX, arrowY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-arrowSize, -arrowSize / 2);
          ctx.lineTo(-arrowSize, arrowSize / 2);
          ctx.closePath();
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.restore();

          // Draw weight label
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = "yellow";
          ctx.font = "bold 16px sans-serif"; // Make the font bold
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(weight, midX, midY);
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHighlighted =
          currentStep < animationQueue.length &&
          (node.id === animationQueue[currentStep][0] ||
            node.id === animationQueue[currentStep][1]);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = isHighlighted ? "red" : "black";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.id, node.x, node.y);
      });

      ctx.restore();
    };

    draw();
  }, [graphData, zoom, pan, currentStep, animationQueue, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={360}
      style={{ border: "1px solid white", borderRadius: "4px" }}
    />
  );
};

export default CanvasComponent;
