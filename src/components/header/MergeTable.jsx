import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MdOutlineCancel } from "react-icons/md";
import api from "../../config/AxiosInterceptor";
import { CiSearch } from "react-icons/ci";
import InputGroup from 'react-bootstrap/InputGroup';
import { MdOutlineMailOutline, MdOutlineLockPerson } from "react-icons/md";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { IoLayersOutline } from "react-icons/io5";
import Form from 'react-bootstrap/Form';
import { PiMicrophoneThin } from "react-icons/pi";
import { toast, ToastContainer } from 'react-toastify';
const ItemTypes = {
    TABLE: "table",
};

const groupTablesBySection = (tables) => {
    return tables.reduce((acc, table) => {
        const section = table.sectionName || "Unassigned";
        if (!acc[section]) acc[section] = [];
        acc[section].push(table);
        return acc;
    }, {});
};

const MergeModal = ({ tableList, setIsMergeTable, facility, section, fetchTableData }) => {

    const [outletName, setOutletName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [droppedTables, setDroppedTables] = useState([]);
    const [mergeName, setMergeName] = useState("");
    const [mergePax, setMergePax] = useState(0);
    const [nameError, setNameError] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const outletId = localStorage.getItem("currentOutletId");
    const authChannelStr = localStorage.getItem("authChannels");
    const authChannels = JSON.parse(authChannelStr);

    const userDetails = authChannels[0]?.adminDetails;

    const groupedTables = groupTablesBySection(
        tableList.filter((t) => !droppedTables.find((dt) => dt.tableId === t.tableId))
    );

    const [, dropAvailableRef] = useDrop({
        accept: ItemTypes.TABLE,
        drop: (item) => {
            if (item.from === "dropped") {
                setDroppedTables((prev) => prev.filter((t) => t.tableId !== item.tableId));
            }
        },
    });

    const [, dropMergedRef] = useDrop({
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

    const postData = async () => {

        const userId = userDetails?.userID || "";

        const payload = {
            tableId: droppedTables.map(t => t.tableId),
            sectionId: selectedSection,
            outletId: outletId,
            name: mergeName,
            orderTaker: userId,
            pax: mergePax,
            amount: 0,
            customerId: null,
            type: "merge",
            splitCount: 0,
            splitTables: [],
            remarks: "",
            prefix: "V",
            isOpen: false,
            isActive: true,
            facilityStatusId: "04b8cfcc-e606-44c2-9300-b3b4cab97955"
        }

        try {

            const post = await api.post("/tablelog", payload)

            if (post.data.isValid) {
                fetchTableData()
                toast.success(`${mergeName} merge successfully`);

                setIsMergeTable(false);

            } else {
                toast.error(post.data.errorMessage)
            }

        } catch (error) {
            console.log(error);

        }
    };

    const DraggableTable = ({ table }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: ItemTypes.TABLE,
            item: table,
            collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
        });

        const facilityColorMap = {};
        facility.forEach(facility => {
            facilityColorMap[facility.facilityStatusId] = facility.colour;
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

    return (
        <>

            <ToastContainer />
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
                            <div className="fw-bold fs-4">Table Merge</div>
                            <div className="d-flex align-items-center gap-4">
                                <div className="outletName fw-normal fs-5 text-warning">Frisky Bites</div>
                                <button
                                    onClick={() => setIsMergeTable(false)}
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

                        <div className="d-flex flex-wrap w-100" style={{ width: "72vw", height: "80vh", gap: "1rem" }}>
                            <div
                                ref={dropAvailableRef}
                                style={{ flex: 1, paddingRight: "1rem", overflowY: "auto", borderRight: "1px solid #ccc" }}
                            >
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
                                        <h5 className="mb-2">{section}</h5>
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
                                style={{ flex: 1, padding: "1rem", background: "#f7f7f7", borderRadius: "8px", position: "relative", }}
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
                                    Drop Tables Here
                                </h5>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", height: "80%" }}>
                                    {droppedTables.map((table) => (
                                        <DraggableTable key={table.tableId} table={{ ...table, from: "dropped" }} />
                                    ))}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        height: "20%",
                                        alignItems: "center"
                                    }}
                                >
                                    <div className="d-flex flex-wrap gap-3">

                                        <div style={{ flex: 2 }}>
                                            <InputGroup className="">
                                                <InputGroup.Text id="employeeTypeId">
                                                    <IoLayersOutline size={25} color="#ffc800" />
                                                </InputGroup.Text>
                                                <Form.Select
                                                    value={selectedSection}
                                                    onChange={(e) => setSelectedSection(e.target.value)}
                                                    required

                                                >
                                                    <option value="">Select Section</option>
                                                    {section?.map((s) => (
                                                        <option key={s.sectionId} value={s.sectionId}>
                                                            {s.floorName}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                            </InputGroup>

                                        </div>

                                        <div style={{ flex: 2 }}>
                                            <InputGroup hasValidation className="">
                                                <InputGroup.Text>
                                                    <MdOutlineTableRestaurant size={25} color='#ffc800' />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"

                                                    value={mergeName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                                                        setMergeName(capitalized);
                                                        validateName(capitalized);
                                                    }}
                                                    className={`custom-input ${nameError ? 'input-error' : ''}`}
                                                    autoComplete="off"
                                                    placeholder="Table Name"
                                                    isInvalid={!!nameError}


                                                />
                                            </InputGroup>

                                            {nameError && <div style={{ color: "red" }}>{nameError}</div>}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <InputGroup hasValidation className="">
                                                <InputGroup.Text>
                                                    <MdOutlinePersonOutline size={25} color='#ffc800' />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="number"

                                                    value={mergePax}
                                                    onChange={(e) => setMergePax(Number(e.target.value))}
                                                    className={`custom-input`}
                                                    autoComplete="off"
                                                    placeholder="Table Name"


                                                />
                                            </InputGroup>

                                        </div>


                                    </div>

                                    <div
                                        onClick={() => {
                                            if (droppedTables.length > 1 && !nameError) {
                                                postData();
                                            } else {
                                                toast.error("Please select more than one table.");
                                            }
                                        }}
                                        style={{
                                            padding: "0.6rem",
                                            backgroundColor: "#ffc300",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "6px",
                                            marginTop: "1rem",
                                            width: "50%",
                                            textAlign: "center",
                                            cursor: "pointer"
                                            // cursor: droppedTables.length > 1 && !nameError ? "pointer" : "not-allowed"
                                        }}
                                    >
                                        Merge
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </DndProvider>

        </>
    );
};

export default MergeModal;
