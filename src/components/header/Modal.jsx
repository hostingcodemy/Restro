import { useState } from "react";
// import 'src/index.css';


export default function OrderModal({ selectedTables, onClose, onSubmit }) {

  const [tablesInput, setTablesInput] = useState(selectedTables.join(", "));
  const [pax, setPax] = useState("");
  const [orderTaker, setOrderTaker] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    const tables = tablesInput
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter(Boolean);
    onSubmit({ tables, pax, orderTaker, remarks });
  };

   

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: 1000,
        paddingLeft: "25vw"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          width: "24rem",
        }}
      >

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
            Tables
          </label>
          <input
            type="text"
            value={tablesInput}
            onChange={(e) => setTablesInput(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
            Pax
          </label>
          <input
            type="text"
            value={pax}
            onChange={(e) => setPax(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
            Order Taker
          </label>
          <select
            value={orderTaker}
            onChange={(e) => setOrderTaker(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
            }}
          >
            <option value="">Select</option>
            <option value="John">John</option>
            <option value="Emily">Emily</option>
            <option value="Michael">Michael</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
            Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#9CA3AF",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6B7280")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#9CA3AF")}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#fafafa",
              color: "black",
              border: "none",
              borderRadius: "2rem",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16A34A")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#22C55E")}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
