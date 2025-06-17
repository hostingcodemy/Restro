import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Spinner } from "react-bootstrap";
import { MdDeleteForever, MdFormatListNumbered, MdOutlineMergeType } from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
}
    from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { IoMdColorPalette } from "react-icons/io";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';
import { PiMicrophoneThin } from "react-icons/pi";

const FacilityStatus = () => {

    const nameRef = useRef(null);
    const searchInputRef = useRef(null);
    const fetchCalled = useRef(false);

    const handleFocus = (e) => {
        setFocusedField(e.target.name);
    };

    const handleBlur = (e) => {
        setFocusedField(null);
    };

    const initialValues = {
        facilityStatusId: "",
        facilityStatus: "",
        facilityType: "",
        colour: "",
        sequence: "",
        isActive: true,
    };

    const initialImpValues = {
        File: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [facilityData, setFacilityData] = useState([]);
    const searchParam = ["facilityStatus", "facilityType", "sequence", "colour", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const handleClose = () => {
        setShow(false);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
        setFocusedField(null);
    };

    const handleShow = () => {
        setFormValues(initialValues);
        setIsEditMode(false);
        setErrors({});
        setShow(true);
        setTimeout(() => {
            if (nameRef.current) {
                nameRef.current.focus();
            }
        }, 1000);
    };

    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchFacilityData();
    }, []);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const fetchFacilityData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/facilitystatus`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setFacilityData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get("/facilitystatus/exportexcel", {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Facilitystatus.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the file:", error);
            alert("Failed to export file.");
        }
    };

    const handleChange = (name, value) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleImpChange = (name, value) => {
        setFormImpValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setImpErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const { facilityType, facilityStatus, colour, sequence } = formValues;
        const errors = {};
        let isValid = true;

        if (!facilityType) {
            isValid = false;
            errors.facilityType = "Facility type is required.";
        } else if (!/^[a-zA-Z ]+$/.test(facilityType)) {
            errors.facilityType = 'Name must contain only letters';
            isValid = false;
        }
        if (!facilityStatus) {
            isValid = false;
            errors.facilityStatus = "Facility status is required.";
        } else if (!/^[a-zA-Z ]+$/.test(facilityStatus)) {
            errors.facilityStatus = 'Name must contain only letters';
            isValid = false;
        }
        if (!colour) {
            isValid = false;
            errors.colour = "Colour is required.";
        }
        if (!sequence) {
            isValid = false;
            errors.sequence = "Sequence is required.";
        } else if (!/^\d+$/.test(sequence)) {
            isValid = false;
            errors.sequence = "Sequence must be a number.";
        }

        setErrors(errors);
        return isValid;
    };

    const validateImpForm = () => {
        const { File } = formImpValues;
        const errors = {};
        let isValid = true;

        if (!File) {
            isValid = false;
            errors.File = "Import file is required.";
        } else if (
            File.type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            isValid = false;
            errors.File = "Only .xlsx files are allowed.";
        }

        setImpErrors(errors);
        return isValid;
    };

    const handleEditClick = (row) => {
        setIsEditMode(true);
        setFormValues({
            facilityStatusId: row.facilityStatusId,
            facilityStatus: row.facilityStatus,
            prefix: row.prefix,
            colour: row.colour,
            sequence: row.sequence,
            facilityType: row.facilityType,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (facilityStatusId, facilityStatus) => {
        setToDelete({ id: facilityStatusId, name: facilityStatus });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/facilitystatus/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Facility status deleted successfully!");
                fetchFacilityData();
            })
            .catch((error) => {
                console.error("Error deleting facility status:", error);
                toast.error("Failed to delete facility status.");
            })
            .finally(() => {
                setLoading(false);
                setConfirmOpen(false);
                setToDelete(null);
            });
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setToDelete(null);
    };

    const columns = [
        {
            name: <h5>Facility Type</h5>,
            selector: (row) => row.facilityType,
            sortable: true,
        },
        {
            name: <h5>Facility Status</h5>,
            selector: (row) => row.facilityStatus,
            sortable: true,
        },
        {
            name: <h5>Colour</h5>,
            selector: row => row.colour,
            sortable: true,
            cell: row => (
                <div
                    style={{
                        backgroundColor: row.colour,
                        color: "#fff",
                        padding: "10px 8px",
                        borderRadius: "4px",
                        textTransform: "capitalize",
                        display: "inline-block",
                        minWidth: "60px",
                        textAlign: "center"
                    }}
                >
                </div>
            ),
        },
        {
            name: <h5>Sequence</h5>,
            selector: (row) => row.sequence,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            selector: row => row.isActive,
            cell: (row) => (
                <span style={{
                    color: row.isActive ? "#88E788" : "#FF474C",
                    fontWeight: "bold",
                }}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
            sortable: true,
            sortFunction: (a, b) => {
                return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
            }
        },
        {
            name: <h5>Action</h5>,
            center: true,
            cell: (row) => (
                <>
                    <Link className="action-icon" onClick={() => handleEditClick(row)} title="Edit">
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link
                        className="action-icon"
                        onClick={() => handleDeleteClick(row.facilityStatusId, row.facilityStatus)}
                        title="Delete"
                    >
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => (
        <div className="d-flex justify-content-end gap-2 align-items-center w-100">
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search..."
                    className="me-2 rounded-pill"
                    aria-label="Search"
                    onChange={(e) => setFilterText(e.target.value)}
                    ref={searchInputRef}
                />
            </Form>
            <PiMicrophoneThin size={30} color="yellow" />
            <Button variant="info" onClick={handleExpoShow}>
                <CiExport size={20} /> Import
            </Button>
            <Button variant="success" onClick={downloadExcel}>
                <CiImport size={20} /> Export
            </Button>
            <Button variant="warning" onClick={handleShow}>
                <GoPlus size={20} /> Add
            </Button>
        </div>
    ), [filterText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            facilityStatus: formValues.facilityStatus,
            prefix: formValues.prefix,
            facilityType: formValues.facilityType,
            colour: formValues.colour,
            sequence: parseInt(formValues.sequence, 10),
            isActive: formValues.isActive,
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/facilitystatus/${formValues.facilityStatusId}`, payload);
            } else {
                res = await api.post("/facilitystatus", payload);
            }
            handleClose();
            fetchFacilityData();
            toast.success(res.data.successMessage || "Success!");
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImpSubmit = async (e) => {
        e.preventDefault();
        if (!validateImpForm()) return;

        const formData = new FormData();
        formData.append("File", formImpValues.File);

        setLoading(true);
        try {
            const res = await api.post("/facilitystatus/importexcel", formData);

            toast.success(res.data.successMessage || "File uploaded successfully!");
            handleExpoClose();
            setFormImpValues(initialImpValues);
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
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
                                    <strong>{toDelete?.name}</strong>?
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
                            data={DataTableSettings.filterItems(facilityData, searchParam, filterText)}
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

            <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="false" style={{ "--bs-offcanvas-width": "800px" }}>
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Facility status" : "Add Facility status"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <HiOutlineStatusOnline size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="facilityStatus"
                                ref={nameRef}
                                value={formValues.facilityStatus}
                                onChange={(e) => handleChange("facilityStatus", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                                placeholder="Facility status"
                                isInvalid={!!errors.facilityStatus}
                                isValid={formValues.facilityStatus && !errors.facilityStatus}
                                autoComplete='off'
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            {errors.facilityStatus && <span className="error-msg">{errors.facilityStatus}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <MdOutlineMergeType size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="facilityType"
                                value={formValues.facilityType}
                                onChange={(e) => handleChange("facilityType", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                                placeholder="Facility type"
                                isInvalid={!!errors.facilityType}
                                isValid={formValues.facilityType && !errors.facilityType}
                                autoComplete='off'
                                readOnly={isEditMode}
                            />
                            {errors.facilityType && <span className="error-msg">{errors.facilityType}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <IoMdColorPalette size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="color"
                                name="colour"
                                value={formValues.colour}
                                onChange={(e) => handleChange("colour", e.target.value)}
                                placeholder="Colour"
                                isInvalid={!!errors.colour}
                                isValid={formValues.colour && !errors.colour}
                            />
                            {errors.colour && <span className="error-msg">{errors.colour}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <MdFormatListNumbered size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="sequence"
                                value={formValues.sequence}
                                onChange={(e) => handleChange("sequence", e.target.value.replace(/\D/g, ""))}
                                placeholder="Sequence"
                                isInvalid={!!errors.sequence}
                                isValid={formValues.sequence && !errors.sequence}
                                autoComplete='off'
                            />
                            {errors.sequence && <span className="error-msg">{errors.sequence}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <TbHandClick size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Check
                                type="checkbox"
                                label="IsActive"
                                checked={formValues.isActive}
                                onChange={(e) => handleChange("isActive", e.target.checked)}
                                className="ms-3"
                                style={{
                                    transform: "scale(1.5)",
                                    transformOrigin: "left center",
                                    marginTop: "5px"
                                }}
                            />
                        </InputGroup>
                        <div className="d-flex justify-content-center mt-4">
                            <Button type="submit" variant="warning">
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={expoShow} onHide={handleExpoClose} backdrop="static" placement="end">
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add File
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <FaRegFile size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="file"
                                accept=".xlsx"
                                name='File'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    handleImpChange("File", file);
                                }}
                            />
                            {impErrors.File && <span className="error-msg">{impErrors.File}</span>}
                        </InputGroup>
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning" onClick={handleImpSubmit}>Save</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default FacilityStatus;

