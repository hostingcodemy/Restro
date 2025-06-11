import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { VscMerge } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import OrderModal from "./Modal";
import Table1 from "./Table1";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import api from "../../config/AxiosInterceptor";
import Form from 'react-bootstrap/Form';
import { FaPlus } from "react-icons/fa";
import { PiHandshakeThin } from "react-icons/pi";
import { LiaWindowCloseSolid } from "react-icons/lia";
import { PiMicrophoneThin } from "react-icons/pi";
import { Spinner } from 'react-bootstrap';
import { FaChair, FaUser, FaComments } from "react-icons/fa";
import { MdOutlineTableRestaurant } from "react-icons/md"
import { CiSaveDown2 } from "react-icons/ci";
import { RxReset } from "react-icons/rx";
import { IoLayersOutline } from "react-icons/io5";
import "src/scss/style.scss";
import MergeModal from "./MergeTable";

const TableBook = () => {

    const [isAddChairMode, setIsAddChairMode] = useState(false);
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("table");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectionMode, setSelectionMode] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showAddTableModal, setShowAddTableModal] = useState(false);
    const labels = ["Table Layout", "Floor Base", "Privilege Base"];
    const [labelIndex, setLabelIndex] = useState(0);
    const [selectedTables, setSelectedTables] = useState([]);
    const [isToggled, setIsToggled] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tableName: "",
        pax: "",
        orderTaker: "",
        section: "",
        remarks: ""
    });
    const velocity = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const [isSelfMode, setIsSelfMode] = useState(false);
    const [tablePositions, setTablePositions] = useState({});
    const [layoutPos, setLayoutPos] = useState({ x: 0, y: 0 });
    const [isDraggingLayout, setIsDraggingLayout] = useState(false);
    const animationRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const fetchCalled = useRef(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dragEnabled, setDragEnabled] = useState(false);
    const [customizationMode, setCustomizationMode] = useState(null);
    const [section, setSection] = useState([]);
    const [facility, setFacility] = useState([]);
    const [selectedSection, setSelectedSection] = useState("all");



    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    useEffect(() => {

        fetchTableData();

    }, []);

    useEffect(() => {

        fetchSectionData();

    }, [])

    useEffect(() => {

        fetchFacilityData();

    }, [])



    const handleSelect = (prefix) => {
        setSelectedStatusId(prevPrefix => (prevPrefix === prefix ? null : prefix));
    };

    const fetchTableData = async () => {
        try {
            const response = await api.get("/tables");
            const fetchedTables = response.data.list;

            const transformed = fetchedTables.map((t, index) => ({
                ...t,
                position: {
                    x: 100 + (index % 5) * 200,
                    y: 100 + Math.floor(index / 5) * 200
                },
                chairs: Array.from({ length: t.capacity }, (_, i) => ({
                    id: `${t.tableId}-chair-${i + 1}`
                }))
            }));

            setTableData(transformed);
            localStorage.setItem("tableLayout", JSON.stringify(transformed));
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchSectionData = async () => {

        try {

            const response = await api.get("/section");

            setSection(response.data.list);

        } catch (error) {
            console.log(error);
        }

    };

    const fetchFacilityData = async () => {

        try {

            const response = await api.get("/facilitystatus/table");

            setFacility(response.data.list);

        } catch (error) {
            console.log(error);
        }

    };


    const moveTable = (tableId, x, y) => {

        const updated = tableData.map((table) =>
            table.tableId === tableId ? { ...table, position: { x, y } } : table
        );
        setTableData(updated);
        localStorage.setItem("tableLayout", JSON.stringify(updated));

    };



    const onDropChair = (chair, fromId, toId) => {
        setTableData((prev) =>
            prev.map((t) => {
                if (t.tableId === fromId) {
                    return { ...t, chairs: t.chairs.filter((c) => c.id !== chair.id) };
                } else if (t.tableId === toId) {
                    return { ...t, chairs: [...t.chairs, chair] };
                }
                return t;
            })
        );
    };

    const resetLayout = () => {
        localStorage.removeItem("tableLayout");
        fetchTableData();
        setLayoutPos({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (isSelfMode) return;
        setIsDraggingLayout(true);
        startPos.current = { x: e.clientX - layoutPos.x, y: e.clientY - layoutPos.y };
        cancelAnimationFrame(animationRef.current);
    };

    const handleMouseMove = (e) => {
        if (!isDraggingLayout) return;
        const newX = e.clientX - startPos.current.x;
        const newY = e.clientY - startPos.current.y;

        velocity.current = {
            x: newX - layoutPos.x,
            y: newY - layoutPos.y,
        };

        setLayoutPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDraggingLayout(false);
        animateMomentum();
    };

    const handleTableClick = (table) => {

        if (isSelfMode) return;

        if (selectionMode) {
            setSelectedTables((prev) =>
                prev.includes(table.tableName)
                    ? prev.filter((id) => id !== table.tableName)
                    : [...prev, table.tableName]
            );
        }

        else {
            navigate("/pointofsale", { state: { tableData: [table.tableName] } });
        }
    };

    const handleClick = () => {
        setLabelIndex((prevIndex) => (prevIndex + 1) % labels.length);
    };


    const animateMomentum = () => {
        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;

        setLayoutPos((prev) => {
            const next = { x: prev.x + velocity.current.x, y: prev.y + velocity.current.y };
            localStorage.setItem("smartLayoutPosition", JSON.stringify(next));
            return next;
        });

        if (Math.abs(velocity.current.x) > 0.5 || Math.abs(velocity.current.y) > 0.5) {
            animationRef.current = requestAnimationFrame(animateMomentum);
        }
    };


    const toggleSelfMode = () => {
        setIsSelfMode((prev) => {
            const next = !prev;
            if (!next) {
                setCustomizationMode(null);
            }
            return next;
        });
        setDragEnabled(!dragEnabled);
        setIsAddChairMode((prev) => !prev);

    };


    const handlePlaceOrder = (data) => {
        setShowOrderModal(false);
        navigate("/pointofsale", {
            state: {
                tableData: data.tables,
                orderTaker: data.orderTaker,
                remarks: data.remarks,
            },
        });
    };


    const handleAddChairs = (tableId, count) => {
        setTableData(prevData =>
            prevData.map(table => {
                if (table.tableId === tableId) {
                    let updatedChairs = [...table.chairs];
                    if (count > 0) {

                        const newChairs = Array.from({ length: count }, (_, i) => ({
                            id: `${tableId}-chair-${Date.now()}-${i}`
                        }));
                        updatedChairs.push(...newChairs);
                    } else {

                        updatedChairs = updatedChairs.slice(0, updatedChairs.length + count);
                    }

                    return { ...table, chairs: updatedChairs };
                }
                return table;
            })
        );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedSection('all');
        setSelectedStatusId(null);
    }

    const [isMergeTable, setIsMergeTable] = useState(false);



    return (
        <DndProvider backend={HTML5Backend}>

            <div className='tableBook d-flex align-items-center justify-content-between'>

                {isMergeTable && <MergeModal tableList={tableData} setIsMergeTable={setIsMergeTable}/>}

                <div className="tableBookRight">
                    <div className="rightTop">
                        <div className='topHeader px-2 w-100 d-flex align-items-center justify-content-end gap-4'>
                            <div className="d-flex align-items-center justify-content-end w-100 gap-3">

                                <div onClick={() => setIsMergeTable(true)}>merge</div>
                                <div>
                                    <div className="transfer-toggle-container">
                                        <div className="transfer-toggle">
                                            <div className={`slider ${selected}`}></div>

                                            <button
                                                className={`toggle-option ${selected === "table" ? "active" : ""}`}
                                                onClick={() => setSelected("table")}
                                            >
                                                Table Transfer
                                            </button>

                                            <button
                                                className={`toggle-option ${selected === "item" ? "active" : ""}`}
                                                onClick={() => setSelected("item")}
                                            >
                                                Item Transfer
                                            </button>
                                        </div>
                                    </div>
                                </div>



                                <div className="d-flex align-items-center gap-3">
                                    {!isToggled && <span style={{ cursor: "pointer" }} className={`fw-semibold cursor-pointer ${customizationMode === "chair" ? "primaryColor" : ""}`} onClick={() => {
                                        toggleSelfMode
                                        setCustomizationMode((prev) => prev === "chair" ? "" : "chair")
                                    }}>Chair</span>}

                                    <button
                                        className="btn position-relative toggle-button px-4"
                                        onClick={() => {
                                            if (!isToggled) {
                                                setShowAddTableModal(true);
                                                setIsOpen(true);
                                            }
                                            setIsToggled(!isToggled);
                                            setCustomizationMode("");
                                        }}
                                    >
                                        <div className={`toggle-circle ${isToggled ? "right" : "left"}`}>
                                            <FaPlus color="#ffc300" />
                                        </div>
                                    </button>

                                    {isToggled && <span className="fw-semibold primaryColor">Table</span>}
                                </div>


                                <div className="tableHeaderButton">
                                    <PiHandshakeThin size={14} /> Multi Table Settlement
                                </div>
                                <div className="tableHeaderButton">
                                    <VscMerge size={14} /> Multi Table Bill
                                </div>
                                <div className="tableHeaderButton">
                                    <CiSaveDown2 size={14} /> Save Layout
                                </div>


                            </div>

                            <div className='d-flex align-items-center gap-3'>


                                <div
                                    className="sidebar-trigger"
                                    onClick={() => {
                                        setShowAddTableModal(false);
                                        setIsOpen(true)
                                    }
                                    }
                                >
                                    <HiDotsVertical className="text-black" />
                                </div>


                                {isOpen && (
                                    <div
                                        className="sidebar-overlay"
                                        onClick={() => setIsOpen(false)}
                                    />
                                )}

                                <div className={`sidebar-panel ${isOpen ? "open" : ""}`}>
                                    <div className="sidebar-header">
                                        <h5>{showAddTableModal ? "ADD TABLE INFO" : "ACTIONS"}</h5>
                                        <LiaWindowCloseSolid className="close-btn" onClick={() => {
                                            if (showAddTableModal) {
                                                setIsToggled(!isToggled);
                                            }
                                            setCustomizationMode("");
                                            setIsOpen(false)
                                        }} />

                                    </div>
                                    <div className="sidebar-content">
                                        {showAddTableModal && (

                                            <>
                                                <h5 className="mb-4 text-center"></h5>

                                                <div className="mb-3">
                                                    <label className="form-label">Table Name</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><MdOutlineTableRestaurant /></span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter your Table Name Like t3 t4"
                                                            value={formData.tableName}
                                                            onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Pax</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><FaChair /></span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="1234"
                                                            value={formData.pax}
                                                            onChange={(e) => setFormData({ ...formData, pax: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Order Taker</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><FaUser /></span>
                                                        <select
                                                            className="form-select"
                                                            value={formData.orderTaker}
                                                            onChange={(e) => setFormData({ ...formData, orderTaker: e.target.value })}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="John">John</option>
                                                            <option value="Emily">Emily</option>
                                                            <option value="Alex">Alex</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Section</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><IoLayersOutline /></span>
                                                        <select
                                                            className="form-select"
                                                            value={formData.section}
                                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                                        >
                                                            {section.map(section => (
                                                                <option key={section.sectionId} value={section.sectionId}>
                                                                    {section.floorName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Remarks</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><FaComments /></span>
                                                        <textarea
                                                            className="form-control"
                                                            rows="2"
                                                            value={formData.remarks}
                                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-center gap-2">
                                                    <button className="btn btn-outline-secondary" onClick={() => {
                                                        setShowAddTableModal(false);
                                                        setIsToggled(false);
                                                    }}>Cancel</button>
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => {
                                                            console.log("Submitted:", formData);
                                                            setShowAddTableModal(false);
                                                            setFormData({ tableName: "", pax: "", orderTaker: "", remarks: "" });
                                                        }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>



                                            </>


                                        )}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="rightMBtm">
                        <div className="rightBtmTop shadow-sm">
                            <div className=" d-flex justify-content-between gap-3 align-items-center">
                                <div className="d-flex align-items-center gap-1">
                                    <div className="floorSearch">
                                        <div className="TableSearch"><CiSearch size={20} /></div>
                                        <input
                                            style={{ border: "none", outline: "none", marginRight: "1vw" }}
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                            placeholder='Search...'
                                        />
                                    </div>
                                    <div className="TableSearch"><PiMicrophoneThin size={20} color="#ffc300" /></div>
                                </div>
                                <div>
                                    <select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        className="border-0"
                                    >
                                        <option value="all">All Floors</option>
                                        {section?.map(section => (
                                            <option key={section.sectionId} value={section.floorName}>
                                                {section.floorName}
                                            </option>
                                        ))}
                                    </select>

                                </div>


                                <div className="">
                                    <select className="border-0">
                                        <option> Select</option>
                                        <option value="openTable">Open Table</option>
                                        <option value="vipTable">VIP Table</option>
                                    </select>
                                </div>

                                <div className="d-flex overflow-auto gap-3 py-2 px-1">
                                    {facility?.map((status) => {
                                        const isSelected = selectedStatusId === status.prefix;
                                        return (
                                            <div
                                                key={status.facilityStatusId}
                                                className="d-flex gap-2 align-items-center text-center"
                                                style={{
                                                    cursor: "pointer",
                                                    minWidth: "50px",
                                                    padding: "0.2rem 0.5rem",
                                                    borderRadius: "1rem",
                                                    backgroundColor: isSelected ? `${status.colour}20` : "transparent",
                                                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                                                    boxShadow: isSelected
                                                        ? "0 4px 12px rgba(0, 0, 0, 0.12)"
                                                        : "none",
                                                    transition: "all 0.25s ease-in-out",
                                                }}
                                                onClick={() => handleSelect(status.prefix)}
                                            >
                                                <div
                                                    style={{
                                                        borderRadius: "100%",
                                                        padding: "0.15rem 0.45rem",
                                                        backgroundColor: status.colour,
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.65rem",
                                                        textTransform: "uppercase",
                                                        transition: "all 0.25s ease",
                                                    }}
                                                >
                                                    {status.facilityStatus.charAt(0)}
                                                </div>
                                                <div
                                                    className="text-uppercase"
                                                    style={{
                                                        fontSize: "0.95rem",
                                                        fontWeight: "bold",
                                                        color: isSelected ? status.colour : "#000",
                                                        transition: "color 0.25s ease",
                                                    }}
                                                >
                                                    {status.facilityStatus}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>




                                <div className="tableHeaderButton" onClick={handleResetFilters}>
                                    <RxReset size={14} /> Reset Filters
                                </div>

                            </div>


                        </div>

                        <div className="rightBtmBTm">


                            <div
                                className="p-3"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "2rem",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",

                                }}
                            >

                                {loading ? (
                                    <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
                                        <Spinner animation="grow" variant="secondary" size="sm" />
                                        <Spinner animation="grow" variant="warning" />
                                        <Spinner animation="grow" variant="secondary" size="sm" />
                                        <Spinner animation="grow" variant="warning" />
                                    </div>
                                ) : (
                                    Object.entries(
                                        tableData
                                            .filter((table) => {
                                                const sectionMatch =
                                                    selectedSection === "" ||
                                                    selectedSection === "all" ||
                                                    table.section.toLowerCase() === selectedSection.toLowerCase();

                                                const search = searchTerm.trim();
                                                const searchMatch =
                                                    table.tableName.toLowerCase().includes(search) ||
                                                    table.direction.toLowerCase().includes(search) ||
                                                    table.capacity.toString().includes(search);

                                                const statusMatch = !selectedStatusId || table.tableStatus === selectedStatusId;

                                                return sectionMatch && statusMatch && searchMatch;
                                            })
                                            .reduce((acc, table) => {
                                                const section = table.section || "Unknown Section";
                                                if (!acc[section]) {
                                                    acc[section] = [];
                                                }
                                                acc[section].push(table);
                                                return acc;
                                            }, {})
                                    ).map(([sectionName, tables]) => (
                                        <div key={sectionName} className="w-100">
                                            <div
                                                className="px-3 py-2 d-flex align-items-center justify-content-start gap-3 w-100"
                                                style={{ borderBottom: '0.01rem solid rgb(217, 217, 217)' }}
                                            >
                                                <h5 className="fw-semibold text-dark mb-0">{sectionName}</h5>
                                                <span className="badge bg-secondary">{tables.length} Tables</span>
                                            </div>

                                            <div
                                                className="d-flex flex-wrap mt-4"
                                                style={{ gap: "2rem", alignItems: "flex-start", justifyContent: "flex-start" }}
                                            >
                                                {tables.map((table) => (
                                                    <Table1
                                                        key={table.tableId}
                                                        facility={facility}
                                                        table={table}
                                                        moveTable={moveTable}
                                                        onDropChair={onDropChair}
                                                        dragEnabled={isSelfMode && customizationMode === "table"}
                                                        isAddChairMode={customizationMode === "chair"}
                                                        onAddChairs={handleAddChairs}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}



                            </div>

                            {showOrderModal && (
                                <OrderModal
                                    mode="order"
                                    selectedTables={selectedTables}
                                    onClose={() => setShowOrderModal(false)}
                                    onSubmit={handlePlaceOrder}

                                />
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default TableBook;
