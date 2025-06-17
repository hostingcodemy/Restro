import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Link } from 'react-router-dom';
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
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { FaCode } from "react-icons/fa";
import { Spinner } from 'react-bootstrap';

const ItemType = () => {

    const initialValues = {
        itemCategoryId: "",
        itemCategoryName: "",
        itemSubGroupId: "",
        itemCategoryCode: "",
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
    const [itemTypesData, setItemTypesData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [subGroupData, setSubGroupData] = useState([]);
    const searchParam = [
        "itemCategoryName",
        "itemSubGroupName",
        "itemCategoryCode",
        "isActive"
    ];
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);

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
        setLoading(false);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchItemTypeData();
    }, []);

    const fetchItemTypeData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/itemcategory");
            setItemTypesData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubGroupData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/itemsubgroups`);
            setSubGroupData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching subgroup data", error);
        } finally {
            setLoading(false);
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
        setFormValues({
            itemCategoryId: row.itemCategoryId,
            itemCategoryName: row.itemCategoryName,
            itemSubGroupId: row.itemSubGroupId,
            itemCategoryCode: row.itemCategoryCode,
            isActive: row.isActive,
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
        api.delete(`/itemtypes/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Category deleted successfully!");
                fetchItemTypeData();
            })
            .catch((error) => {
                console.error("Error deleting category:", error);
                toast.error("Failed to delete category.");
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
            name: <h5>Category Name</h5>,
            selector: (row) => row.itemCategoryName,
            sortable: true,
        },
        {
            name: <h5>Sub Group Name</h5>,
            selector: (row) => row.itemSubGroupName,
            sortable: true,
        },
        {
            name: <h5>Category Code</h5>,
            selector: (row) => row.itemCategoryCode,
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
                    <Link className="action-icon" onClick={() => handleEditClick(row)} >
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.itemCategoryId, row.itemCategoryName)}>
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

    const validateForm = () => {
        const {
            itemCategoryName,
            itemSubGroupId,
            itemCategoryCode,
        } = formValues;
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
            errors.itemSubGroupId = "Sub group name is required";
        }
        if (!itemCategoryCode) {
            isValid = false;
            errors.itemCategoryCode = "Category code is required";
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

        const payload = {
            itemCategoryName: formValues.itemCategoryName,
            itemSubGroupId: formValues.itemSubGroupId,
            itemCategoryCode: formValues.itemCategoryCode,
            isActive: formValues.isActive,
        };
        setLoading(true);
        try {
            let res;
            if (formValues.itemCategoryId) {
                res = await api.put(`/itemcategory/${formValues.itemCategoryId}`, payload);
            } else {
                res = await api.post("/itemcategory", payload);
            }
            setFormValues(initialValues);
            setIsEditMode(false);
            handleClose();
            fetchItemTypeData();
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
                        <div className="" style={{ width: "100%" }}>
                            <DataTable
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    itemTypesData,
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
                            {isEditMode ? "Edit Item Category" : "Add Item Category"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-100' onSubmit={handleSubmit}>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemCategoryName">
                                <VscTypeHierarchySub size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemCategoryName"
                                value={formValues.itemCategoryName || ""}
                                onChange={(e) =>
                                    handleChange("itemCategoryName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                }
                                placeholder="Category name"
                                aria-label="itemCategoryName"
                                isInvalid={!!errors.itemCategoryName}
                                isValid={formValues.itemCategoryName && !errors.itemCategoryName}
                            />
                            {errors.itemCategoryName && <span className="error-msg">{errors.itemCategoryName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemCategoryCode">
                                <FaCode size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemCategoryCode"
                                value={formValues.itemCategoryCode || ""}
                                onChange={(e) => handleChange("itemCategoryCode", e.target.value)}
                                placeholder="Category code"
                                aria-label="itemCategoryCode"
                                isInvalid={!!errors.itemCategoryCode}
                                isValid={formValues.itemCategoryCode && !errors.itemCategoryCode}
                            />
                            {errors.itemCategoryCode && <span className="error-msg">{errors.itemCategoryCode}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubGroupId">
                                <HiOutlineRectangleGroup size={25} color='#ffc800' />
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
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="IsActive">
                                <TbHandClick size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Check
                                type="checkbox"
                                id="custom-checkbox"
                                label="IsActive"
                                name="IsActive"

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

export default ItemType
