import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
    FaRegEdit, FaRegFile, FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { MdOutlinePriceCheck } from "react-icons/md";
import { Spinner } from 'react-bootstrap';

const Tax = () => {

    const initialValues = {
        taxId: "",
        taxName: "",
        taxRate: "",
        fromAmount: "",
        toAmount: "",
        restrictedFrom: "",
        restrictedTo: "",
    };

    const initialImpValues = {
        File: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const location = useLocation();
    const [permissions, setPermissions] = useState({});
    useEffect(() => {
        if (location.state?.permissions) {
            setPermissions(location.state.permissions);
        }
    }, [location.state?.permissions]);
    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [taxData, setTaxData] = useState([]);
    const searchParam = ["taxName", "taxRate", "isActive"];
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
        fetchTaxData();
    }, []);

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

    const fetchTaxData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tax`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setTaxData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const { taxName, taxRate, fromAmount, toAmount, restrictedFrom, restrictedTo } = formValues;
        const errors = {};
        let isValid = true;

        if (!taxName) {
            isValid = false;
            errors.taxName = "Tax name is required.";
        }
        if (!taxRate) {
            isValid = false;
            errors.taxRate = "Tax rate is required.";
        }
        if (!fromAmount) {
            isValid = false;
            errors.fromAmount = "From Amount is required.";
        }
        if (!toAmount) {
            isValid = false;
            errors.toAmount = "To Amount is required.";
        }
        if (!restrictedFrom) {
            isValid = false;
            errors.restrictedFrom = "Restricted From is required.";
        }
        if (!restrictedTo) {
            isValid = false;
            errors.restrictedTo = "Restricted To is required.";
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
            taxId: row.taxId,
            taxName: row.taxName,
            taxRate: row.taxRate,
            fromAmount: row.fromAmount,
            toAmount: row.toAmount,
            restrictedFrom: row.restrictedFrom,
            restrictedTo: row.restrictedTo,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (taxId, taxName) => {
        setToDelete({ id: taxId, name: taxName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/taxs/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Tax deleted successfully!");
                fetchTaxData();
            })
            .catch((error) => {
                console.error("Error deleting tax:", error);
                toast.error("Failed to delete tax.");
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
            name: <h5>Tax Name</h5>,
            selector: (row) => row.taxName,
            sortable: true,
        },
        {
            name: <h5>Tax Rate</h5>,
            selector: (row) => row.taxRate,
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
                    {permissions?.write && (
                        <Link className="action-icon" onClick={() => handleEditClick(row)}>
                            <FaRegEdit size={24} color="#87CEEB" />
                        </Link>
                    )}
                    {permissions?.delete && (
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.taxId, row.taxName)}>
                            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                        </Link>
                    )}
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
            {permissions?.import && (
                <Button variant="info" onClick={handleExpoShow}>
                    <CiExport size={20} /> Import
                </Button>
            )}
            {permissions?.export && (
                <Button variant="success">
                    <CiImport size={20} /> Export
                </Button>
            )}
            {permissions?.write && (
                <Button variant="warning" onClick={handleShow}>
                    <GoPlus size={20} /> Add
                </Button>
            )}
        </div>
    ), [permissions, filterText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            taxName: formValues.taxName,
            taxRate: formValues.taxRate,
            fromAmt: formValues.fromAmt,
            toAmt: formValues.toAmt,
            restrictedFrom: formValues.restrictedFrom,
            restrictedTo: formValues.restrictedTo,
            isActive: formValues.isActive,
        };
        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/tax/${formValues.taxId}`, payload);
            } else {
                res = await api.post("/tax", payload);
            }
            setFormValues(initialValues);
            setIsEditMode(false);
            handleClose();
            fetchTaxData();
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
            const res = await api.post("/tax/importexcel", formData);

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
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    taxData,
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
                            {isEditMode ? "Edit Tax" : "Add Tax"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="taxName">
                                <HiOutlineReceiptTax size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="taxName"
                                value={formValues.taxName || ""}
                                onChange={(e) => handleChange("taxName", e.target.value)}
                                placeholder="Tax name"
                                aria-label="taxName"
                                isInvalid={!!errors.taxName}
                                isValid={formValues.taxName && !errors.taxName}
                            />
                            {errors.taxName && <span className="error-msg">{errors.taxName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="taxRate">
                                <MdOutlinePriceCheck size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="taxRate"
                                value={formValues.taxRate || ""}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        handleChange("taxRate", e.target.value);
                                    }
                                }}
                                placeholder="Tax rate"
                                aria-label="taxRate"
                                isInvalid={!!errors.taxRate}
                                isValid={formValues.taxRate && !errors.taxRate}
                            />
                            {errors.taxRate && <span className="error-msg">{errors.taxRate}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="fromAmount">
                                <MdOutlinePriceCheck size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="fromAmount"
                                value={formValues.fromAmount || ""}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        handleChange("fromAmount", e.target.value);
                                    }
                                }}
                                placeholder="From amount"
                                aria-label="fromAmount"
                                isInvalid={!!errors.fromAmount}
                                isValid={formValues.fromAmount && !errors.fromAmount}
                            />
                            {errors.fromAmount && <span className="error-msg">{errors.fromAmount}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="toAmount">
                                <MdOutlinePriceCheck size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="toAmount"
                                value={formValues.toAmount || ""}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        handleChange("toAmount", e.target.value);
                                    }
                                }}
                                placeholder="To amount"
                                aria-label="toAmount"
                                isInvalid={!!errors.toAmount}
                                isValid={formValues.toAmount && !errors.toAmount}
                            />
                            {errors.toAmount && <span className="error-msg">{errors.toAmount}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="restrictedFrom">
                                <MdOutlinePriceCheck size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="restrictedFrom"
                                value={formValues.restrictedFrom || ""}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        handleChange("restrictedFrom", e.target.value);
                                    }
                                }}
                                placeholder="Restricted From"
                                aria-label="restrictedFrom"
                                isInvalid={!!errors.restrictedFrom}
                                isValid={formValues.restrictedFrom && !errors.restrictedFrom}
                            />
                            {errors.restrictedFrom && <span className="error-msg">{errors.restrictedFrom}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="restrictedTo">
                                <MdOutlinePriceCheck size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="restrictedTo"
                                value={formValues.restrictedTo || ""}
                                onChange={(e) => {
                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                        handleChange("restrictedTo", e.target.value);
                                    }
                                }}
                                placeholder="Restricted To"
                                aria-label="restrictedTo"
                                isInvalid={!!errors.restrictedTo}
                                isValid={formValues.restrictedTo && !errors.restrictedTo}
                            />
                            {errors.restrictedTo && <span className="error-msg">{errors.restrictedTo}</span>}
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

export default Tax
