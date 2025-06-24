import React, { useEffect, useRef, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { VscMerge } from "react-icons/vsc";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import OrderModal from "./Modal";
import Table1 from "./Table1";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
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
import { useGeneralContext } from "../../Context/GeneralContext";
import SplitModal from "./SplitTable";
import { toast, ToastContainer } from 'react-toastify';
import { MdOutlineFolderDelete } from "react-icons/md";

const TableBook = () => {

    const [errors, setErrors] = useState({});
    const [isAddChairMode, setIsAddChairMode] = useState(false);
    const { setIsMergeTable, isMergeTable, isSplitTable, setisSplitTable } = useGeneralContext();
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("table");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectionMode, setSelectionMode] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showAddTableModal, setShowAddTableModal] = useState(false);
    const [labelIndex, setLabelIndex] = useState(0);
    const [selectedTables, setSelectedTables] = useState([]);
    const [isToggled, setIsToggled] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tableName: "",
        pax: "",
        orderTaker: "",
        status: "",
        remarks: "",
        section: ""
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
    const authChannelStr = localStorage.getItem("authChannels");
    const authChannels = JSON.parse(authChannelStr);
    const userDetails = authChannels[0]?.adminDetails;
    const outletId = localStorage.getItem("currentOutletId");
    const [saveLayoutData, setSaveLayoutData] = useState('');
    const [tableType, setTableType] = useState('');
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [selectedSection, setSelectedSection] = useState("all");
    const select = [
        {
            id: 1,
            value: "open",
            name: "Open Table"
        }, {
            id: 2,
            value: "vip",
            name: "Vip Table"
        }
    ]

    const postOpenTable = async () => {


        const payload = {

            tableId: [],
            sectionId: formData.section,
            // outletId: outletId,
            outletId: "a546dd1d-9963-47e4-aa92-47ee1d2770f1",
            name: formData.tableName,
            orderTaker: userDetails?.userID,
            pax: formData.pax,
            amount: 0,
            prefix: "",
            customerId: null,
            type: "open",
            splitCount: 0,
            splitTables: [],
            remarks: formData.remarks,
            isOpen: true,
            isActive: true,
            facilityStatusId: formData.status
        };

        try {

            const postOpenTable = await api.post("/tablelog", payload);

            if (postOpenTable.data.isValid) {
                fetchTableData();
                toast.success(`${formData.tableName} table created successfully`);
            } else {
                toast.dismiss(`Failed to create table ${formData.tableName}`);
            }
        } catch (error) {

            console.log(error);

        }

    };

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
    if (fetchCalled.current) return;
    fetchCalled.current = true;
     fetchTableData();
       fetchSectionData();
        fetchFacilityData();
          getLayout();
  }, []);


    const getBackend = () => {
        if (typeof window !== "undefined") {
            const isTouchDevice =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;
            return isTouchDevice
                ? TouchBackend
                : HTML5Backend;
        }
        return HTML5Backend;
    };

    const backend = useMemo(() => getBackend(), []);


    const handleSelect = (id) => {
        setSelectedStatusId(prevId => (prevId === id ? null : id));
    };

    const fetchTableData = async () => {
        try {
            // const response = await api.get(`/tablelog/outlet/${outletId}`);
            const response = await api.get(`/tablelog/outlet/a546dd1d-9963-47e4-aa92-47ee1d2770f1`);
            const fetchedTables = response.data.list;

            const transformed = fetchedTables.map((t, index) => ({
                ...t,

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


    const handleSaveLayout = async () => {

        const payload = {
            layoutType: "table",
            layoutJson: {
                section: selectedSection,
                facilityStatusId: selectedStatusId,
                tableType: tableType
            },
            isActive: true
        }

        try {

            const res = await api.post("/tableloglayout", payload);

            if (res?.data?.isValid) {
                toast.success(`Layout saved successfully`);

            } else {
                toast.dismiss(`Failed to create layout `);
            }

        } catch (error) {
            console.log(error);

        }

    };

    const getLayout = async () => {
        try {
            const res = await api.get("/tableloglayout");

            const layout = res?.data?.data?.layoutJson;

            if (layout) {
                if (layout.tableType) setTableType(layout.tableType);
                if (layout.facilityStatusId) setSelectedStatusId(layout.facilityStatusId);
                if (layout.section) setSelectedSection(layout.section);
            }

        } catch (error) {
            console.log(error);

        }


    }

    const handleDeleteLayout = async () => {

        try {
            const res = await api.delete("/tableloglayout");

            if (res?.data?.isValid) {
                toast.success(`Layout delete successfully`);
            } else {
                toast.dismiss(`Failed to delete layout `);
            }
        } catch (error) {
            console.log(error);

        }
    }



    const moveTable = (tableId, x, y) => {

        const updated = tableData.map((table) =>
            table.tableId === tableId ? { ...table, position: { x, y } } : table
        );
        setTableData(updated);
        localStorage.setItem("tableLayout", JSON.stringify(updated));

    };

    const isDuplicateTableName = tableData.some(
        (table) => table.tableName.toLowerCase() === formData.tableName.trim().toLowerCase()
    );

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


    const handleAddChairs = async (tableId, addonCount, table) => {

        const payload = {
            tableName: table.tableName,
            outletId: outletId,
            capacity: table.capacity,
            addonCapacity: addonCount,
            facilityStatusId: table.facilityStatusId,
            direction: null,
            type: table.type,
            isActive: true,
            tableShapes: null,
            sectionId: table.sectionId
        }

        console.log(payload);

        try {

            const res = await api.put(`/tables/${tableId}`, payload);


            if (res?.data?.isValid) {
                toast.success(`Chair add successfully`);
                fetchTableData()
            } else {
                toast.dismiss(`Failed to add chair `);
            }

        } catch (error) {
            console.log(error);

        }

        // setTableData(prevData =>
        //     prevData.map(table => {
        //         if (table.tableId === tableId) {
        //             let updatedChairs = [...table.chairs];
        //             if (count > 0) {

        //                 const newChairs = Array.from({ length: count }, (_, i) => ({
        //                     id: `${tableId}-chair-${Date.now()}-${i}`
        //                 }));
        //                 updatedChairs.push(...newChairs);
        //             } else {

        //                 updatedChairs = updatedChairs.slice(0, updatedChairs.length + count);
        //             }

        //             return { ...table, chairs: updatedChairs };
        //         }
        //         return table;
        //     })
        // );
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedSection('all');
        setSelectedStatusId(null);
        setTableType("all");
    }


    return (
        <>

            <DndProvider backend={backend}>
                <ToastContainer />
                <div className='tableBook d-flex align-items-center justify-content-between bg-white'>

                    {isMergeTable && <MergeModal tableList={tableData} section={section} setIsMergeTable={setIsMergeTable} facility={facility} fetchTableData={fetchTableData} />}
                    {isSplitTable && <SplitModal tableList={tableData} section={section} setIsSplitTable={setisSplitTable} facility={facility} fetchTableData={fetchTableData} />}

                    <div className="tableBookRight">
                        <div className="rightTop">
                            <div className='topHeader px-2 w-100 d-flex align-items-center justify-content-end gap-4 bg-white'>
                                <div className="d-flex align-items-center justify-content-end w-100 gap-3">

                                 

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
                                    <div className="tableHeaderButton" onClick={handleSaveLayout}>
                                        <CiSaveDown2 size={14} color="green" /> Save Layout
                                    </div>
                                    <div className="tableHeaderButton text-danger" onClick={handleDeleteLayout}>
                                        <MdOutlineFolderDelete color="red" size={14} /> Reset Layout
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
                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><IoLayersOutline /></span>
                                                            <select
                                                                className="form-select"
                                                                value={formData.status}
                                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                            >
                                                                <option value="">Select Status</option>
                                                                {facility
                                                                    .filter(item => item.prefix === "V" || item.prefix === "M")
                                                                    .map(item => (
                                                                        <option key={item.facilityStatusId} value={item.facilityStatusId}>
                                                                            {item.facilityStatus}
                                                                        </option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>

                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Table Name</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><MdOutlineTableRestaurant /></span>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${(formData.tableName && isDuplicateTableName) || errors.tableName ? "is-invalid" : ""
                                                                    }`}
                                                                placeholder="Enter your Table Name Like t3 t4"
                                                                value={formData.tableName}
                                                                onChange={(e) => {
                                                                    const input = e.target.value;
                                                                    const formattedName = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

                                                                    setFormData({ ...formData, tableName: formattedName })
                                                                }}
                                                            />
                                                            {errors.tableName && <div className="invalid-feedback">{errors.tableName}</div>}
                                                            {formData.tableName && isDuplicateTableName && (
                                                                <div className="invalid-feedback">
                                                                    Table name already exists.
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Pax</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text"><FaChair /></span>
                                                            <input
                                                                type="number"
                                                                className={`form-control ${errors.pax ? "is-invalid" : ""}`}
                                                                placeholder="1234"
                                                                value={formData.pax}
                                                                onChange={(e) => setFormData({ ...formData, pax: e.target.value })}
                                                            />
                                                            {errors.pax && <div className="invalid-feedback">{errors.pax}</div>}
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
                                                                <option value={userDetails.userID}>{userDetails.name}</option>

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
                                                                <option value="">Select Section
                                                                </option>
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

                                                        <button
                                                            className="btn btn-warning"
                                                            onClick={() => {
                                                                const newErrors = {};
                                                                if (!formData.tableName.trim()) newErrors.tableName = "Table name is required.";
                                                                if (!formData.pax || Number(formData.pax) <= 0) newErrors.pax = "Pax must be greater than 0.";

                                                                if (Object.keys(newErrors).length > 0) {
                                                                    setErrors(newErrors);
                                                                    return;
                                                                }

                                                                postOpenTable();
                                                                setIsOpen(false);
                                                                setShowAddTableModal(false);
                                                                setFormData({ tableName: "", pax: "", orderTaker: "", remarks: "" });
                                                                setErrors({});
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
                                            <input
                                                style={{ border: "none", outline: "none", marginRight: "1vw", padding: "0.3vw" }}
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
                                        <select className="border-0" value={tableType}
                                            onChange={(e) => setTableType(e.target.value)}>
                                            <option value="all"> Select</option>
                                            {
                                                select.map((selectItem) => {
                                                    return <option key={selectItem.id} value={selectItem.value}>{selectItem.name}</option>
                                                })
                                            }

                                            {/* <option value="Vip Table"></option> */}
                                        </select>
                                    </div>

                                    <div className="d-flex overflow-auto gap-3 py-2 px-1">
                                        {facility?.map((status) => {
                                            const isSelected = selectedStatusId === status.facilityStatusId;
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
                                                    onClick={() => handleSelect(status.facilityStatusId)}
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
                                        <div className="d-flex justify-content-center" style={{ marginLeft: "50%", marginTop: "15%" }}>
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
                                                        table.sectionName.toLowerCase() === selectedSection.toLowerCase();

                                                    const search = searchTerm.trim();
                                                    const searchMatch =
                                                        table.tableName.toLowerCase().includes(search) ||
                                                        table.direction.toLowerCase().includes(search) ||
                                                        table.capacity.toString().includes(search);

                                                    const statusMatch = !selectedStatusId || table.facilityStatusId === selectedStatusId;
                                                    const typeMatch = tableType === "" || tableType === "all" || table.type === tableType;
                                                    return sectionMatch && statusMatch && searchMatch && typeMatch;
                                                })
                                                .reduce((acc, table) => {
                                                    const section = table.sectionName || "Unknown Section";
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
        </>
    );
};

export default TableBook;
