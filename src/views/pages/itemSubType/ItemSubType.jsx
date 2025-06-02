import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Link, useLocation } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import {
    FaRegEdit, FaRegFile, FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import { Form, Button, Offcanvas, InputGroup } from "react-bootstrap";
import api from '../../../config/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';
import { VscTypeHierarchySub } from "react-icons/vsc";
import { PiPassword } from "react-icons/pi";
import { TfiShortcode } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';

const ItemSubType = () => {

    const location = useLocation();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if (location.state?.permissions) {
            setPermissions(location.state.permissions);
        }
    }, [location.state?.permissions]);

    const initialValues = {
        itemSubCategoryID: "",
        itemSubCategoryName: "",
        itemSubCategoryCode: "",
        itemSubCategoryShortCode: "",
        itemSubGroupShortCode: "",
        itemCategoryId: "",
        itemSubCategoryImage: "",
        isActive: false,
    };

    const initialImpValues = {
        File: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [itemSubTypesData, setItemSubTypesData] = useState([]);
    const [itemTypesData, setItemTypesData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const searchParam = [
        "itemSubCategoryName",
        "itemCategoryName",
        "itemSubCategoryCode",
        "itemSubCategoryShortCode"
    ];
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchItemSubTypeData();
    }, []);

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
        fetchItemTypeData();
    };

    const fetchItemSubTypeData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/itemsubcategory");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setItemSubTypesData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchItemTypeData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/itemcategory");
            setItemTypesData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
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

    const handleEditClick = (row) => {
        setIsEditMode(true);
        fetchItemTypeData();
        setFormValues({
            itemSubCategoryID: row.itemSubCategoryID,
            itemSubCategoryName: row.itemSubCategoryName,
            itemSubCategoryCode: row.itemSubCategoryCode,
            itemSubCategoryShortCode: row.itemSubCategoryShortCode,
            itemSubGroupShortCode: row.itemSubGroupShortCode,
            itemCategoryId: row.itemCategoryId,
            isActive: row.isActive,
        });
        setShow(true);
    };

    const handleDeleteClick = (itemSubCategoryID, itemSubCategoryName) => {
        setToDelete({ id: itemSubCategoryID, name: itemSubCategoryName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/itemsubcategory/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Group deleted successfully!");
                fetchItemSubTypeData();
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
            name: <h5>Sub Category Name</h5>,
            selector: (row) => row.itemSubCategoryName,
            sortable: true,
        },
        {
            name: <h5>Category Name</h5>,
            selector: (row) => row.itemCategoryName,
            sortable: true,
        },
        {
            name: <h5>Sub Category Code</h5>,
            selector: (row) => row.itemSubCategoryCode,
            sortable: true,
        },
        {
            name: <h5> Short Code</h5>,
            selector: (row) => row.itemSubCategoryShortCode,
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
            name: <h5 style={{ fontSize: "0.9vw" }}>Action</h5>,
            center: true,
            cell: (row) => (
                <>
                    {permissions?.write && (
                        <Link className="action-icon" onClick={() => handleEditClick(row)} >
                            <FaRegEdit size={24} color="#87CEEB" />
                        </Link>
                    )}
                    {permissions?.delete && (
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.itemSubCategoryID, row.itemSubCategoryName)}>
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

    const validateForm = () => {
        const {
            itemSubCategoryName,
            itemSubCategoryCode,
            itemSubCategoryShortCode,
            itemSubGroupShortCode,
            itemCategoryId
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemSubCategoryName) {
            isValid = false;
            errors.itemSubCategoryName = "Sub category name is required.";
        }
        if (!itemSubCategoryCode) {
            isValid = false;
            errors.itemSubCategoryCode = "Sub category code is required.";
        }
        if (!itemSubCategoryShortCode) {
            isValid = false;
            errors.itemSubCategoryShortCode = "Sub category short code is required.";
        }
        if (!itemSubGroupShortCode) {
            isValid = false;
            errors.itemSubGroupShortCode = "Sub group short code is required.";
        }
        if (!itemCategoryId) {
            isValid = false;
            errors.itemCategoryId = "Category name is required.";
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true);
        const payload = {
            itemSubCategoryName: formValues.itemSubCategoryName,
            itemSubCategoryCode: formValues.itemSubCategoryCode,
            itemSubCategoryShortCode: formValues.itemSubCategoryShortCode,
            itemSubGroupShortCode: formValues.itemSubGroupShortCode,
            itemCategoryId: formValues.itemCategoryId,
            outletId: outletId,
            isActive: formValues.isActive,
        };

        try {
            let res;
            if (formValues.itemSubCategoryID) {
                res = await api.put(`/itemsubcategory/${formValues.itemSubCategoryID}`, payload);
            } else {
                res = await api.post("/itemsubcategory", payload);
            }
            setFormValues(initialValues);
            setIsEditMode(false);
            handleClose();
            fetchItemSubTypeData();
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
            const res = await api.post("/itemsubcategory/importexcel", formData);

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
                    <div className='p-4' style={{ width: "100vw" }}>
                        <div className="" style={{ width: "100%" }}>
                            <DataTable
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    itemSubTypesData,
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
                        <Offcanvas.Title style={{ fontSize: "25px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Item Sub Category" : "Add Item Sub Category"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-100' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubCategoryName">
                                <VscTypeHierarchySub size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemSubCategoryName"
                                value={formValues.itemSubCategoryName || ""}
                                onChange={(e) =>
                                    handleChange("itemSubCategoryName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                }
                                placeholder="Sub category name"
                                aria-label="itemSubCategoryName"
                                isInvalid={!!errors.itemSubCategoryName}
                                isValid={formValues.itemSubCategoryName && !errors.itemSubCategoryName}
                            />
                            {errors.itemSubCategoryName && <span className="error-msg">{errors.itemSubCategoryName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubCategoryCode">
                                <PiPassword size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemSubCategoryCode"
                                value={formValues.itemSubCategoryCode || ""}
                                onChange={(e) => handleChange("itemSubCategoryCode", e.target.value)}
                                placeholder="Sub category code"
                                aria-label="itemSubCategoryCode"
                                isInvalid={!!errors.itemSubCategoryCode}
                                isValid={formValues.itemSubCategoryCode && !errors.itemSubCategoryCode}
                            />
                            {errors.itemSubCategoryCode && <span className="error-msg">{errors.itemSubCategoryCode}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubCategoryShortCode">
                                <TfiShortcode size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemSubCategoryShortCode"
                                value={formValues.itemSubCategoryShortCode || ""}
                                onChange={(e) => handleChange("itemSubCategoryShortCode", e.target.value)}
                                placeholder="Sub category short code"
                                aria-label="itemSubCategoryShortCode"
                                isInvalid={!!errors.itemSubCategoryShortCode}
                                isValid={formValues.itemSubCategoryShortCode && !errors.itemSubCategoryShortCode}
                            />
                            {errors.itemSubCategoryShortCode && <span className="error-msg">{errors.itemSubCategoryShortCode}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubGroupShortCode">
                                <TfiShortcode size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemSubGroupShortCode"
                                value={formValues.itemSubGroupShortCode || ""}
                                onChange={(e) => handleChange("itemSubGroupShortCode", e.target.value)}
                                placeholder="Sub group short code"
                                aria-label="itemSubGroupShortCode"
                                isInvalid={!!errors.itemSubGroupShortCode}
                                isValid={formValues.itemSubGroupShortCode && !errors.itemSubGroupShortCode}
                            />
                            {errors.itemSubGroupShortCode && <span className="error-msg">{errors.itemSubGroupShortCode}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="itemCategoryId">
                                <CiViewList size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Select
                                name="itemCategoryId"
                                value={formValues.itemCategoryId || ""}
                                onChange={(e) => handleChange("itemCategoryId", e.target.value)}
                            >
                                <option>Select category name</option>
                                {itemTypesData?.map((item) => (
                                    <option key={item.itemGroupId} value={item.itemGroupId}>
                                        {item.itemCategoryName}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.itemCategoryId && <span className="error-msg">{errors.itemCategoryId}</span>}
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
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning">
                                {isEditMode ? "Update" : "Submit"}
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

export default ItemSubType
