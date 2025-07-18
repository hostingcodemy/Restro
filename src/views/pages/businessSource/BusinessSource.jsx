import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Spinner } from "react-bootstrap";
import { MdDeleteForever, MdFormatListNumbered, MdOutlineDiscount } from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
}
    from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';

const BusinessSource = () => {

    const fetchCalled = useRef(false);

    const initialValues = {
        BusinessSourceId: "",
        BusinessSourceName: "",
        BusinessSourceTypeId: "",
        CommisionOnSubTotal: "",
        CommisionOnTotal: "",
        CommisionOnSubtotalMinusDiscount: "",
        ContactPersonId: "",
        OutletId: "",
        IsActive: true,
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
    const [busiSourceData, setBusiSourceData] = useState([]);
    const [busiSourceTypeData, setBusiSourceTypeData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const searchParam = ["BusinessSourceName", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
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
        fetchBusinessSourceTypeData();
        fetchCustomerData();
    };

    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchBusinessSourceData();
    }, []);

    const fetchBusinessSourceData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/businesssource`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setBusiSourceData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessSourceTypeData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/businesssourcetype`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setBusiSourceTypeData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const res = await api.get(`/customers`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setCustomerData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get("/itemgroups/exportexcel", {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "itemGroup.xlsx");
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
        const { BusinessSourceName } = formValues;
        const errors = {};
        let isValid = true;

        if (!BusinessSourceName) {
            isValid = false;
            errors.BusinessSourceName = "Business Source name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(BusinessSourceName)) {
            errors.BusinessSourceName = 'Name must contain only letters';
            isValid = false;
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
            BusinessSourceId: row.BusinessSourceId,
            BusinessSourceName: row.BusinessSourceName,
            BusinessSourceTypeId: row.BusinessSourceTypeId,
            CommisionOnSubTotal: row.CommisionOnSubTotal,
            CommisionOnTotal: row.CommisionOnTotal,
            CommisionOnSubtotalMinusDiscount: row.CommisionOnSubtotalMinusDiscount,
            ContactPersonId: row.ContactPersonId,
            OutletId: row.OutletId,
            IsActive: row.IsActive
        });
        setShow(true);
    };

    const handleDeleteClick = (BusinessSourceId, BusinessSourceName) => {
        setToDelete({ id: BusinessSourceId, name: BusinessSourceName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/businesssource/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Business source deleted successfully!");
                fetchBusinessSourceData();
            })
            .catch((error) => {
                console.error("Error deleting group:", error);
                toast.error("Failed to delete group.");
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
            name: <h5>Business Source Name</h5>,
            selector: (row) => row.BusinessSourceName,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <span style={{
                    color: row.isActive ? "#88E788" : "#FF474C",
                    fontWeight: "bold",
                }}>
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
                    <Link className="action-icon"
                        onClick={(e) => {
                            e.preventDefault();
                            handleEditClick(row);
                        }}
                        title='Edit'
                    >
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.BusinessSourceId, row.BusinessSourceName)} title='Delete'>
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
            BusinessSourceName: formValues.BusinessSourceName,
            BusinessSourceTypeId: formValues.BusinessSourceTypeId,
            CommisionOnSubTotal: formValues.CommisionOnSubTotal,
            CommisionOnTotal: formValues.CommisionOnTotal,
            CommisionOnSubtotalMinusDiscount: formValues.CommisionOnSubtotalMinusDiscount,
            ContactPersonId: formValues.ContactPersonId,
            OutletId: formValues.OutletId,
            IsActive: formValues.IsActive
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/businesssource/${formValues.BusinessSourceId}`, payload);
            } else {
                res = await api.post("/businesssource", payload);
            }
            handleClose();
            fetchBusinessSourceData();
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
                        <DataTable
                            className='DataTable'
                            columns={columns}
                            data={DataTableSettings.filterItems(busiSourceData, searchParam, filterText)}
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
                            {isEditMode ? "Edit Business Source" : "Add Business Source"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id='BusinessSourceName'>
                                <IoIosBusiness size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="BusinessSourceName"
                                value={formValues.BusinessSourceName}
                                onChange={(e) => handleChange("BusinessSourceName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                                placeholder="Business source name"
                                isInvalid={!!errors.BusinessSourceName}
                                isValid={formValues.BusinessSourceName && !errors.BusinessSourceName}
                            />
                            {errors.BusinessSourceName && <span className="error-msg">{errors.BusinessSourceName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <IoIosBusiness size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Select
                                name="BusinessSourceTypeId"
                                value={formValues.BusinessSourceTypeId || ""}
                                onChange={(e) => handleChange("BusinessSourceTypeId", e.target.value)}
                            >
                                <option value="">Select business type</option>
                                {busiSourceTypeData?.map((item) => (
                                    <option key={item.BusinessSourceTypeId} value={item.BusinessSourceTypeId}>
                                        {item.BusinessSourceTypeName}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.BusinessSourceTypeId && <span className="error-msg">{errors.BusinessSourceTypeId}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="CommisionOnSubTotal">
                                <MdFormatListNumbered size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="CommisionOnSubTotal"
                                placeholder='Sub Total'
                                value={formValues.CommisionOnSubTotal || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        handleChange("CommisionOnSubTotal", value);
                                    }
                                }}
                            />
                            {errors.CommisionOnSubTotal && <span className="error-msg">{errors.CommisionOnSubTotal}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="CommisionOnTotal">
                                <MdFormatListNumbered size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="CommisionOnTotal"
                                placeholder='On Total'
                                value={formValues.CommisionOnTotal || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        handleChange("CommisionOnTotal", value);
                                    }
                                }}
                            />
                            {errors.CommisionOnTotal && <span className="error-msg">{errors.CommisionOnTotal}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="CommisionOnSubtotalMinusDiscount">
                                <MdOutlineDiscount size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="CommisionOnSubtotalMinusDiscount"
                                placeholder='Sub total Minus Discount'
                                value={formValues.CommisionOnSubtotalMinusDiscount || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        handleChange("CommisionOnSubtotalMinusDiscount", value);
                                    }
                                }}
                            />
                            {errors.CommisionOnSubtotalMinusDiscount && <span className="error-msg">{errors.CommisionOnSubtotalMinusDiscount}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <IoPersonOutline size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Select
                                name="ContactPersonId"
                                value={formValues.ContactPersonId || ""}
                                onChange={(e) => handleChange("ContactPersonId", e.target.value)}
                            >
                                <option value="">Select contact person</option>
                                {customerData?.map((item) => (
                                    <option key={item.BusinessSourceTypeId} value={item.BusinessSourceTypeId}>
                                        {item.BusinessSourceTypeName}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.ContactPersonId && <span className="error-msg">{errors.ContactPersonId}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <TbHandClick size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Check
                                type="checkbox"
                                label="IsActive"
                                checked={formValues.IsActive}
                                onChange={(e) => handleChange("IsActive", e.target.checked)}
                                className="ms-3"
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
    )
}

export default BusinessSource
