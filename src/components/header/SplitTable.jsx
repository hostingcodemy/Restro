import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdOutlineCancel, MdOutlinePersonOutline, MdOutlineTableRestaurant } from "react-icons/md";
import { IoLayersOutline } from "react-icons/io5";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { PiMicrophoneThin } from "react-icons/pi";
import api from "../../config/AxiosInterceptor";

const ItemTypes = { TABLE: "table" };

const groupTablesBySection = (tables) => {
    return tables.reduce((acc, table) => {
        const section = table.sectionName || "Unassigned";
        if (!acc[section]) acc[section] = [];
        acc[section].push(table);
        return acc;
    }, {});
};

const SplitModal = ({ tableList, setIsSplitTable, facility, section,fetchTableData }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [droppedTable, setDroppedTable] = useState(null);
    const [splitCount, setSplitCount] = useState(2);
    const [splitTables, setSplitTables] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const outletId = localStorage.getItem("currentOutletId");
    const authChannelStr = localStorage.getItem("authChannels");
    const authChannels = JSON.parse(authChannelStr);
    console.log(splitTables);
    const userDetails = authChannels[0]?.adminDetails;
    const userId = userDetails?.userID || "";
    const groupedTables = groupTablesBySection(
        tableList.filter((t) => !droppedTable || t.tableId !== droppedTable.tableId)
    );

    const [, dropMergedRef] = useDrop({
        accept: ItemTypes.TABLE,
        drop: (item) => {
            if (!droppedTable) {
                setDroppedTable(item);
                setShowPopup(true);
            }
        },
    });

    const DraggableTable = ({ table }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: ItemTypes.TABLE,
            item: table,
            collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
        });

        const facilityColorMap = {};
        facility.forEach((f) => {
            facilityColorMap[f.facilityStatusId] = f.colour;
        });

        return (
            <div
                ref={dragRef}
                style={{
                    padding: "8px 12px",
                    background: facilityColorMap[table.facilityStatusId] || "black",
                    boxShadow: "4px 4px 4px #e0e0e0",
                    borderRadius: "4px",
                    cursor: "grab",
                    height: "5vh",
                    width: "fit-content",
                    opacity: isDragging ? 0.5 : 1,
                    color: "white",
                    fontWeight: "600",
                }}
            >
                {table.tableName}
            </div>
        );
    };

    const generateUniqueName = (index) => {
        let name;
        do {
            name = `${droppedTable?.tableName || "T"}${index + 1}`;
        } while (
            tableList.some((t) => t.tableName.toLowerCase() === name.toLowerCase()) ||
            splitTables.some((t) => t.name.toLowerCase() === name.toLowerCase())
        );
        return name;
    };

    const handleSplitConfirm = () => {

        const defaultSplit = Array.from({ length: splitCount }, (_, idx) => ({
            name: generateUniqueName(idx),
            pax: 1,
            sectionId: droppedTable.sectionId || "",
        }));

        setSplitTables(defaultSplit);
        setShowPopup(false);
    };

    const isNameUnique = (name, index) => {
        const trimmed = name.trim().toLowerCase();
        if (!trimmed) return false;
        if (tableList.some((t) => t.tableName.trim().toLowerCase() === trimmed)) return false;
        return !splitTables.some((t, i) => t.name.trim().toLowerCase() === trimmed && i !== index);
    };

    const handleChange = (index, field, value) => {
    setSplitTables((prev) => {
        const updated = [...prev];
        if (field === "name") {
            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
            updated[index][field] = capitalized;
            updated[index].error = !isNameUnique(capitalized, index);
        } else {
            updated[index][field] = value;
        }
        return updated;
    });
};


    const transformedPayload = splitTables.map((table) => ({
        splitTableNames: table.name,
        splittedPax: table.pax,
        sectionId: table.sectionId,
        customerId: null,
        orderTaker: userId,
        amount: 0,
        pax: 0,
        facilityStatusId: droppedTable.facilityStatusId,
        prefix: null,
        remarks: "",
        isActive: true,
    }));

    const handleSubmit = async () => {

        const invalid = splitTables.some((t) => !t.name.trim() || t.pax <= 0 || t.error);
        if (invalid) {
            toast.error("Please ensure all names are unique, filled and pax is greater than 0.");
            return;
        }

        const payload = {
            tableId: [droppedTable.tableId],
            sectionId: droppedTable.sectionId,
            customerId: null,
            outletId: outletId,
            name: droppedTable.tableName,
            orderTaker: userId,
            pax: droppedTable.pax,
            amount: 0,
            type: "split",
            splitCount: splitCount,
            splitTables: transformedPayload,
            remarks: "",
            isOpen: false,
            isActive: true,
            facilityStatusId: droppedTable.facilityStatusId
        }

        try {

            const post = await api.post("/tablelog", payload)

            if (post.data.isValid) {
                fetchTableData()
                toast.success(`${droppedTable.tableName} split successfully`);
                    setIsMergeTable(false);
            } else {
                toast.error(post.data.errorMessage)
            }

        } catch (error) {
            console.log(error);

        }

    };

    // console.log(groupedTables);

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
                    className="merge-modal-content w-90"
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                        animation: "slideInRight 0.5s ease-out",
                    }}
                >
                    <div className="d-flex align-items-center justify-content-between w-100 px-3 py-1">
                        <div className="fw-bold fs-4">Table Split</div>
                        <div className="d-flex align-items-center gap-4">
                            <div className="outletName fw-normal fs-5 text-warning">Frisky Bites</div>
                            <button
                                onClick={() => setIsSplitTable(false)}
                                style={{
                                    color: "red",
                                    top: 10,
                                    right: 10,
                                    fontSize: "1.5rem",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <MdOutlineCancel />
                            </button>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap" style={{ width: "72vw", height: "80vh", gap: "1rem" }}>
                        <div style={{ flex: 1, paddingRight: "1rem", overflowY: "auto", borderRight: "1px solid #ccc", width: "50%", paddingLeft: "0.5rem" }}>
                            <div className="floorSearch d-flex align-items-center gap-2 px-1 overflow-hidden mb-2"  >

                                <input
                                    type="text"
                                    placeholder="Search table..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                    style={{ width: "100%", padding: "0.5rem", border: "none", }}
                                />

                                <div className="TableSearch"><PiMicrophoneThin size={20} color="#ffc300" /></div>
                            </div>
                            {Object.keys(groupedTables).map((section) => (
                                <div key={section} style={{ marginBottom: "1rem" }}>
                                    <h5 className="mb-2"> {section}</h5>
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
                            style={{ flex: 1, padding: "1rem", background: "#f7f7f7", borderRadius: "8px", width: "50%", position: "relative" }}
                        >
                            <h5
                                className=""
                                style={{
                                    position: "absolute",
                                    top: "40%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    opacity: 0.2,
                                    fontSize: "3.5rem",
                                    color: "black",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    zIndex: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Drop Table Here
                            </h5>
                            <div style={{ height: "90%" }}>

                                {droppedTable && <div className="mb-3 fs-3">Split Table : <span className="text-warning fw-bold">{droppedTable.tableName}</span> </div>}

                                {splitTables.map((table, idx) => (
                                    <div key={idx} className="d-flex gap-2 mb-2">
                                        <InputGroup>
                                            <InputGroup.Text><MdOutlineTableRestaurant size={20} /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                value={table.name}
                                                onChange={(e) => handleChange(idx, "name", e.target.value)}
                                                isInvalid={table.error}
                                            />
                                        </InputGroup>

                                        <InputGroup>
                                            <InputGroup.Text><MdOutlinePersonOutline size={20} /></InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={table.pax}
                                                onChange={(e) => handleChange(idx, "pax", Number(e.target.value))}
                                                min="1"
                                            />
                                        </InputGroup>

                                        <InputGroup>
                                            <InputGroup.Text><IoLayersOutline size={20} /></InputGroup.Text>
                                            <Form.Select
                                                value={table.sectionId}
                                                onChange={(e) => handleChange(idx, "sectionId", e.target.value)}
                                            >
                                                <option value="">Select Section</option>
                                                {section.map((s) => (
                                                    <option key={s.sectionId} value={s.sectionId}>{s.floorName}</option>
                                                ))}
                                            </Form.Select>
                                        </InputGroup>
                                    </div>
                                ))}
                            </div>
                            {/* <h5 className="mb-3">Split Tables</h5> */}
                            <div>

                                {splitTables.length > 0 && (
                                    <div className="w-100 d-flex align-items-center justify-content-center ">

                                        <div
                                            onClick={handleSubmit}
                                            style={{
                                                padding: "0.6rem",
                                                backgroundColor: "#ffc300",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "6px",
                                                marginTop: "1rem",
                                                width: "50%",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Split
                                        </div>

                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "65%",
                            transform: "translate(-50%, -50%)",
                            background: "white",
                            padding: "2rem",
                            borderRadius: "8px",
                            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                            zIndex: 10000,
                        }}
                    >
                        <h5>How many tables do you want to split into?</h5>
                        <InputGroup style={{ margin: "1rem 0", padding: "0.5rem", width: "100%" }}>
                            <InputGroup.Text><MdOutlinePersonOutline size={20} /></InputGroup.Text>
                            <Form.Control
                                type="number"
                                value={splitCount}
                                onChange={(e) => setSplitCount(Number(e.target.value))}
                                min="2"

                            />
                        </InputGroup>

                        <div className="d-flex justify-content-center"><button
                            onClick={handleSplitConfirm}
                            style={{ backgroundColor: "#ffc300", border: "none", padding: "0.5rem 1rem", color: "white", borderRadius: "4px" }}
                        >
                            Confirm
                        </button></div>

                    </div>
                )}
            </div>
        </DndProvider>
    );
};

export default SplitModal;
