import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import { Form, Button, Offcanvas, InputGroup, Row, Col, Table } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit, FaRegFile } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import DataTableSettings from '../../../helpers/DataTableSettings';
import { MdOutlinePersonOutline } from "react-icons/md";
import { MdFormatListNumberedRtl } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegBuilding } from "react-icons/fa";
import { FaTrash, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { Spinner } from 'react-bootstrap';
import { GiTable } from "react-icons/gi";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md";
import { GrDirections } from "react-icons/gr";
import { LuType } from "react-icons/lu";
import { IoLayersOutline } from "react-icons/io5";

const TablePage = () => {

    const fetchCalled = useRef(false);
    const channelId = localStorage.getItem("channelId");
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState([]);

    useEffect(() => {

        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const [filterText, setFilterText] = useState("");
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [tableData, setTableData] = useState([]);
    const searchParam = [
        "tableName",
        "capacity",
        "tableStatus",
        "tableLocation",
        "isActive"
    ];

    const initialValues = {
        tableId: "",
        tableName: "",
        capacity: "",
        outletId: "",
        tableStatus: "",
        direction: "",
        type: "",
        serial: "",
        tableShapes: "",
        section: "",
        openTable: false,
        isActive: false,
    }

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [outletData, setOutletData] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [tableToDelete, settableToDelete] = useState(null);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    console.log(formValues);

    const handleClose = () => {
        setShow(false);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
        fetchOutletData();
    };

    const handleShow = () => {
        setFormValues(initialValues);
        setIsEditMode(false);
        setErrors({});
        setShow(true);
        fetchOutletData();
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchTableData();
    }, []);

    useEffect(() => {
        fetchSectionData();
    }, [])


    const fetchOutletData = async () => {
        try {
            const res = await api.get("/outlets", {

            });
            setOutletData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchTableData = async () => {
        try {
            const res = await api.get("/tables");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setTableData(sortedData);
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

    const handleChange = (name, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const {
            tableName,
            capacity,
            outletId,
            tableStatus,
            direction,
            type,
            serial
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!tableName) {
            isValid = false;
            errors.tableName = "Table name is required.";
        }
        if (!capacity) {
            isValid = false;
            errors.capacity = "Pax is required";
        }
        if (!outletId) {
            isValid = false;
            errors.outletId = "Outlet is required";
        }
        if (!tableStatus) {
            isValid = false;
            errors.tableStatus = "Table status is required";
        }
        if (!direction) {
            isValid = false;
            errors.direction = "Direction is required";
        }
        if (!type) {
            isValid = false;
            errors.type = "Table type is required";
        }
        if (!serial) {
            isValid = false;
            errors.serial = "Serial no. is required";
        }

        setErrors(errors);
        return isValid;
    };

    const handleEditClick = (row) => {
        setIsEditMode(true);
        setFormValues({
            tableId: row.tableId,
            tableName: row.tableName,
            capacity: row.capacity,
            outletId: row.outletId,
            outletName: row.outletName,
            direction: row.direction,
            serial: row.serial,
            type: row.type,
            channelID: channelId,
            tableLocation: row.tableLocation,
            tableStatus: row.tableStatus,
            openTable: row.openTable,
            isActive: row.isActive,
            section: row.section
        });
        setShow(true);
    };

    const handleDeleteClick = (employeeID, employeeName) => {
        settableToDelete({ id: employeeID, name: employeeName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!tableToDelete) return;

        api.delete(`/tables/${tableToDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Table deleted successfully!");
                fetchTableData();
            })
            .catch((error) => {
                console.error("Error deleting table:", error);
                toast.error("Failed to delete table.");
            })
            .finally(() => {
                setConfirmOpen(false);
                settableToDelete(null);
            });
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        settableToDelete(null);
    };



    const columns = [
        {
            name: <h5>Table Name</h5>,
            selector: (row) => row.tableName,
            sortable: true,
        },
        {
            name: <h5>Pax</h5>,
            selector: (row) => row.capacity,
            sortable: true,
        },
        {
            name: <h5>Outlet</h5>,
            selector: (row) => row.channelName,
            sortable: true,
        },
        {
            name: <h5>Table Status</h5>,
            selector: (row) => row.tableStatus,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <span
                    style={{
                        color: row.isActive ? "#88E788" : "#FF474C",
                        fontWeight: "bold",
                    }}
                >
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
            sortable: true,
        },
        {
            name: <h5>Action</h5>,
            center: true,
            cell: (row) => (
                <>
                    <Link className="action-icon" onClick={() => handleEditClick(row)}>
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.tableId, row.tableName)}>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="d-flex justify-content-end gap-2 align-items-center w-100">
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search..."
                        className="me-2 rounded-pill"
                        aria-label="Search"
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Form>
                    <Button variant="info"
                        onClick={handleExpoShow}
                    >
                        <CiExport size={20} style={{ marginTop: "-0.5vh" }} /> Import
                    </Button>
                    <Button variant="success"
                    >
                        <CiImport size={20} style={{ marginTop: "-0.5vh" }} /> Export
                    </Button>
                    <Button variant="warning" onClick={handleShow}>
                        <GoPlus size={20} style={{ marginTop: "-0.5vh" }} /> Add
                    </Button>
            </div>
        );
    }, [filterText]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            tableName: formValues.tableName,
            capacity: formValues.capacity,
            outletId: formValues.outletId,
            tableStatus: formValues.tableStatus,
            direction: formValues.direction,
            type: formValues.type,
            isActive: formValues.isActive,
            serial: formValues.serial,
            section: formValues.section,
            tableShapes: formValues.tableShapes,
            openTable: formValues.openTable
        };


        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/tables/${formValues.tableId}`, payload);
                fetchTableData();
            } else {
                res = await api.post("/tables", payload);
            }

            handleClose();


            toast.success(res.data.successMessage || "Success!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong! Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };




    return (
        <>
            <ToastContainer />
            {confirmOpen && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        transition: "opacity 0.3s ease-in-out",
                    }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 animate__animated animate__fadeInDown">
                            <div className="modal-header bg-danger text-white rounded-top-4">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <FaExclamationTriangle />
                                    Confirm Deletion
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={cancelDelete}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <p className="fs-5 mb-0">
                                    Are you sure you want to delete{" "}
                                    <strong>{tableToDelete?.name}</strong>?
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pb-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded text-white px-4 d-flex align-items-center gap-2"
                                    onClick={cancelDelete}
                                >
                                    <FaTimesCircle />
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger text-white rounded px-4 shadow d-flex align-items-center gap-2"
                                    onClick={confirmDelete}
                                >
                                    <FaTrash />
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {loading ? (
                <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
                    <Spinner animation="grow" variant="secondary" size="sm" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="secondary" size="sm" />
                    <Spinner animation="grow" variant="warning" />
                </div>
            ) : (
                <div className='d-flex'>
                    <div className='p-3' style={{ width: "100vw" }}>
                        <DataTable
                            className='DataTable'
                            columns={columns}
                            data={DataTableSettings.filterItems(tableData, searchParam, filterText)}
                            pagination
                            paginationPerPage={DataTableSettings.paginationPerPage}
                            paginationRowsPerPageOptions={DataTableSettings.paginationRowsPerPageOptions}
                            progressPending={loadingIndicator}
                            subHeader
                            fixedHeaderScrollHeight="400px"
                            subHeaderComponent={subHeaderComponentMemo}
                            persistTableHead
                        />
                    </div>
                </div>
            )}

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-canvas"
                style={{ "--bs-offcanvas-width": "1000px" }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Table" : "Add Table"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body className='row' style={{ marginTop: "-2vh" }}>
                    <Form className='h-90 ' >
                        <Row>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="Tablename">
                                        <MdOutlineTableRestaurant size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Tablename"
                                        value={formValues.tableName || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, tableName: e.target.value })
                                        }
                                        placeholder="Table name"
                                        aria-label="Tablename"
                                        isInvalid={!!errors.tableName}
                                        isValid={formValues.tableName && !errors.tableName}
                                    />
                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <MdOutlinePersonOutline size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="capacity"
                                        value={formValues.capacity || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, capacity: e.target.value })
                                        }
                                        placeholder="Enter capacity"
                                        aria-label="capacity"
                                        isInvalid={!!errors.capacity}
                                        isValid={formValues.capacity && !errors.capacity}
                                    />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="employeeTypeId">
                                        <FaRegBuilding size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.outletId}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, outletId: e.target.value })
                                        }
                                        required
                                        isInvalid={!!errors.outletId}
                                    >
                                        <option value="">Select Outlet</option>
                                        {outletData?.map((item) => (
                                            <option key={item.outletId} value={item.outletId}>
                                                {item.outletName}
                                            </option>
                                        ))}
                                    </Form.Select>

                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text>
                                        <MdOutlineTableBar size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.tableStatus}
                                        onChange={(e) => setFormValues({ ...formValues, tableStatus: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Table Status</option>
                                        <option value="Available">Available</option>
                                        <option value="Occupied">Occupied</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Hold">Hold</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <GrDirections size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Direction"
                                        value={formValues.direction || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, direction: e.target.value })
                                        }
                                        placeholder="Enter Direction"
                                        aria-label="capacity"
                                        isInvalid={!!errors.direction}
                                        isValid={formValues.direction && !errors.direction}
                                    />
                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <LuType size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Direction"
                                        value={formValues.type || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, type: e.target.value })
                                        }
                                        placeholder="Enter Table Type"
                                        aria-label="capacity"
                                        isInvalid={!!errors.type}
                                        isValid={formValues.type && !errors.type}
                                    />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <MdFormatListNumberedRtl size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Direction"
                                        value={formValues.serial || ""}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, serial: e.target.value })
                                        }
                                        placeholder="Enter Serial Number"
                                        aria-label="capacity"
                                        isInvalid={!!errors.serial}
                                        isValid={formValues.serial && !errors.serial}
                                    />
                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="employeeTypeId">
                                        <IoLayersOutline size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.section}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, section: e.target.value })
                                        }
                                        required
                                        isInvalid={!!errors.section}
                                    >
                                        {section?.map(section => (
                                            <option key={section.sectionId} value={section.floorName}>
                                                {section.floorName}
                                            </option>
                                        ))}
                                    </Form.Select>

                                </InputGroup>

                            </Col>
                        </Row>

                        <Row>


                            <Col md={6} className='d-flex gap-2 align-items-center'>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text>
                                        <GiTable size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.tableShapes}
                                        onChange={(e) => setFormValues({ ...formValues, tableShapes: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Table Shape</option>
                                        <option value="Round">Round</option>
                                        <option value="Square">Square</option>
                                        <option value="Oval">Oval</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>

                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="isActive">
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        id="custom-checkbox"
                                        label="IsActive"
                                        name="isActive"

                                        className="ms-3"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '1rem',
                                        }}
                                        custom="true"
                                    >
                                        <Form.Check.Input
                                            className="custom-yellow-checkbox"
                                            type="checkbox"
                                            onChange={(e) =>
                                                setFormValues({ ...formValues, isActive: e.target.checked })
                                            }
                                            checked={formValues.isActive}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                cursor: "pointer",
                                                marginRight: "8px",
                                            }}
                                        />
                                        <Form.Check.Label htmlFor="custom-checkbox">
                                            Is Active
                                        </Form.Check.Label>
                                    </Form.Check>
                                </InputGroup>
                            </Col>

                        </Row>

                        <div className="d-flex justify-content-center mt-4" onClick={(e) => handleSubmit(e)}>
                            <Button type="submit" variant="warning">
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas
                show={expoShow}
                onHide={handleExpoClose}
                backdrop="static"
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add File
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="itemGroupName">
                                <FaRegFile size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="file"

                            />
                        </InputGroup>
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default TablePage;
