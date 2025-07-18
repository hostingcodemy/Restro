import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Spinner, Row, Col } from "react-bootstrap";
import { MdDeleteForever, MdOutlinePersonOutline } from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle,
    FaMicrophone,
    FaCode
}
    from "react-icons/fa";
import { FaRegObjectUngroup } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';

const ItemCategory = () => {

    const fetchCalled = useRef(false);
    const commonRef = useRef(null);
    const initialValues = {
        itemCategoryId: "",
        itemCategoryName: "",
        itemSubGroupId: "",
        itemCategoryCode: "",
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
    const [categoryData, setCategoryData] = useState([]);
    const [subGroupData, setSubGroupData] = useState([]);
    const searchParam = ["finYear", "finYearStartDate", "finYearEndDate", "isActive"];
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
        fetchSubGroupData();
    };

    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

    useEffect(() => {
        if (setShow && commonRef.current) {
            commonRef.current.focus();
        }
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchCategoryData();
    }, [setShow]);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/itemcategory`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setCategoryData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubGroupData = async () => {
        try {
            const res = await api.get("/itemsubgroups");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setSubGroupData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get("/itemcategory/exportexcel", {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "itemCategory.xlsx");
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
        const { itemCategoryName, itemSubGroupId, itemCategoryCode } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemCategoryName) {
            isValid = false;
            errors.itemCategoryName = "Category name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(itemCategoryName)) {
            errors.itemCategoryName = 'Name must contain only letters';
            isValid = false;
        }
        if (!itemSubGroupId) {
            isValid = false;
            errors.itemSubGroupId = "Sub group is required.";
        }
        if (!itemCategoryCode) {
            isValid = false;
            errors.itemCategoryCode = "Category code is required.";
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
            itemCategoryId: row.itemCategoryId,
            itemCategoryName: row.itemCategoryName,
            itemSubGroupId: row.itemSubGroupId,
            itemCategoryCode: row.itemCategoryCode,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (itemCategoryId, itemCategoryName) => {
        setToDelete({ id: itemCategoryId, name: itemCategoryName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/itemcategory/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Item category deleted successfully!");
                fetchCategoryData();
            })
            .catch((error) => {
                console.error("Error deleting fin year:", error);
                toast.error("Failed to delete fin year.");
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
            name: <h5>Category name</h5>,
            selector: (row) => row.itemCategoryName,
            sortable: true,
        },
        {
            name: <h5>Sub group name</h5>,
            selector: (row) => row.itemSubGroupName,
            sortable: true,
        },
        {
            name: <h5>Category code</h5>,
            selector: (row) => row.itemCategoryCode,
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
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.itemCategoryId, row.itemCategoryName)} title='Delete'>
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
            itemCategoryName: formValues.itemCategoryName,
            itemSubGroupId: formValues.itemSubGroupId,
            itemCategoryCode: formValues.itemCategoryCode,
            isActive: formValues.isActive
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/itemcategory/${formValues.itemCategoryId}`, payload);
            } else {
                res = await api.post("/itemcategory", payload);
            }
            handleClose();
            fetchCategoryData();
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
            const res = await api.post("/itemcategory/importexcel", formData);

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
                            data={DataTableSettings.filterItems(categoryData, searchParam, filterText)}
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
                            {isEditMode ? "Edit Category" : "Add Category"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='itemCategoryName'>
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Category name' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="itemCategoryName"
                                        ref={commonRef}
                                        value={formValues.itemCategoryName}
                                        onChange={(e) => handleChange("itemCategoryName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                                        placeholder="Category name"
                                        isInvalid={!!errors.itemCategoryName}
                                        isValid={formValues.itemCategoryName && !errors.itemCategoryName}
                                        autoComplete='off'
                                    />
                                    {errors.itemCategoryName && <span className="error-msg">{errors.itemCategoryName}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="itemSubGroupId">
                                        <FaRegObjectUngroup size={25} color='#ffc800' title="Sub group" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="itemSubGroupId"
                                        value={formValues.itemSubGroupId || ""}
                                        onChange={(e) => handleChange("itemSubGroupId", e.target.value)}
                                    >
                                        <option>Select sub group</option>
                                        {subGroupData?.map((item) => (
                                            <option key={item.itemSubGroupId} value={item.itemSubGroupId}>
                                                {item.itemSubGroupName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.itemSubGroupId && <span className="error-msg">{errors.itemSubGroupId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="itemCategoryCode">
                                        <FaCode size={25} color="#ffc800" title='Category code' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="itemCategoryCode"
                                        value={formValues.itemCategoryCode}
                                        onChange={(e) => handleChange("itemCategoryCode", e.target.value)}
                                        placeholder="Category code"
                                        isInvalid={!!errors.itemCategoryCode}
                                        isValid={formValues.itemCategoryCode && !errors.itemCategoryCode}
                                        autoComplete='off'
                                    />
                                    {errors.itemCategoryCode && <span className="error-msg">{errors.itemCategoryCode}</span>}
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
                                        label="IsActive"
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

export default ItemCategory
