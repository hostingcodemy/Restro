import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  TABLE: "table",
};

const groupTablesBySection = (tables) => {
  return tables.reduce((acc, table) => {
    const section = table.section || "Unassigned";
    if (!acc[section]) acc[section] = [];
    acc[section].push(table);
    return acc;
  }, {});
};

const getColorByStatus = (status) => {
  switch (status) {
    case "V": return "#d4edda";
    case "H": return "#fff3cd";
    case "B": return "#f8d7da";
    case "M": return "#d1ecf1";
    default: return "#e2e3e5";
  }
};

const MergeModal = ({ tableList, setIsMergeTable }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [droppedTables, setDroppedTables] = useState([]);
  const [mergeName, setMergeName] = useState("");
  const [mergePax, setMergePax] = useState(0);
  const [nameError, setNameError] = useState("");

  const groupedTables = groupTablesBySection(
    tableList.filter((t) => !droppedTables.find((dt) => dt.tableId === t.tableId))
  );

  const [{}, dropAvailableRef] = useDrop({
    accept: ItemTypes.TABLE,
    drop: (item) => {
      if (item.from === "dropped") {
        setDroppedTables((prev) => prev.filter((t) => t.tableId !== item.tableId));
      }
    },
  });

  const [{}, dropMergedRef] = useDrop({
    accept: ItemTypes.TABLE,
    drop: (item) => {
      if (item.from === "available") {
        setDroppedTables((prev) =>
          prev.some((t) => t.tableId === item.tableId) ? prev : [...prev, item]
        );
      }
    },
  });

  const validateName = (name) => {
    const exists = tableList.some(
      (table) =>
        !droppedTables.find((dropped) => dropped.tableId === table.tableId) &&
        table.tableName.toLowerCase() === name.toLowerCase()
    );
    setNameError(exists ? "Table name already exists." : "");
  };

  useEffect(() => {
    const defaultName = droppedTables.map((t) => t.tableName).join("");
    const defaultPax = droppedTables.reduce((sum, t) => sum + (t.capacity || 0), 0);
    setMergeName(defaultName);
    setMergePax(defaultPax);
    setNameError("");
  }, [droppedTables]);

  const DraggableTable = ({ table }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: ItemTypes.TABLE,
      item: table,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    });

    return (
      <div
        ref={dragRef}
        style={{
          padding: "8px 12px",
          background: getColorByStatus(table.tableStatus),
          border: "1px solid #aaa",
          borderRadius: "4px",
          cursor: "grab",
          height:"5vh",
          width:"fit-content",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {table.tableName}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "1000px",
            height: "80vh",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            position: "relative",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          <button
            onClick={()=>setIsMergeTable(false)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: "1.5rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          <div
            ref={dropAvailableRef}
            style={{ width: "50%", paddingRight: "1rem", overflowY: "auto", borderRight: "1px solid #ccc" }}
          >
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
            />
            {Object.keys(groupedTables).map((section) => (
              <div key={section} style={{ marginBottom: "1rem" }}>
                <h5>{section}</h5>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {groupedTables[section]
                    .filter((t) => t.tableName.toLowerCase().includes(searchTerm))
                    .map((table) => (
                      <DraggableTable key={table.tableId} table={{ ...table, from: "available" }} />
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div
            ref={dropMergedRef}
            style={{ width: "50%", padding: "1rem", background: "#f7f7f7", borderRadius: "8px" }}
          >
            <h5>Dropped Tables</h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem",height:"80%" }}>
              {droppedTables.map((table) => (
                <DraggableTable key={table.tableId} table={{ ...table, from: "dropped" }} />
              ))}
            </div>

            {droppedTables.length > 0 && (
              <div style={{ display:"flex",alignItems:"center",
                gap:"1vw",height:"20%"
               }}>
                <label>
                  Table Name:
                  <input
                    type="text"
                    value={mergeName}
                    onChange={(e) => {
                      setMergeName(e.target.value);
                      validateName(e.target.value);
                    }}
                    style={{ width: "100%", padding: "0.5rem" }}
                  />
                </label>
                {nameError && <div style={{ color: "red" }}>{nameError}</div>}

                <label>
                  Pax:
                  <input
                    type="number"
                    value={mergePax}
                    onChange={(e) => setMergePax(Number(e.target.value))}
                    style={{ width: "100%", padding: "0.5rem" }}
                  />
                </label>

                <div
                  disabled={!!nameError}
                  style={{
                    padding: "0.6rem",
                    backgroundColor: nameError ? "#ccc" : "#ffc300",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    marginTop:"1.5vw",
                    cursor: nameError ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    alert(`Merged: ${mergeName} | Pax: ${mergePax}`);
                  }}
                >
                  Merge
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MergeModal;
