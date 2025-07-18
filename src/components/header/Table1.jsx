import React, { useEffect, useRef, useState } from "react";
import { PiPrinterThin, PiUserCirclePlusLight } from "react-icons/pi";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { IoPersonCircleOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Chair from "./Chair";
import moment from "moment";

const ItemTypes = { TABLE: "table", CHAIR: "chair" };

const Table = ({ table, moveTable, onDropChair, dragEnabled, isAddChairMode, onAddChairs, facility }) => {
  const [runTime, setRunTime] = useState("");
  const [showChairModal, setShowChairModal] = useState(false);
  const [chairCount, setChairCount] = useState('');
  const [chairStates, setChairStates] = useState([]);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [isDiscount, setIsDiscount] = useState();

  const getStoredChairs = (tableId) => {
    const stored = localStorage.getItem("tableChairs");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed[tableId] || null;
  };

  const setStoredChairs = (tableId, data) => {
    const stored = JSON.parse(localStorage.getItem("tableChairs") || "{}");
    stored[tableId] = data;
    localStorage.setItem("tableChairs", JSON.stringify(stored));
  };

  useEffect(() => {
    const currentCapacity = table.capacity || 0;
    const tableId = table.tableId;
    const prefix = table.prefix;
    if (!tableId || !prefix) return;

    const storedChairs = JSON.parse(localStorage.getItem("tableChairs") || "{}");
    const stored = storedChairs[tableId];

    if (prefix === "V") {
      const virtualChairs = Array.from({ length: currentCapacity }, (_, i) => ({
        id: i + 1,
        isMarked: false
      }));
      setChairStates(virtualChairs);
      storedChairs[tableId] = {
        total: currentCapacity,
        markedCount: 0
      };
      localStorage.setItem("tableChairs", JSON.stringify(storedChairs));

    } else if (prefix === "O" || prefix === "U") {
      if (!stored) {
        const occupiedChairs = Array.from({ length: currentCapacity }, (_, i) => ({
          id: i + 1,
          isMarked: true
        }));
        setChairStates(occupiedChairs);
        storedChairs[tableId] = {
          total: currentCapacity,
          markedCount: currentCapacity
        };
        localStorage.setItem("tableChairs", JSON.stringify(storedChairs));

      } else if (currentCapacity > stored.total) {
        const updatedChairs = Array.from({ length: currentCapacity }, (_, i) => ({
          id: i + 1,
          isMarked: true
        }));
        setChairStates(updatedChairs);
        storedChairs[tableId] = {
          total: currentCapacity,
          markedCount: currentCapacity
        };
        localStorage.setItem("tableChairs", JSON.stringify(storedChairs));

      } else {
        const updatedChairs = Array.from({ length: stored.total }, (_, i) => ({
          id: i + 1,
          isMarked: i < currentCapacity
        }));
        setChairStates(updatedChairs);
      }
    }
  }, [table.tableId, table.capacity, table.prefix]);

  const handleTableClick = () => {
    if (isAddChairMode) {
      setShowChairModal(true);
    } else {
      localStorage.removeItem("cartItems");
      localStorage.setItem("currentTableId", table.tableId);
      localStorage.setItem("navigateTable", JSON.stringify(table));
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

  const baseWidth = 150;
  const extraWidthPerChair = 10;
  const width = chairStates.length > 4
    ? baseWidth + (chairStates.length * extraWidthPerChair)
    : baseWidth;

  const getBgColor = (status) => {
    return facilityColorMap[status] || "gray";
  };

  const facilityColorMap = {};
  facility?.forEach(f => {
    facilityColorMap[f?.facilityStatusId] = f?.colour;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const createdDate = table?.runningOrder?.[0]?.createdDate;
      if (createdDate) {
        const duration = moment.duration(moment().diff(moment(createdDate)));
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const formattedTime = hours > 0
          ? `${hours}h ${minutes}m ${seconds}s`
          : `${minutes}m ${seconds}s`;
        setRunTime(formattedTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [table?.runningOrder?.[0]?.createdDate]);

  const renderChairs = () => {
    const chairs = chairStates;
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
            isMarked={chair.isMarked}
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
      moveTable(table?.tableId, origX + dx, origY + dy);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {showChairModal && (
        <div className="chair-modal-overlay">
          <div className="chair-modal-content animate-scale-in">
            <div className="modal-input-group">
              <div className="step-btn" onClick={() =>
                setChairCount((prev) => String(Number(prev || 0) - 1))
              }>−</div>
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
              <div className="step-btn" onClick={() =>
                setChairCount((prev) => String(Number(prev || 0) + 1))
              }>+</div>
            </div>
            <div className="modal-actions">
              <div className="modal-btn cancel" onClick={() => setShowChairModal(false)}>Cancel</div>
              <div className="modal-btn confirm" onClick={() => {
                const count = parseInt(chairCount);
                if (!isNaN(count) && count !== 0) {
                  onAddChairs(table.tableId, count);
                  setChairCount('');
                  setShowChairModal(false);
                }
              }}>Add</div>
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
        <div style={{
          position: "absolute",
          top: "50%",
          left: "-12px",
          transform: "translateY(-50%)",
          borderRadius: "50%",
        }}>
          <PiUserCirclePlusLight size={30} />
        </div>

        <div style={{
          position: "absolute",
          top: "50%",
          right: "-8px",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          padding: "2px",
          zIndex: "999"
        }}>
          <PiPrinterThin size={30} />
        </div>

        {isDiscount && (
          <div style={{
            position: "absolute",
            top: "-2%",
            right: "-10px",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            padding: "2px",
            zIndex: "999"
          }}>
            <TbRosetteDiscountCheckFilled className="text-warning" size={30} />
          </div>
        )}

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
            color: "white",
            cursor: "pointer"
          }}
          onMouseDown={handleMouseDown}
          onClick={handleTableClick}
        >
          {renderChairs()}
          <div style={{ zIndex: 1 }} className="d-flex flex-column align-items-center">
            {table.tableName}
            {table?.runningOrder?.[0] && (
              <div style={{ fontSize: "12px", marginTop: "4px" }} className="d-flex flex-column align-items-center w-100">
                <div className="d-flex align-items-center justify-content-center">
                  <div style={{ borderRight: "0.01rem solid white" }} className="px-2"> ₹{table?.amount}</div>
                  <div style={{ borderRight: "0.01rem solid white" }} className="px-2"> ₹{table?.withTaxAmount?.toFixed(2)}</div>
                  <div className="px-2 d-flex align-items-center gap-1"><IoPersonCircleOutline /> {table?.capacity}</div>
                </div>
                <div className="mt-1 d-flex align-items-center gap-1">
                  <BsClockHistory />
                  {runTime}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
