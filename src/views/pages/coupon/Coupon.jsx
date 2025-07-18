import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Spinner, Row, Col } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle,
    FaRegCalendarAlt,
    FaMicrophone
}
    from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';
import { GrMoney } from "react-icons/gr";
import { RiCoupon2Line } from "react-icons/ri";

const Coupon = () => {

    const fetchCalled = useRef(false);
    const commonRef = useRef(null);

    const initialValues = {
        couponId: "",
        couponCode: "",
        couponValidFrom: "",
        couponValidTo: "",
        couponAmount: "",
        businessSourceId: "",
        couponOnAmount: "",
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
    const [couponData, setCuponData] = useState([]);
    const [busiSourceData, setBusiSourceData] = useState([]);
    const searchParam = ["couponCode", "couponAmount", "couponOnAmount", "isActive"];
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
        setLoading(false);
        fetchBusinessSourceData();
    };

    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

    useEffect(() => {
        if (setShow && commonRef.current) {
            commonRef.current.focus();
        }
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchCouponData();
    }, [setShow]);

    const fetchCouponData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/coupon`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setCuponData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessSourceData = async () => {
        try {
            const res = await api.get(`/businesssource`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setBusiSourceData(sortedData);
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

        if (name === "couponValidFrom" || name === "couponValidTo") {
            const fromRaw = name === "couponValidFrom" ? value : formValues.couponValidFrom;
            const toRaw = name === "couponValidTo" ? value : formValues.couponValidTo;

            if (fromRaw && toRaw) {
                const fromDate = parseDDMMYYYYHHMMSS(fromRaw);
                const toDate = parseDDMMYYYYHHMMSS(toRaw);

                if (fromDate && toDate && toDate < fromDate) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        couponValidTo: "Valid To date cannot be earlier than Valid From date.",
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        couponValidTo: "",
                    }));
                }
            }
        }
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
        const { couponCode, couponValidFrom, couponValidTo, couponAmount } = formValues;
        const errors = {};
        let isValid = true;

        if (!couponCode) {
            isValid = false;
            errors.couponCode = "Coupon code is required.";
        }
        if (!couponValidFrom) {
            isValid = false;
            errors.couponValidFrom = "Coupon valid form is required.";
        }
        if (!couponValidTo) {
            isValid = false;
            errors.couponValidTo = "Coupon valid to is required.";
        }
        if (couponValidFrom && couponValidTo) {
            const fromDate = new Date(couponValidFrom);
            const toDate = new Date(couponValidTo);

            if (toDate < fromDate) {
                isValid = false;
                errors.couponValidTo = "Valid To date cannot be earlier than Valid From date.";
            }
        }
        if (!couponAmount) {
            isValid = false;
            errors.couponAmount = "Coupon amount is required.";
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
            couponId: row.couponId,
            couponCode: row.couponCode,
            couponValidFrom: row.couponValidFrom,
            couponValidTo: row.couponValidTo,
            couponAmount: row.couponAmount,
            businessSourceId: row.businessSourceId,
            couponOnAmount: row.couponOnAmount,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (couponId, couponCode) => {
        setToDelete({ id: couponId, name: couponCode });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/coupon/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Coupon deleted successfully!");
                fetchCouponData();
            })
            .catch((error) => {
                console.error("Error deleting coupon:", error);
                toast.error("Failed to delete coupon.");
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
            name: <h5>Coupon Code</h5>,
            selector: (row) => row.couponCode,
            sortable: true,
        },
        {
            name: <h5>Business Source Name</h5>,
            selector: (row) => row.businessSourceName,
            sortable: true,
        },
        {
            name: <h5>Coupon Amount</h5>,
            selector: (row) => row.couponAmount,
            sortable: true,
        },
        {
            name: <h5>Coupon On Amount</h5>,
            selector: (row) => row.couponOnAmount,
            sortable: true,
        },
        {
            name: <h5>coupon Valid From</h5>,
            selector: (row) => row.couponValidFrom,
            sortable: true,
        },
        {
            name: <h5>coupon Valid To</h5>,
            selector: (row) => row.couponValidTo,
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
                        <FaRegEdit size={24} color="#87CEEB" title='Edit' />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.CouponId, row.couponCode)} title='Delete'>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" title='Delete' />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => (
        <div className="d-flex justify-content-end gap-2 align-items-center w-100">
            <div className="position-relative ">
                <Form.Control
                    type="search"
                    placeholder="Search..."
                    className="me-2 rounded-pill"
                    aria-label="Search"
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <FaMicrophone
                    size={20}
                    color="#ffc800"
                    style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer"
                    }}
                />
            </div>
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
            couponCode: formValues.couponCode,
            couponValidFrom: formValues.couponValidFrom,
            couponValidTo: formValues.couponValidTo,
            couponAmount: formValues.couponAmount,
            businessSourceId: formValues.businessSourceId,
            couponOnAmount: formValues.couponOnAmount,
            isActive: formValues.isActive
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/coupon/${formValues.couponId}`, payload);
            } else {
                res = await api.post("/coupon", payload);
            }
            handleClose();
            fetchCouponData();
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
                            data={DataTableSettings.filterItems(couponData, searchParam, filterText)}
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
                className="custom-offcanvas"
                onEntered={() => {
                    if (commonRef.current) {
                        commonRef.current.focus();
                    }
                }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Coupon" : "Add Coupon"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='couponCode'>
                                        <RiCoupon2Line size={25} color='#ffc800' title='Coupon Code' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="couponCode"
                                        ref={commonRef}
                                        value={formValues.couponCode}
                                        onChange={(e) => handleChange("couponCode", e.target.value)}
                                        placeholder="Coupon code"
                                        isInvalid={!!errors.couponCode}
                                        isValid={formValues.couponCode && !errors.couponCode}
                                    />
                                    {errors.couponCode && <span className="error-msg">{errors.couponCode}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponValidFrom">
                                        <FaRegCalendarAlt size={25} color="#ffc800" title='Coupon Valid From' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="datetime-local"
                                        name="couponValidFrom"
                                        value={
                                            formValues.couponValidFrom
                                                ? formatForInput(formValues.couponValidFrom)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const formatted = formatToDDMMYYYYHHMMSS(rawValue);
                                            handleChange("couponValidFrom", formatted);
                                        }}
                                    />
                                    {errors.couponValidFrom && <span className="error-msg">{errors.couponValidFrom}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponValidTo">
                                        <FaRegCalendarAlt size={25} color="#ffc800" title='Coupon Valid To' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="datetime-local"
                                        name="couponValidTo"
                                        value={
                                            formValues.couponValidTo
                                                ? formatForInput(formValues.couponValidTo)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const rawValue = e.target.value;
                                            const formatted = formatToDDMMYYYYHHMMSS(rawValue);
                                            handleChange("couponValidTo", formatted);
                                        }}
                                    />
                                    {errors.couponValidTo && <span className="error-msg">{errors.couponValidTo}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2 mt-3'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponAmount">
                                        <GrMoney size={25} color="#ffc800" title='Coupon Amount' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="couponAmount"
                                        placeholder='Coupon Amount'
                                        value={formValues.couponAmount || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange("couponAmount", value);
                                            }
                                        }}
                                    />
                                    {errors.couponAmount && <span className="error-msg">{errors.couponAmount}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponOnAmount">
                                        <GrMoney size={25} color="#ffc800" title='Coupon On Amount' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="couponOnAmount"
                                        placeholder='Coupon On Amount'
                                        value={formValues.couponOnAmount || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange("couponOnAmount", value);
                                            }
                                        }}
                                    />
                                    {errors.couponOnAmount && <span className="error-msg">{errors.couponOnAmount}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="businessSourceId">
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Business Source' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="businessSourceId"
                                        value={formValues.businessSourceId || ""}
                                        onChange={(e) => handleChange("businessSourceId", e.target.value)}
                                    >
                                        <option>Select business source</option>
                                        {busiSourceData?.map((item) => (
                                            <option key={item.businessSourceId} value={item.businessSourceId}>
                                                {item.businessSourceName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.businessSourceId && <span className="error-msg">{errors.businessSourceId}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" title='Active' />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="isActive"
                                        checked={formValues.isActive}
                                        onChange={(e) => handleChange("isActive", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-4">
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

export default Coupon
