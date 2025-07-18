import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../../config/AxiosInterceptor';
import { Form, Button, Offcanvas, InputGroup, Spinner, Row, Col } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
    FaRegEdit,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle,
    FaMicrophone
}
    from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import Select from 'react-select';

const TableReservationRate = () => {

    const fetchCalled = useRef(false);

    const initialValues = {
        tableTypeIds: [],
        outletIds: [],
        pax: "",
        time: "",
        amount: "",
        minAmount: "",
        isActive: true,
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [reversationData, setReversationData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const [tableTypeData, setTableTypeData] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const searchParam = ["tableTypeName", "outletName", "pax", "amount", "time", "minAmount"];

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
        fetchTableTypeData();
        fetchOutletData();
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchTableReservationData();
    }, []);

    const fetchTableReservationData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/maptablereservationrate`);
            const flatList = [];

            res?.data?.list?.forEach(item => {
                item.tableTypes?.forEach(tableType => {
                    tableType.outlets?.forEach(outlet => {
                        flatList.push({
                            tableTypeId: tableType.tableTypeId,
                            tableTypeName: tableType.tableTypeName,
                            outletId: outlet.outletId,
                            outletName: outlet.outletName,
                            pax: outlet.pax,
                            time: outlet.time,
                            amount: outlet.amount,
                            minAmount: outlet.minAmount,
                            isActive: outlet.isActive,
                            createdDate: outlet.createdDate,
                        });
                    });
                });
            });
            const sortedData = flatList.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );

            setReversationData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTableTypeData = async () => {
        try {
            const res = await api.get(`/tabletype`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setTableTypeData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const tableTypeOptions = useMemo(() => {
        return tableTypeData?.map(item => ({
            value: item.tableTypeId,
            label: item.tableTypeName,
        }));
    }, [tableTypeData]);


    const fetchOutletData = async () => {
        try {
            const res = await api.get("/outlets");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setOutletData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        }
    };

    const outletOptions = useMemo(() => {
        return outletData?.map(item => ({
            value: item.outletId,
            label: item.outletName,
        }));
    }, [tableTypeData]);

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

    const validateForm = () => {
        const { pax } = formValues;
        const errors = {};
        let isValid = true;

        if (!pax) {
            isValid = false;
            errors.pax = "Pax is required.";
        }

        setErrors(errors);
        return isValid;
    };

    // const handleEditClick = (row) => {
    //     setIsEditMode(true);
    //     setFormValues({
    //         SectionId: row.SectionId,
    //         pax: row.pax,
    //         TableTypeIds: row.TableTypeIds,
    //         isActive: row.isActive
    //     });
    //     setShow(true);
    // };

    // const handleDeleteClick = (SectionId, pax) => {
    //     setToDelete({ id: SectionId, name: pax });
    //     setConfirmOpen(true);
    // };

    // const confirmDelete = () => {
    //     if (!toDelete) return;

    //     setLoading(true);
    //     api.delete(`/section/${toDelete.id}`)
    //         .then((res) => {
    //             toast.success(res.data.successMessage || "Floor deleted successfully!");
    //             fetchSectionData();
    //         })
    //         .catch((error) => {
    //             console.error("Error deleting floor:", error);
    //             toast.error("Failed to delete floor.");
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //             setConfirmOpen(false);
    //             setToDelete(null);
    //         });
    // };

    // const cancelDelete = () => {
    //     setConfirmOpen(false);
    //     setToDelete(null);
    // };

    const columns = [
        {
            name: <h5>Table Type</h5>,
            selector: (row) => row.tableTypeName,
            sortable: true,
        },
        {
            name: <h5>Outlet Name</h5>,
            selector: (row) => row.outletName,
            sortable: true,
        },
        {
            name: <h5>pax</h5>,
            selector: (row) => row.pax,
            sortable: true,
        },
        {
            name: <h5>Time (hrs)</h5>,
            selector: (row) => row.time,
            sortable: true,
        },
        {
            name: <h5>Amount</h5>,
            selector: (row) => row.amount,
            sortable: true,
        },
        {
            name: <h5>Min Amount</h5>,
            selector: (row) => row.minAmount,
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
                    <Link className="action-icon"
                        onClick={() => handleDeleteClick(row.tableTypeId, row.pax)}
                        title='Delete'
                    >
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
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
            <Button variant="warning" onClick={handleShow}>
                <GoPlus size={20} /> Add
            </Button>
        </div>
    ), [filterText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            tableTypeIds: formValues.tableTypeIds,
            outletIds: formValues.outletIds,
            pax: formValues.pax,
            time: formValues.time,
            amount: formValues.amount,
            minAmount: formValues.minAmount,
            isActive: formValues.isActive
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/maptablereservationrate/${formValues.tableTypeIds}`, payload);
            } else {
                res = await api.post("/maptablereservationrate", payload);
            }
            handleClose();
            fetchTableReservationData();
            toast.success(res.data.successMessage || "Success!");
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
                            data={DataTableSettings.filterItems(reversationData, searchParam, filterText)}
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
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Table Reservation Rate" : "Add Table Reservation Rate"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90' onSubmit={handleSubmit}>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="tableTypeIds">
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Table Type' />
                                    </InputGroup.Text>
                                    <Select
                                        name="tableTypeIds"
                                        options={tableTypeOptions}
                                        value={tableTypeOptions.filter(opt => formValues.tableTypeIds?.includes(opt.value))}
                                        onChange={(selectedOptions) => handleChange("tableTypeIds", selectedOptions.map(opt => opt.value))}
                                        placeholder="Select table types"
                                        isMulti
                                        isClearable
                                    />
                                    {errors.tableTypeIds && <span className="error-msg">{errors.tableTypeIds}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="outletIds">
                                        <MdOutlinePersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Select
                                        name="tableTypeIds"
                                        options={outletOptions}
                                        value={outletOptions.filter(opt => formValues.outletIds?.includes(opt.value))}
                                        onChange={(selectedOptions) => handleChange("outletIds", selectedOptions.map(opt => opt.value))}
                                        placeholder="Select outlet"
                                        isMulti
                                        isClearable
                                    />
                                    {errors.outletIds && <span className="error-msg">{errors.outletIds}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='pax'>
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Pax' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="pax"
                                        value={formValues.pax}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange("pax", value);
                                            }
                                        }}
                                        placeholder="pax"
                                        isInvalid={!!errors.pax}
                                        isValid={formValues.pax && !errors.pax}
                                        autoComplete='off'
                                    />
                                    {errors.pax && <span className="error-msg">{errors.pax}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='time'>
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Time' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="time"
                                        value={formValues.time}
                                        onChange={(e) => handleChange("time", e.target.value)}
                                        placeholder="Time"
                                        isInvalid={!!errors.time}
                                        isValid={formValues.time && !errors.time}
                                        autoComplete='off'
                                    />
                                    {errors.time && <span className="error-msg">{errors.time}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='amount'>
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Amount' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="amount"
                                        value={formValues.amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange("amount", value);
                                            }
                                        }}
                                        placeholder="Amount"
                                        isInvalid={!!errors.amount}
                                        isValid={formValues.amount && !errors.amount}
                                        autoComplete='off'
                                    />
                                    {errors.amount && <span className="error-msg">{errors.amount}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id='minAmount'>
                                        <MdOutlinePersonOutline size={25} color='#ffc800' title='Min Amount' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="minAmount"
                                        value={formValues.minAmount}
                                        onChange={(e) => handleChange("minAmount", e.target.value)}
                                        placeholder="Min Amount"
                                        isInvalid={!!errors.minAmount}
                                        isValid={formValues.minAmount && !errors.minAmount}
                                        autoComplete='off'
                                    />
                                    {errors.minAmount && <span className="error-msg">{errors.minAmount}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
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
        </>
    )
}

export default TableReservationRate
