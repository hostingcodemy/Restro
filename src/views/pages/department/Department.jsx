import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup } from "react-bootstrap";
import { MdDeleteForever, MdOutlinePersonOutline } from "react-icons/md";
import {
    FaRegEdit, FaCodeBranch, FaRegFile, FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';

const Department = () => {
  
    const fetchCalled = useRef(false);

    const initialValues = {
        deptId: "",
        deptName: "",
        deptShortName: "",
        isActive: false,
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
    const [departmentData, setDepartmentData] = useState([]);
    const searchParam = ["deptName", "deptShortName", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const handleClose = () => {
        setShow(false);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
    };

    const handleShow = () => {
        setFormValues(initialValues);
        setIsEditMode(false);
        setErrors({});
        setShow(true);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchDeptData();
    }, []);

    const fetchDeptData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/department`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setDepartmentData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get("/department/exportexcel", {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "department.xlsx");
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
        setFormValues((prevValues) => ({
            ...prevValues,
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
        const { deptName, deptShortName } = formValues;
        const errors = {};
        let isValid = true;

        if (!deptName) {
            isValid = false;
            errors.deptName = "Department name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(deptName)) {
            errors.deptName = 'Name must contain only letters';
            isValid = false;
        }
        if (!deptShortName) {
            isValid = false;
            errors.deptShortName = "Short name is required.";
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
            deptId: row.deptId,
            deptName: row.deptName,
            deptShortName: row.deptShortName,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (deptId, deptName) => {
        setToDelete({ id: deptId, name: deptName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/department/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Department deleted successfully!");
                fetchDeptData();
            })
            .catch((error) => {
                console.error("Error deleting department:", error);
                toast.error("Failed to delete department.");
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
            name: <h5>Department Name</h5>,
            selector: (row) => row.deptName,
            sortable: true,
        },
        {
            name: <h5>Department short Name</h5>,
            selector: (row) => row.deptShortName,
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
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.deptId, row.deptName)}>
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
                />
            </Form>
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
            deptName: formValues.deptName,
            deptShortName: formValues.deptShortName,
            isActive: formValues.isActive
        };
        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/department/${formValues.deptId}`, payload);
            } else {
                res = await api.post("/department", payload);
            }
            setFormValues(initialValues);
            setIsEditMode(false);
            handleClose();
            fetchDeptData();
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
            toast.error(res.data.ErrorMessage || "Something went wrong! Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
            const res = await api.post("/itemgroups/importexcel", formData);

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
                        <div style={{ width: "100%" }}>
                            <DataTable
                                className='DataTable'
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    departmentData,
                                    searchParam,
                                    filterText
                                )}
                                pagination
                                paginationPerPage={DataTableSettings.paginationPerPage}
                                paginationRowsPerPageOptions={
                                    DataTableSettings.paginationRowsPerPageOptions
                                }
                                progressPending={loadingIndicator}
                                subHeader
                                fixedHeaderScrollHeight="400px"
                                subHeaderComponent={subHeaderComponentMemo}
                                persistTableHead
                            />
                        </div>
                    </div>
                </div>
            )}
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                style={{ "--bs-offcanvas-width": "800px" }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Department" : "Add Department"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="deptName">
                                <MdOutlinePersonOutline size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="deptName"
                                value={formValues.deptName || ""}
                                onChange={(e) =>
                                    handleChange("deptName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                }
                                placeholder="Department name"
                                aria-label="deptName"
                                isInvalid={!!errors.deptName}
                                isValid={formValues.deptName && !errors.deptName}
                                autoComplete='off'
                            />
                            {errors.deptName && <span className="error-msg">{errors.deptName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="deptShortName">
                                <FaCodeBranch size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Control
                                name="deptShortName"
                                value={formValues.deptShortName || ""}
                                onChange={(e) =>
                                    handleChange("deptShortName", e.target.value)
                                }
                                placeholder="Department short name"
                                aria-label="deptShortName"
                                isInvalid={!!errors.deptShortName}
                                isValid={formValues.deptShortName && !errors.deptShortName}
                                autoComplete='off'
                            />
                            {errors.deptShortName && <span className="error-msg">{errors.deptShortName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
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
                                    type="checkbox"
                                    checked={formValues.isActive}
                                    onChange={(e) => handleChange("isActive", e.target.checked)}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        marginRight: "8px",
                                    }}
                                />
                                <Form.Check.Label htmlFor="custom-checkbox">
                                    IsActive
                                </Form.Check.Label>
                            </Form.Check>
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
    )
}

export default Department;
