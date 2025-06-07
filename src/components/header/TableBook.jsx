import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { VscMerge } from "react-icons/vsc";
import { PiPlus } from "react-icons/pi";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import OrderModal from "./Modal";
import Table1 from "./Table1";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GiTable } from "react-icons/gi";
import { PiChairThin } from "react-icons/pi";
import { RiArrowDownSFill } from "react-icons/ri";
import { PiLayoutThin } from "react-icons/pi";
import api from "../../config/AxiosInterceptor";
import Form from 'react-bootstrap/Form';
import { FaPlus } from "react-icons/fa";
import { PiHandshakeThin } from "react-icons/pi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { LiaWindowCloseSolid } from "react-icons/lia";
import { PiMicrophoneThin } from "react-icons/pi";
import { Spinner } from 'react-bootstrap';
import { FaChair, FaUser, FaComments, FaHashtag } from "react-icons/fa";
import { MdOutlineTableRestaurant } from "react-icons/md"

const TableBook = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

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
    const link = ["Billing Queue", "Tables", "Order History", "Create Multiple Table"];
    const floor = ["First Floor", "Second Floor", "Rooftop", "Garden"];
    const fetchCalled = useRef(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dragEnabled, setDragEnabled] = useState(false);
    const [customizationMode, setCustomizationMode] = useState(null);

    // const openPanel = () => {
    //     setShowPanel(true);
    //     setIsClosing(false);
    // };

    // const closePanel = () => {
    //     setIsClosing(true);
    //     setTimeout(() => {
    //         setShowPanel(false);
    //         setIsClosing(false);
    //     }, 300);
    // };


    useEffect(() => {
        const savedTablePos = JSON.parse(localStorage.getItem("smartTablePositions")) || {};
        const savedLayout = JSON.parse(localStorage.getItem("smartLayoutPosition")) || { x: 0, y: 0 };
        setTablePositions(savedTablePos);
        setLayoutPos(savedLayout);
    }, []);



    useEffect(() => {
        
            fetchTableData();
       
    }, []);



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


    const handleClick = () => {
        setLabelIndex((prevIndex) => (prevIndex + 1) % labels.length);
    };


    const [isAddChairMode, setIsAddChairMode] = useState(false);



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



    return (
        <DndProvider backend={HTML5Backend}>
            {showAddTableModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 1050 }}
                >
                    <div className="bg-white rounded p-4 shadow-lg animate__animated animate__fadeIn"
                        style={{ width: "100%", maxWidth: "400px" }}>
                        <h5 className="mb-4 text-center">Add Table Info</h5>

                        <div className="mb-3">
                            <label className="form-label">Table Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><MdOutlineTableRestaurant /></span>
                                <input
                                    type="text"
                                    className="form-control"
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

                        <div className="d-flex justify-content-end gap-2">
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
                    </div>
                </div>
            )}


            <div className='tableBook d-flex align-items-center justify-content-between'>


                <div className="tableBookRight">
                    <div className="rightTop">
                        <div className='topHeader px-2 w-100 d-flex align-items-center justify-content-end gap-4'>
                            <div className="d-flex align-items-center justify-content-end w-100 gap-3">

                                <div className="tableHeaderButton">
                                    <MdOutlineSwitchAccount size={14} /> Map Customer
                                </div>


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
                                
                                {/* <div>
                                    <div className="transfer-toggle-container">
                                        <div className="transfer-toggle">
                                            <div className={`slider ${selected}`}></div>

                                            <button
                                                className={`toggle-option ${selected === "table" ? "active" : ""}`}
                                                onClick={() => setSelected("table")}
                                            >
                                                Manage Table
                                            </button>

                                            <button
                                                className={`toggle-option ${selected === "item" ? "active" : ""}`}
                                                onClick={() => setSelected("item")}
                                            >
                                                Manage Chair
                                            </button>
                                        </div>
                                    </div>
                                </div> */}

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

                                {/* <div
                                    onClick={toggleSelfMode}
                                    style={{ backgroundColor: `${isSelfMode ? "#ff8000" : ""}`, color: `${isSelfMode ? "#fff" : ""}` }}
                                    className="tableHeaderButton  ">
                                    <span><PiLayoutThin /></span><span> {isSelfMode ? "Exit Self" : "Self"}</span>
                                </div>
                                {isSelfMode && (
                                    <div className="toggleContainer ">
                                        <div
                                            className="toggle-wrapper mt-2"
                                            onClick={() =>
                                                setCustomizationMode((prev) =>
                                                    prev === "table" ? "chair" : "table"
                                                )
                                            }
                                        >
                                            <div
                                                className="toggle-slider"
                                                style={{ left: customizationMode === "chair" ? "50%" : "0%" }}
                                            ></div>
                                            <div
                                                className={`toggle-option ${customizationMode === "table" ? "active" : ""
                                                    }`}
                                            >
                                                Table
                                            </div>
                                            <div
                                                className={`toggle-option ${customizationMode === "chair" ? "active" : ""
                                                    }`}
                                            >
                                                Chair
                                            </div>
                                        </div>

                                    </div>
                                )} */}
                                <div className="tableHeaderButton">
                                    <VscMerge size={14} />Table Merge
                                </div>
                                <div className="tableHeaderButton">
                                    <VscMerge size={14} />Table Split
                                </div>
                                <div className="tableHeaderButton">
                                    <select className="border-0">
                                        <option> Sequentially</option>
                                        <option value="1">User Customised</option>
                                        <option value="2">Status Based</option>
                                        <option value="3">Open Table</option>
                                        <option value="3">VIP Table</option>
                                    </select>
                                </div>
                                <div className="tableHeaderButton">
                                    <PiHandshakeThin size={14} /> Multi Table Settlement
                                </div>
                                <div className="tableHeaderButton">
                                    <VscMerge size={14} /> Multi Table Bill
                                </div>

                            </div>

                            <div className='d-flex align-items-center gap-3'>


                                <div
                                    className="sidebar-trigger"
                                    onClick={() => setIsOpen(true)}
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
                                        <h5>ACTIONS</h5>
                                        <LiaWindowCloseSolid className="close-btn" onClick={() => setIsOpen(false)} />

                                    </div>
                                    <div className="sidebar-content">

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
                                <div className="tableHeaderButton">
                                    <select className="border-0">
                                        <option>ALL</option>
                                        <option value="1">First Floor</option>
                                        <option value="1">Second Floor</option>
                                        <option value="2">Rooftop</option>
                                        <option value="3">Garden</option>
                                    </select>
                                </div>
                                <div></div>
                            </div>
                            <div>

                            </div>
                            <div>

                            </div>
                        </div>

                        <div className="rightBtmBTm p-2">
                            <div
                                className="btmTop"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <div
                                    className="movableArea"
                                    onMouseDown={handleMouseDown}
                                    style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                                >

                                    <div
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        style={{
                                            transform: `translate(${layoutPos.x}px, ${layoutPos.y}px)`,
                                            transition: isDraggingLayout ? "none" : "transform 0.1s",
                                            cursor: isSelfMode ? "default" : "grab",
                                            width: "max-content",
                                            position: "relative",
                                        }}
                                    >
                                        {loading ? (
                                            <div className="d-flex justify-content-center " style={{ marginTop: '20%' }}>
                                                <Spinner animation="grow" variant="secondary" size="sm" />
                                                <Spinner animation="grow" variant="warning" />
                                                <Spinner animation="grow" variant="secondary" size="sm" />
                                                <Spinner animation="grow" variant="warning" />
                                            </div>
                                        ) : (
                                            tableData.map((table) => (
                                                <Table1
                                                    key={table.tableId}
                                                    table={table}
                                                    moveTable={moveTable}
                                                    onDropChair={onDropChair}
                                                    dragEnabled={isSelfMode && customizationMode === "table"}
                                                    isAddChairMode={customizationMode === "chair"}
                                                    onAddChairs={handleAddChairs}
                                                />
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

                            {/* <div className="btmBtm">
                                <div
                                    className="resetBtn"
                                    onClick={resetLayout}
                                >
                                    Reset Layout
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default TableBook;
