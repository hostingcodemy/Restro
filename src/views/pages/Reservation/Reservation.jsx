import React, { useRef, useState, useEffect } from 'react'
import dayjs from "dayjs";
import Select from "react-select";
import "src/views/pages/Reservation/Reservation.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import "dayjs/locale/en";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { COffcanvas, COffcanvasBody, COffcanvasHeader, CModal } from '@coreui/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { FaDeleteLeft } from "react-icons/fa6";
import { MdOutlineUpdate } from "react-icons/md";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGeneralContext } from '../../../Context/GeneralContext';

const Reservation = () => {

    const { normalize } = useGeneralContext();
    const [selectedDates, setSelectedDates] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const outletRef = useRef();
    const dateRef = useRef();
    const tableTypeRef = useRef();
    const customerRef = useRef();
    const phoneRef = useRef();
    const tableCountRef = useRef();
    const paxRef = useRef();
    const fromTimeRef = useRef();
    const toTimeRef = useRef();
    const addBtnRef = useRef();
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState("");
    const rightPanelRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [viewMode, setViewMode] = useState("summary");
    const [searchTerm, setSearchTerm] = useState("");
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [formData, setFormData] = useState({
        selectedOutlet: null,
        selectedDate: "",
        selectedTableType: null,
        selectedCustomer: null,
        phone: "",
        tableCount: 1,
        pax: "",
        fromTime: "",
        toTime: "",
    });

    useEffect(() => {
        const savedReservations = localStorage.getItem('reservations');
        if (savedReservations) setReservations(JSON.parse(savedReservations));

        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) setFormData(JSON.parse(savedFormData));
    }, []);

    useEffect(() => {
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }, [reservations]);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);


    const columns = [
        { field: 'id', headerName: 'SL No.', width: 80, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'outlet', headerName: 'Outlet', width: 140, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'date', headerName: 'Date', width: 180, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'tableType', headerName: 'Table Type', width: 130, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'customer', headerName: 'Customer Name', width: 200, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'phone', headerName: 'Phone Number', width: 200, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'tableCount', headerName: 'Table Count', width: 130, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'pax', headerName: 'Pax', width: 130, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'fromTime', headerName: 'From', width: 130, headerClassName: 'center-align', cellClassName: 'center-align' },
        { field: 'toTime', headerName: 'To', width: 130, headerClassName: 'center-align', cellClassName: 'center-align' },
        {
            field: 'edit',
            headerName: 'Update',
            width: 110,
            sortable: false,
            headerClassName: 'center-align',
            cellClassName: 'center-align',
            renderCell: (params) => (
                <MdOutlineUpdate size={26} color="orange" style={{ cursor: "pointer" }} onClick={() => handleEdit(params.row.originalIndex)} />

            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 110,
            sortable: false,
            headerClassName: 'center-align',
            cellClassName: 'center-align',
            renderCell: (params) => (
                <FaDeleteLeft size={26} color="red" style={{ cursor: "pointer" }} onClick={() => handleDelete(params.row.originalIndex)} />

            ),
        },
    ];

    const handleDateChange = (date) => {
        setSelectedDates((prev) => {
            const alreadySelected = prev.some((d) => d.toDateString() === date.toDateString());
            const updated = alreadySelected
                ? prev.filter((d) => d.toDateString() !== date.toDateString())
                : [...prev, date];

            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedDate: updated.map((d) => dayjs(d).format("YYYY-MM-DD")),
            }));

            return updated;
        });
    };


    const rows = reservations.map((res, index) => ({
        id: index + 1,
        originalIndex: index,
        outlet: res.outlet,
        date: res.date,
        tableType: res.tableType,
        customer: res.customer,
        phone: res.phone,
        tableCount: res.tableCount,
        pax: res.pax,
        fromTime: res.fromTime,
        toTime: res.toTime,
    }));

    const scroll = (direction) => {
        const container = rightPanelRef.current;
        if (container) {
            container.scrollLeft += direction === "left" ? -300 : 300;
        }
    };

    const currentDayDisplay = dayjs(selectedDate).format("D MMMM, YYYY");

    const timeSlots = [];
    for (let i = 7 * 2; i <= 24 * 2; i++) {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        const timeStr = `${hour > 12 ? hour - 12 : hour}:${minute}${hour >= 12 ? " PM" : " AM"}`;
        timeSlots.push({ index: i, label: timeStr });
    }

    const tableTypes = [
        {
            outlet: "Outlet A",
            type: "Deluxe",
            tables: [
                { name: "Table 1", pax: 4, bookings: [{ name: "Rahul", start: "7:00", end: "9:00", pax: 4 }] },
                { name: "Table 2", pax: 2, bookings: [{ name: "Alice", start: "11:00", end: "13:00", pax: 3 }] },
            ],
        },
        {
            outlet: "Outlet B",
            type: "Luxury",
            tables: [
                { name: "Table 3", pax: 6, bookings: [{ name: "Bob", start: "8:30", end: "10:00", pax: 2 }] },
            ],
        },
    ];

    const getTimeIndex = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 2 + (m === 30 ? 1 : 0);
    };

    const handlePrevDay = () => {
        setSelectedDate((prev) => dayjs(prev).subtract(1, "day").format("YYYY-MM-DD"));
    };

    const handleNextDay = () => {
        setSelectedDate((prev) => dayjs(prev).add(1, "day").format("YYYY-MM-DD"));
    };

    // const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

    const search = normalize(searchTerm);

    const filteredTableTypes = tableTypes
        .map((typeGroup) => {
            const matchedTables = typeGroup.tables.filter((table) => {
                return (
                    normalize(table.name).includes(search) ||
                    normalize(typeGroup.type).includes(search) ||
                    table.bookings.some(
                        (b) =>
                            normalize(b.name).includes(search) ||
                            normalize(b.pax.toString()).includes(search)
                    )
                );
            });

            return matchedTables.length > 0
                ? { ...typeGroup, tables: matchedTables }
                : null;
        })
        .filter(Boolean);

    const customers = [
        { value: "john", label: "John Doe", phone: "9876543210" },
        { value: "jane", label: "Jane Smith", phone: "9123456789" },
    ];

    const tableTypess = [
        { value: "Deluxe", label: "Deluxe", pax: 4 },
        { value: "Luxury", label: "Luxury", pax: 6 },
    ];

    const outlets = [
        { value: "Outlet 1", label: "Outlet 1" },
        { value: "Outlet 2", label: "Outlet 2" },
    ];

    const resetForm = () => {
        setFormData({
            selectedOutlet: null,
            selectedDate: setSelectedDates([]),
            selectedTableType: null,
            selectedCustomer: null,
            phone: "",
            tableCount: 1,
            pax: "",
            fromTime: "",
            toTime: "",
        });
        setEditIndex(null);
        setError("");
    };

    const handleAddOrUpdate = () => {
        const {
            selectedOutlet,
            selectedDate,
            selectedTableType,
            selectedCustomer,
            phone,
            tableCount,
            pax,
            fromTime,
            toTime,
        } = formData;

        if (
            !selectedOutlet ||
            !selectedDate ||
            !selectedTableType ||
            !selectedCustomer ||
            !fromTime ||
            !toTime
        ) {
            setError("Please fill all required fields.");
            return;
        }

        const entry = {
            outlet: selectedOutlet.label,
            date: selectedDate,
            tableType: selectedTableType.label,
            customer: selectedCustomer.label,
            phone,
            tableCount,
            pax,
            fromTime,
            toTime,
        };

        if (editIndex !== null) {
            const updated = [...reservations];
            updated[editIndex] = entry;
            setReservations(updated);
        } else {
            const newEntries = (Array.isArray(selectedDate) ? selectedDate : [selectedDate]).map((date) => ({
                outlet: selectedOutlet.label,
                date: date,
                tableType: selectedTableType.label,
                customer: selectedCustomer.label,
                phone,
                tableCount,
                pax,
                fromTime,
                toTime,
            }));
            setReservations((prev) => [...prev, ...newEntries]);
        }


        resetForm();
    };

    const handleEdit = (index) => {
        const row = reservations[index];
        const selectedCustomer = customers.find(
            (c) => c.label === row.customer
        );
        const selectedTableType = tableTypess.find(
            (t) => t.label === row.tableType
        );
        const selectedOutlet = outlets.find((o) => o.label === row.outlet);

        const dateObj = new Date(row.date);

        setSelectedDates([dateObj]);

        setFormData({
            selectedOutlet,
            selectedDate: [row.date],
            selectedTableType,
            selectedCustomer,
            phone: row.phone,
            tableCount: row.tableCount,
            pax: row.pax,
            fromTime: row.fromTime,
            toTime: row.toTime,
        });
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        setReservationToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        const updated = reservations.filter((_, i) => i !== reservationToDelete);
        setReservations(updated);
        setReservationToDelete(null);
        setShowDeleteModal(false);
        setSelectedDates([]);
        resetForm();
    };

    const cancelDelete = () => {
        setReservationToDelete(null);
        setShowDeleteModal(false);
    };

    const handleKeyDown = (e, selectRef, nextRef, prevRef) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const select = selectRef?.current;
            const menuIsOpen = select?.select?.state?.menuIsOpen;
            const focused = select?.select?.state?.focusedOption;

            if (menuIsOpen && focused) {
                select.select.selectOption(focused);
                setTimeout(() => nextRef?.current?.focus(), 150);
            } else {
                setTimeout(() => nextRef?.current?.focus(), 150);
            }
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            nextRef?.current?.focus();
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevRef?.current?.focus();
        }
    };

    useEffect(() => {
        if (showOffcanvas) {
            setTimeout(() => outletRef.current?.focus(), 100);
        }
    }, [showOffcanvas]);

    const groupedByOutlet = filteredTableTypes.reduce((acc, typeGroup) => {
        const outlet = typeGroup.outlet;
        if (!acc[outlet]) acc[outlet] = [];
        acc[outlet].push(typeGroup);
        return acc;
    }, {});

    return (
        <div>
            <CModal visible={showDeleteModal} onClose={cancelDelete}>
                <div className="p-4">
                    <h5 className="mb-3 text-danger">Confirm Delete</h5>
                    <p>
                        Are you sure you want to delete the reservation for <strong>{reservations[reservationToDelete]?.customer}</strong> on <strong>{reservations[reservationToDelete]?.date}</strong>?
                    </p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={cancelDelete}>
                            Cancel
                        </button>
                        <button className="btn btn-danger text-white" onClick={confirmDelete}>
                            Confirm
                        </button>
                    </div>
                </div>
            </CModal>

            <div className="top-bar d-flex justify-content-between align-items-center  px-3 py-3 border-bottom bg-white">
                <div className="d-flex align-items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="form-control shadow-sm"
                        style={{ width: 180 }}
                    />
                    <div className="searchBar">
                        <input
                            type="text"
                            placeholder="Search table / customer / pax..."
                            className="form-control shadow-sm "
                            style={{ width: 280 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        />
                    </div>

                </div>
                <div className="d-flex align-items-center gap-5">
                    <div className="d-flex align-items-center justify-content-center shadow-sm" style={{ border: "0.01rem solid #e0e0e0", borderRadius: "100%" }} onClick={handlePrevDay}>
                        <MdChevronLeft size={24} />
                    </div>
                    <div className=" fs-5 text-center ">{currentDayDisplay}</div>
                    <div className="d-flex align-items-center justify-content-center shadow-sm" style={{ border: "0.01rem solid #e0e0e0", borderRadius: "100%" }} onClick={handleNextDay}>
                        <MdChevronRight size={24} />
                    </div>
                </div>

                <div className="d-flex gap-4 align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <div className={viewMode === "summary" ? "text-warning" : "text-secondary"}>
                            Summary
                        </div>

                        <div className="form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="toggleView"
                                checked={viewMode === "detailed"}
                                onChange={(e) => setViewMode(e.target.checked ? "detailed" : "summary")}
                            />
                        </div>

                        <div style={{ marginLeft: "-0.5rem" }} className={viewMode === "detailed" ? "text-warning" : "text-secondary"}>
                            Detailed
                        </div>
                    </div>


                    <div
                        className="d-flex align-items-center gap-1 fw-bold fs-6 text-warning"
                        role="button"
                        onClick={() => setShowOffcanvas(true)}
                    >
                        <IoAddCircleOutline className="text-warning" size={20} /> Add Reservation
                    </div>

                    <COffcanvas
                        placement="top"
                        visible={showOffcanvas}
                        onHide={() => {
                            setShowOffcanvas(false);
                            resetForm();
                        }}
                        backdrop={true}
                        scroll={true}
                        style={{ height: '90vh', maxHeight: '100vh', overflowY: 'auto', marginTop: "8vh" }}
                    >
                        <COffcanvasHeader>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setShowOffcanvas(false);
                                    resetForm();
                                }}
                            />
                        </COffcanvasHeader>

                        <COffcanvasBody>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="row d-flex flex-wrap g-3 bg-white rounded">
                                <div className="col-md" style={{ minWidth: 200 }}>
                                    <label className="form-label fw-semibold">Outlet</label>
                                    <Select
                                        ref={outletRef}
                                        classNamePrefix="react-select"
                                        options={outlets}
                                        value={formData.selectedOutlet}
                                        onChange={(selected) => {
                                            setFormData((prev) => ({ ...prev, selectedOutlet: selected }));
                                            setTimeout(() => dateRef.current?.focus(), 150);
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, outletRef, dateRef, outletRef)}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 100 }}>
                                    <label className="form-label fw-semibold">Date</label>
                                    <DatePicker
                                        ref={dateRef}
                                        onChange={handleDateChange}
                                        minDate={new Date()}
                                        monthsShown={2}
                                        highlightDates={selectedDates}
                                        value={selectedDates.map((d) => dayjs(d).format("DD MMM")).join(", ")}
                                        placeholderText="Select dates"
                                        dayClassName={(date) =>
                                            selectedDates.some((d) => d.toDateString() === date.toDateString())
                                                ? "bg-primary text-white rounded"
                                                : undefined
                                        }
                                        isClearable
                                        shouldCloseOnSelect={false}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control shadow-sm"
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 160 }}>
                                    <label className="form-label fw-semibold">Table Type</label>
                                    <Select
                                        ref={tableTypeRef}
                                        classNamePrefix="react-select"
                                        options={tableTypess}
                                        value={formData.selectedTableType}
                                        onChange={(selected) => {
                                            setFormData((prev) => ({ ...prev, selectedTableType: selected, pax: selected?.pax || "" }));
                                            setTimeout(() => customerRef.current?.focus(), 150);
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, tableTypeRef, customerRef, dateRef)}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 180 }}>
                                    <label className="form-label fw-semibold">Customer</label>
                                    <Select
                                        ref={customerRef}
                                        classNamePrefix="react-select"
                                        options={customers}
                                        value={formData.selectedCustomer}
                                        onChange={(selected) => {
                                            setFormData((prev) => ({ ...prev, selectedCustomer: selected, phone: selected?.phone || "" }));
                                            setTimeout(() => tableCountRef.current?.focus(), 150);
                                        }}
                                        isSearchable
                                        onKeyDown={(e) => handleKeyDown(e, customerRef, tableCountRef, tableTypeRef)}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 140 }}>
                                    <label className="form-label fw-semibold">Phone</label>
                                    <input
                                        ref={phoneRef}
                                        type="text"
                                        className="form-control shadow-sm"
                                        value={formData.phone}
                                        readOnly
                                        tabIndex={-1}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 120 }}>
                                    <label className="form-label fw-semibold">Tables</label>
                                    <input
                                        ref={tableCountRef}
                                        type="text"
                                        className="form-control shadow-sm"
                                        min={1}
                                        value={formData.tableCount}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, tableCount: parseInt(e.target.value) }))}
                                        onKeyDown={(e) => handleKeyDown(e, tableCountRef, paxRef, customerRef)}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 100 }}>
                                    <label className="form-label fw-semibold">Pax</label>
                                    <input
                                        ref={paxRef}
                                        type="text"
                                        className="form-control shadow-sm"
                                        value={formData.pax}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, pax: parseInt(e.target.value) }))}
                                        onKeyDown={(e) => handleKeyDown(e, paxRef, fromTimeRef, tableCountRef)}
                                    />
                                </div>

                                <div className="col-md" style={{ minWidth: 120 }}>
                                    <label className="form-label fw-semibold">From</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileTimePicker
                                            // label="From"
                                            minutesStep={30}
                                            value={formData.fromTime ? dayjs(`2024-01-01T${formData.fromTime}`) : null}
                                            onChange={(value) => {
                                                const formatted = value ? value.format("HH:mm") : "";
                                                setFormData((prev) => ({ ...prev, fromTime: formatted }));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    variant: "outlined",
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>

                                    {/* <input
                    ref={fromTimeRef}
                    type="time"
                    className="form-control shadow-sm"
                    value={formData.fromTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fromTime: e.target.value }))}
                    onKeyDown={(e) => handleKeyDown(e, fromTimeRef, toTimeRef, paxRef)}
                  /> */}
                                </div>

                                <div className="col-md" style={{ minWidth: 120 }}>
                                    <label className="form-label fw-semibold">To</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileTimePicker
                                            // label="To"
                                            minutesStep={30}
                                            value={formData.toTime ? dayjs(`2024-01-01T${formData.toTime}`) : null}
                                            onChange={(value) => {
                                                const formatted = value ? value.format("HH:mm") : "";
                                                setFormData((prev) => ({ ...prev, toTime: formatted }));
                                            }}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    variant: "outlined",
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>

                                    {/* <input
                    ref={toTimeRef}
                    type="time"
                    className="form-control shadow-sm"
                    value={formData.toTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, toTime: e.target.value }))}
                    onKeyDown={(e) => handleKeyDown(e, toTimeRef, addBtnRef, fromTimeRef)}
                  /> */}
                                </div>

                                <div className="col-md" style={{ minWidth: 120, alignSelf: 'end' }}>
                                    <button
                                        ref={addBtnRef}
                                        className="btn btn-warning text-white w-100 shadow"
                                        onClick={handleAddOrUpdate}
                                    >
                                        {editIndex !== null ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>

                            <Box
                                sx={{
                                    height: 330,
                                    minWidth: 1000,
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    mt: 4,
                                    boxShadow: 2,
                                }}
                            >
                                <DataGrid
                                    rows={rows}
                                    rowHeight={35}
                                    columns={columns}
                                    pagination={false}
                                    disableRowSelectionOnClick
                                    components={{ Toolbar: GridToolbar }}
                                    sx={{
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#f5f5f5',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            fontSize: 14,
                                        },
                                    }}
                                />
                            </Box>

                            <div className="d-flex  justify-content-between align-items-end mt-3 flex-wrap gap-3 bg-white p-3 rounded shadow-sm">
                                <div className="d-flex flex-column gap-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="termsCheck" />
                                        <label className="form-check-label fw-semibold" htmlFor="termsCheck">
                                            Terms and Conditions
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="menuPageCheck" />
                                        <label className="form-check-label fw-semibold" htmlFor="menuPageCheck">
                                            Is Menu Page
                                        </label>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end  align-items-center gap-2">
                                    <button className="btn btn-outline-success w-100 shadow-sm" style={{ minWidth: 100 }}>
                                        Confirm
                                    </button>
                                    <button className="btn btn-outline-warning w-100 shadow-sm" style={{ minWidth: 170 }}>
                                        Tentative Booking
                                    </button>
                                    <button onClick={() => {
                                        setShowOffcanvas(false);
                                        resetForm();
                                    }} className="btn btn-outline-secondary w-100 shadow-sm" style={{ minWidth: 100 }}>
                                        Cancel
                                    </button>
                                </div>

                                <div className="reservation-summary p-3 bg-light rounded shadow-sm" style={{ minWidth: 250 }}>
                                    <h6 className="fw-bold mb-3">Reservation Summary</h6>
                                    <div className="d-flex justify-content-between">
                                        <span>Total Tables:</span>
                                        <span>{formData.tableCount || 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Total Pax:</span>
                                        <span>{formData.pax || 0}</span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span>Estimated Amount:</span>
                                        <span>₹0.00</span>
                                    </div>
                                </div>
                            </div>

                        </COffcanvasBody>


                    </COffcanvas>

                </div>
            </div>

            <div className="reservation-container d-flex">

                <div className="left-panel">
                    {Object.entries(groupedByOutlet).map(([outlet, groups], idx) => (
                        <div key={idx} className="outlet-group py-2">
                            <div className="outlet-name fw-bold text-primary text-uppercase ">{outlet}</div>

                            {viewMode === "summary" ? (
                                groups.map((typeGroup, i) => (
                                    <div key={i} className="type-name fw-bold text-uppercase d-flex flex-column">
                                        {typeGroup.type}
                                        <span className="table-type" style={{ fontSize: "0.65rem" }}>
                                            {typeGroup.tables.filter((t) => t.bookings.length > 0).length} booked
                                        </span>
                                    </div>
                                ))
                            ) : (
                                groups.flatMap((typeGroup) =>
                                    typeGroup.tables.map((table, i) => (
                                        <div key={i} className="table-info ps-2 py-2">
                                            <div className="table-name text-capitalize fw-bold gap-1">
                                                {table.name} <span style={{ fontSize: "0.75rem" }}>#{table.pax}</span>
                                            </div>
                                            <div className="table-type small">{typeGroup.type}</div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    ))}
                </div>

                <div className="right-wrapper">
                    <button className="scroll-btn left-btn" onClick={() => scroll("left")}>
                        <MdChevronLeft size={24} />
                    </button>
                    <button className="scroll-btn right-btn" onClick={() => scroll("right")}>
                        <MdChevronRight size={24} />
                    </button>

                    <div className="right-panel" ref={rightPanelRef}>

                        <div className="time-header">
                            {timeSlots.map((slot, i) => (
                                <div key={i} className="time-slot">
                                    {slot.label}
                                </div>
                            ))}
                        </div>

                        {Object.entries(groupedByOutlet).map(([outlet, groups], idx) => (
                            <div key={idx} className="outlet-group">
                                <div className="outlet-name fw-bold text-primary text-uppercase py-2 px-2 bg-light border-bottom">
                                    {outlet}
                                </div>

                                {viewMode === "summary" ? (
                                    groups.map((typeGroup, typeIdx) => (
                                        <div key={typeIdx} className="table-row">
                                            {typeGroup.tables.flatMap((table) =>
                                                table.bookings.map((booking, i) => {
                                                    const GRID_START_INDEX = 14;
                                                    const start = getTimeIndex(booking.start);
                                                    const end = getTimeIndex(booking.end);
                                                    const gridStart = start - GRID_START_INDEX + 1;
                                                    const gridEnd = end - GRID_START_INDEX + 1;

                                                    if (isNaN(start) || isNaN(end) || start >= end) return null;

                                                    return (
                                                        <div
                                                            key={`${table.name}-${i}`}
                                                            className="booking-bar shadow-sm"
                                                            style={{
                                                                gridColumnStart: gridStart,
                                                                gridColumnEnd: gridEnd,
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-between w-100 gap-1">
                                                                <div className="fw-bold">{table.name}</div>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="d-flex align-items-center gap-1 fw-bold">
                                                                        <IoPersonCircleOutline color="#bfbfbf" size={23} />
                                                                        {booking.name}
                                                                    </span>
                                                                    <span
                                                                        className="fw-bold d-flex align-items-end gap-1"
                                                                        style={{ fontSize: "0.8rem", color: "#ff6f00" }}
                                                                    >
                                                                        <MdOutlineSupervisorAccount size={19} color="black" />
                                                                        {booking.pax}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    groups.flatMap((typeGroup, typeIdx) =>
                                        typeGroup.tables.map((table, tableIdx) => (
                                            <div key={`${typeIdx}-${tableIdx}`} className="table-row">
                                                {table.bookings.map((booking, i) => {
                                                    const start = getTimeIndex(booking.start);
                                                    const end = getTimeIndex(booking.end);
                                                    const gridStart = start - 14 + 1;
                                                    const gridEnd = end - 14 + 1;

                                                    if (isNaN(start) || isNaN(end) || start >= end) return null;

                                                    return (
                                                        <div
                                                            key={i}
                                                            className="booking-bar shadow-sm"
                                                            style={{
                                                                gridColumnStart: gridStart,
                                                                gridColumnEnd: gridEnd,
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-1 fw-bold">
                                                                <IoPersonCircleOutline color="#bfbfbf" size={23} />
                                                                {booking.name}
                                                            </div>
                                                            <div
                                                                className="fw-bold d-flex align-items-end gap-1"
                                                                style={{ fontSize: "0.8rem", color: "#ff6f00" }}
                                                            >
                                                                <MdOutlineSupervisorAccount size={19} color="black" />
                                                                {booking.pax}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reservation
