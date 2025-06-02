import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import { Form, Button, Offcanvas, InputGroup, Row, Col } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit, FaCodeBranch, FaRegFile } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import DataTableSettings from '../../../helpers/DataTableSettings';
import { MdOutlinePersonOutline, MdOutlineLockPerson, MdSecurity, MdOutlineQuestionAnswer, MdOutlineWorkOutline } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsTelephone, BsCalendarDate, BsPersonRolodex, BsBuilding } from "react-icons/bs";
import { FaRegIdBadge, FaIdCardAlt } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { Spinner } from 'react-bootstrap';

const Employee = () => {

    const location = useLocation();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if (location.state?.permissions) {
            setPermissions(location.state.permissions);
        }
    }, [location.state]);

    const fetchCalled = useRef(false);
    const channelId = localStorage.getItem("channelId");

    const initialValues = {
        employeeID: "",
        psId: "",
        employeeName: "",
        password: "",
        email: "",
        mobile: "",
        joiningDate: "",
        deptId: "",
        empTypeId: "",
        empCode: "",
        isActive: false,
        securityQuestionId: "",
        securityAnswer: "",
        dob: "",
        anniversary: "",
        designation: "",
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [departmentData, setDepartmentData] = useState([]);
    const [employeeTypeData, setEmployeeTypeData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const searchParam = ["itemGroupName", "itemGroupCode", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
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
        fetchDepartmentData();
        fetchEmployeeTypeData();
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchEmployeeData();
    }, []);

    const fetchDepartmentData = async () => {
        try {
            const res = await api.get(`/department`);
            setDepartmentData(res?.data?.list);
        } catch (error) {
            setLoadingIndicator(false)
            console.error("Error fetching department data", error);
        }
    };

    const fetchEmployeeTypeData = async () => {
        try {
            const res = await api.get(`/employeetype`);
            setEmployeeTypeData(res?.data?.list);
        } catch (error) {
            setLoadingIndicator(false)
            console.error("Error fetching employee data", error);
        }
    };

    const fetchEmployeeData = async () => {
        try {
            const res = await api.get(`/employee`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setEmployeeData(sortedData);
        } catch (error) {
            setLoadingIndicator(false)
            console.error("Error fetching table data", error);
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
        const { employeeName, password, email, mobile } = formValues;
        const errors = {};
        let isValid = true;

        if (!employeeName) {
            isValid = false;
            errors.employeeName = "Group name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(employeeName)) {
            errors.employeeName = 'Name must contain only letters';
            isValid = false;
        }
        if (!password) {
            isValid = false;
            errors.password = "password is required.";
        } else if (password.length < 6) {
            errors.employeeName = 'Must be at least 6 characters';
            isValid = false;
        }

        if (!email.trim()) {
            isValid = false;
            errors.email = "Email is required.";
        } else if (!/^[a-zA-Z][^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }
        if (!mobile.trim()) {
            isValid = false;
            errors.mobile = "Mobile number is required.";

        } else if (!/^[0-9]{10}$/.test(mobile)) {
            errors.mobile = 'Phone must be 10 digits';
            isValid = false;
        }

        if (!formValues.joiningDate) {
            errors.joiningDate = "Joining date is required";
        } else {
            const selectedDate = new Date(formValues.joiningDate);
            const today = new Date();

            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                errors.joiningDate = "Joining date cannot be in the future";
            }
        }

        setErrors(errors);
        return isValid;
    };

    const handleEditClick = (row) => {
        setIsEditMode(true);
        setFormValues({
            employeeID: row.employeeID,
            psId: row.psid,
            employeeName: row.name,
            password: "",
            email: row.email,
            mobile: row.mobile,
            joiningDate: row.joiningDate,
            deptId: row.deptId,
            empTypeId: row.empTypeId,
            empCode: row.empCode,
            isActive: row.isActive,
            securityQuestionId: row.securityQuestionID,
            securityAnswer: row.answer,
            dob: row.dob,
            anniversary: row.doa,
            designation: row.designation,
        });
        setShow(true);
    };

    const handleDeleteClick = (employeeID, employeeName) => {
        setEmployeeToDelete({ id: employeeID, name: employeeName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!employeeToDelete) return;

        api.delete(`/employee/${employeeToDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Employee deleted successfully!");
                fetchEmployeeData();
            })
            .catch((error) => {
                console.error("Error deleting employee:", error);
                toast.error("Failed to delete employee.");
            })
            .finally(() => {
                setConfirmOpen(false);
                setEmployeeToDelete(null);
            });
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setEmployeeToDelete(null);
    };

    const columns = [
        {
            name: <h5>Joining Date</h5>,
            selector: (row) => {
                const date = new Date(row.joiningDate);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            },
            sortable: true,
        },
        {
            name: <h5>Name</h5>,
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: <h5>Email</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>Mobile Number</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },

        {
            name: <h5>Designation</h5>,
            selector: (row) => row.designation,
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
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.employeeID, row.name)}>
                            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                        </Link>
                    )}
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
                {permissions?.import && (
                    <Button variant="info"
                        onClick={handleExpoShow}
                    >
                        <CiExport size={20} style={{ marginTop: "-0.5vh" }} /> Import
                    </Button>
                )}
                {permissions?.export && (
                    <Button variant="success"
                    >
                        <CiImport size={20} style={{ marginTop: "-0.5vh" }} /> Export
                    </Button>
                )}
                {permissions?.write && (
                    <Button variant="warning" onClick={handleShow}>
                        <GoPlus size={20} style={{ marginTop: "-0.5vh" }} /> Add
                    </Button>
                )}
            </div>
        );
    }, [permissions, filterText]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payloadForPost = {
            channelID: channelId,
            psid: formValues.psId,
            name: formValues.employeeName,
            password: formValues.password,
            email: formValues.email,
            mobile: formValues.mobile,
            joiningDate: formValues.joiningDate,
            deptId: formValues.deptId,
            empTypeId: formValues.empTypeId,
            empCode: formValues.empCode,
            isActive: formValues.isActive,
        }


        const payloadForPut = {
            ...payloadForPost,
            securityQuestionID: formValues.securityQuestionId,
            answer: formValues.securityAnswer,
            dob: formValues.dob,
            doa: formValues.anniversary,
            designation: formValues.designation,
        }


        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/employee/${formValues.employeeID}`, payloadForPut);
            } else {
                res = await api.post("/employee", payloadForPost);
            }

            setFormValues(initialValues);
            setIsEditMode(false);
            handleClose();
            fetchEmployeeData();
            toast.success(res.data.successMessage || "Success!");
        } catch (error) {
            toast.error(
                error?.response?.data?.ErrorMessage || "Something went wrong! Please try again."
            );
        }

        fetchEmployeeData();
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
                                    <strong>{employeeToDelete?.name}</strong>?
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
                            data={DataTableSettings.filterItems(employeeData, searchParam, filterText)}
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
                            {isEditMode ? "Edit Employee" : "Add Employee"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body className='row' style={{ marginTop: "-2vh" }}>
                    <Form className='h-90 ' onSubmit={(e) => handleSubmit(e)}>
                        <Row>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="itemGroupName">
                                        <MdOutlinePersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="itemGroupName"
                                        value={formValues.employeeName || ""}
                                        onChange={(e) =>
                                            handleChange("employeeName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        placeholder="Employee name"
                                        aria-label="itemGroupName"
                                        isInvalid={!!errors.employeeName}
                                        isValid={formValues.employeeName && !errors.employeeName}
                                    />
                                    {errors.itemGroupName && <span className="error-msg">{errors.itemGroupName}</span>}
                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <MdOutlineLockPerson size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        name="Password"
                                        value={formValues.password || ""}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className={errors.password ? 'input-error' : ''}
                                        autoComplete="off"
                                        required
                                        placeholder="Password"
                                        isInvalid={!!errors.password}
                                        isValid={formValues.password && !errors.password}
                                    />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <MdOutlineMailOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={formValues.email}
                                        required
                                        placeholder="Email Address"
                                        isInvalid={!!errors.email}
                                        isValid={formValues.email && !errors.email}
                                        onChange={(e) => {
                                            const firstChar = e.target.value.charAt(0);
                                            if (!/[a-zA-Z]/.test(firstChar) && e.target.value.length > 0) {
                                                setErrors({ ...errors, email: 'Email must start with a letter' });
                                                return;
                                            } else {
                                                const updatedErrors = { ...errors };
                                                delete updatedErrors.email;
                                                setErrors(updatedErrors);
                                            }
                                            setFormValues({ ...formValues, email: e.target.value });
                                        }}
                                    />
                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <BsTelephone size={24} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={formValues.mobile}
                                        required
                                        placeholder="Mobile Number"
                                        isInvalid={!!errors.mobile}
                                        isValid={formValues.mobile && !errors.mobile}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, mobile: e.target.value.replace(/[^0-9]/g, '') })
                                        }
                                    />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup hasValidation className="mb-4">
                                    <InputGroup.Text>
                                        <BsCalendarDate size={24} color="#ffc800" />
                                    </InputGroup.Text>
                                    <DatePicker
                                        className="form-control"
                                        selected={formValues.joiningDate ? new Date(formValues.joiningDate) : null}
                                        onChange={(date) => setFormValues({ ...formValues, joiningDate: date.toISOString().split("T")[0] })}
                                        placeholderText="Joining Date"

                                    />

                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="psid">
                                        <FaRegIdBadge size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="psid"
                                        value={formValues.psId || ""}
                                        onChange={(e) =>
                                            handleChange("psId", e.target.value)
                                        }
                                        placeholder="Enter PS Id"
                                        aria-label="psid"
                                        isInvalid={!!errors.psId}
                                        isValid={formValues.psId && !errors.psId}
                                    />

                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="psid">
                                        <FaIdCardAlt size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="psid"
                                        value={formValues.empCode || ""}
                                        onChange={(e) =>
                                            handleChange("empCode", e.target.value)
                                        }
                                        placeholder="Enter EMP Code"
                                        aria-label="psid"
                                        isInvalid={!!errors.empCode}
                                        isValid={formValues.empCode && !errors.empCode}
                                    />

                                </InputGroup>

                            </Col>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="employeeTypeId">
                                        <BsPersonRolodex size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.empTypeId}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, empTypeId: e.target.value })
                                        }
                                        required
                                        isInvalid={!!errors.empTypeId}
                                    >
                                        <option value="">Select Employee Type</option>
                                        {employeeTypeData?.map((item) => (
                                            <option key={item.empTypeId} value={item.empTypeId}>
                                                {item.empTypeName}
                                            </option>
                                        ))}
                                    </Form.Select>

                                </InputGroup>
                            </Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="departmentId">
                                        <BsBuilding size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        value={formValues.deptId}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, deptId: e.target.value })
                                        }
                                        required
                                        isInvalid={!!errors.deptId}
                                    >
                                        <option value="">Select Department Type</option>
                                        {departmentData?.map((item) => (
                                            <option key={item.deptId} value={item.deptId}>
                                                {item.deptName}
                                            </option>
                                        ))}
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
                                            type="checkbox"
                                            className="custom-yellow-checkbox"
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
                                            IsActive
                                        </Form.Check.Label>
                                    </Form.Check>
                                </InputGroup>
                            </Col>

                        </Row>
                        {isEditMode && (
                            <>
                                <Row>
                                    <Col md={6}>
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text>
                                                <MdSecurity size={25} color="#ffc800" />
                                            </InputGroup.Text>
                                            <Form.Select
                                                value={formValues.securityQuestionId}
                                                onChange={(e) => setFormValues({ ...formValues, securityQuestionId: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Security Question</option>
                                                <option value="90">90</option>
                                                <option value="67">67</option>
                                                <option value="80">80</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col md={6}>
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text>
                                                <MdOutlineQuestionAnswer size={25} color="#ffc800" />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Your Answer"
                                                value={formValues.securityAnswer}
                                                onChange={(e) => setFormValues({ ...formValues, securityAnswer: e.target.value })}
                                                required
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text>
                                                <BsCalendarDate size={24} color="#ffc800" />
                                            </InputGroup.Text>
                                            <DatePicker
                                                className="form-control"
                                                selected={formValues.dob ? new Date(formValues.dob) : null}
                                                onChange={(date) => setFormValues({ ...formValues, dob: date.toISOString().split("T")[0] })}
                                                placeholderText="Date of Birth"
                                            />

                                        </InputGroup>
                                    </Col>
                                    <Col md={6}>
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text>
                                                <BsCalendarDate size={24} color="#ffc800" />
                                            </InputGroup.Text>
                                            <DatePicker
                                                className="form-control"
                                                selected={formValues.anniversary ? new Date(formValues.anniversary) : null}
                                                onChange={(date) => setFormValues({ ...formValues, anniversary: date.toISOString().split("T")[0] })}
                                                placeholderText="Date of Anniversary"
                                            />

                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <InputGroup className="mb-4">
                                            <InputGroup.Text>
                                                <MdOutlineWorkOutline size={25} color="#ffc800" />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Designation"
                                                value={formValues.designation}
                                                onChange={(e) => setFormValues({ ...formValues, designation: e.target.value })}
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </>
                        )}


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

export default Employee;
