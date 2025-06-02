import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
// import 'src/index.css';

const ItemTypes = { CHAIR: "chair" };

const Chair = ({ table, chair, fromTableId, dragEnabled }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timeout);
  }, [chair]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHAIR,
    item: { chair, fromTableId },
    canDrag: dragEnabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [dragEnabled]);



  return (
    <div
      ref={drag}
      className={`chair ${animate ? "chair-drop-animate" : ""}`}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#86868663",
        opacity: isDragging ? 0.5 : 1,
        transition: "all 0.3s ease",
        border: "1px solid #888",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    />
  );
};

export default Chair;
