import React, { useEffect, useRef, useState } from "react";
import { PiPrinterThin } from "react-icons/pi";
import { useDrag, useDrop } from "react-dnd";
import Chair from "./Chair";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const ItemTypes = { TABLE: "table", CHAIR: "chair" };

const Table = ({ table, moveTable, onDropChair, dragEnabled, isAddChairMode, onAddChairs, facility }) => {

  const [showChairModal, setShowChairModal] = useState(false);
  const [chairCount, setChairCount] = useState('');
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showChairModal && popupRef.current) {
      popupRef.current.focus();
    }

  }, [showChairModal])



  const handleTableClick = () => {
    if (isAddChairMode) {

      setShowChairModal(true);

    } else {

      navigate("/order-management");

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

    return elements;
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


  const getBgColor = (status) => {
    return facilityColorMap[status] || "gray";
  };

  const facilityColorMap = {};
  facility.forEach(facility => {
    facilityColorMap[facility.facilityStatusId] = facility.colour;
  });

  return (
    <>
      {showChairModal && (
        <div className="chair-modal-overlay">
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
                placeholder="Add Chair"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const count = parseInt(chairCount);
                    if (!isNaN(count) && count !== 0) {
                      onAddChairs(table.tableId, count, table);
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
                Add
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "relative",
          display: "inline-block",
          border: `0.01rem solid ${getBgColor(table.facilityStatusId)}`,
          borderRadius: "10px",
          padding: "1rem"
        }}
      >

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-12px",
            transform: "translateY(-50%)",

            borderRadius: "50%",

          }}
        >
          <PiUserCirclePlusLight size={30} />
        </div>


        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-8px",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            padding: "2px",
            zIndex: "999"
          }}
        >
          <PiPrinterThin size={30} />
        </div>

        <div
          ref={drop}
          className="table-wrapper"
          style={{
            width: `${width}px`,
            height: "100px",
            position: "relative",
            backgroundColor: getBgColor(table.facilityStatusId),
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}
          onMouseDown={handleMouseDown}
          onClick={handleTableClick}
        >
          {renderChairs()}
          <div style={{ zIndex: 1 }}>{table.tableName}</div>
        </div>
      </div>





    </>

  );
};

export default Table;