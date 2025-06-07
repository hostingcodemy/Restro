import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Chair from "./Chair";
// import 'src/index.css';

const ItemTypes = { TABLE: "table", CHAIR: "chair" };

const Table = ({ table, moveTable, onDropChair, dragEnabled, isAddChairMode, onAddChairs }) => {

  const [showChairModal, setShowChairModal] = useState(false);
  const [chairCount, setChairCount] = useState('');
  const popupRef = useRef(null);

useEffect(() => {
if (showChairModal && popupRef.current) {
  popupRef.current.focus();
}

}, [showChairModal])



  const handleTableClick = () => {
    if (isAddChairMode) {
      setShowChairModal(true);
    }
  };

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CHAIR,
    drop: (item) => {
      if (item.fromTableId !== table.tableId) {
        onDropChair(item.chair, item.fromTableId, table.tableId);
      }
    }
  }));

  const baseWidth = 100;
  const extraWidthPerChair = 10;
  const width = table.chairs.length > 4
    ? baseWidth + (table.chairs.length * extraWidthPerChair)
    : baseWidth;
  const height = 100;

  const renderChairs = () => {
    const chairs = table.chairs;
    const elements = [];

    if (chairs.length <= 4) {
      const positions = ["top", "bottom", "left", "right"];
      chairs.forEach((chair, i) => {
        elements.push(
          <div
            key={chair.id}
            className={`chair-wrapper ${positions[i]}`}
            style={getChairStyle(positions[i])}
          >
            <Chair
              table={table}
              chair={chair}
              fromTableId={table.tableId}
              dragEnabled={dragEnabled}
            />
          </div>
        );
      });
    } else {
      const half = Math.ceil(chairs.length / 2);
      chairs.forEach((chair, i) => {
        const isTop = i < half;
        const rowIndex = isTop ? i : i - half;
        const totalInRow = isTop ? half : chairs.length - half;
        const gapPercent = 100 / (totalInRow + 1);
        const leftPercent = (rowIndex + 1) * gapPercent;

        elements.push(
          <div
            key={chair.id}
            className={`chair-wrapper ${isTop ? "top" : "bottom"}`}
            style={{
              position: "absolute",
              left: `${leftPercent}%`,
              transform: "translateX(-50%)",
            top: isTop ? "-10px" : "calc(100% - 10px)"
            }}
          >
            <Chair
              table={table}
              chair={chair}
              fromTableId={table.tableId}
              dragEnabled={dragEnabled}
            />
          </div>
        );
      });
    }

    return elements;
  };

  const getChairStyle = (position) => {
    const styles = { position: "absolute" };
    switch (position) {
      case "top":
        return { ...styles, top: "-10px", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { ...styles, bottom: "-10px", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { ...styles, left: "-10px", top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { ...styles, right: "-10px", top: "50%", transform: "translateY(-50%)" };
      default:
        return styles;
    }
  };

  const handleMouseDown = (e) => {
    if (!dragEnabled) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = table.position.x;
    const origY = table.position.y;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      moveTable(table.tableId, origX + dx, origY + dy);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

    const chairBgColor = () => {
    switch (table?.tableStatus) {
      case "Available": return "#90C67C";
      case "Reserved": return "#FF3F33";
      case "Hold": return "#FFAF00";
      case "Occupied": return "#344CB7";
      default: return "#ccc";
    }
  };

  return (
    <>
      {showChairModal && (
        <div  className="chair-modal-overlay">
          <div className="chair-modal-content animate-scale-in">

            <div className="modal-input-group">
              <div
                className="step-btn"
                onClick={() =>
                  setChairCount((prev) => String(Number(prev || 0) - 1))
                }
              >
                −
              </div>

              <input
              ref={popupRef}
                type="number"
                value={chairCount}
                onChange={(e) => setChairCount(e.target.value)}
                className="modal-input"
                placeholder="Enter number (e.g., 3 or -2)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const count = parseInt(chairCount);
                    if (!isNaN(count) && count !== 0) {
                      onAddChairs(table.tableId, count);
                      setChairCount('');
                      setShowChairModal(false);
                    }
                  }
                }}
              />

              <div
                className="step-btn"
                onClick={() =>
                  setChairCount((prev) => String(Number(prev || 0) + 1))
                }
              >
                +
              </div>
            </div>

            <div className="modal-actions">
              <div
                className="modal-btn cancel"
                onClick={() => setShowChairModal(false)}
              >
                Cancel
              </div>
              <div
                className="modal-btn confirm"
                onClick={() => {
                  const count = parseInt(chairCount);
                  if (!isNaN(count) && count !== 0) {
                    onAddChairs(table.tableId, count);
                    setChairCount('');
                    setShowChairModal(false); 
                  }
                }}
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={drop}
        className="table-wrapper"
        style={{
          left: table.position.x,
          top: table.position.y,
          width: `${width}px`,
          height: `100px`,
          position: "absolute",
          backgroundColor: chairBgColor(),
          border: "2px solid #ccc",
          borderRadius: "8px",
          opacity: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:"white"
        }}
        onMouseDown={handleMouseDown}
        onClick={handleTableClick}
      >
        {renderChairs()}
        <div style={{ zIndex: 1 }}>{table.tableName}</div>
      </div>

    </>

  );
};

export default Table;