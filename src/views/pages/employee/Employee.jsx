import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import {
    Form,
    Button,
    Offcanvas,
    InputGroup,
    Row,
    Col,
    Accordion,
    Modal
}
    from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit, FaRegFile, FaSearch } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import DataTableSettings from '../../../helpers/DataTableSettings';
import {
    MdOutlinePersonOutline,
    MdOutlineLockPerson,
    MdSecurity,
    MdOutlineQuestionAnswer,
    MdOutlineWorkOutline
}
    from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { BsTelephone, BsCalendarDate, BsPersonRolodex, BsBuilding } from "react-icons/bs";
import { FaRegIdBadge, FaIdCardAlt } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from 'react-bootstrap';
import { LiaSitemapSolid } from "react-icons/lia";
import {
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle,
    FaMicrophone,
    FaUnlock,
    FaTools,
    FaHotel
}
    from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSettings, CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { decryptData } from '../../../config/secureStorage';

const Employee = () => {

    const fetchCalled = useRef(false);
    const encryptedChannelId = localStorage.getItem("channelId");
    const channelId = encryptedChannelId ? decryptData(encryptedChannelId) : null;

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
        isAllowBackDays: false,
        noOfDays: "",
        isDefaultChannel: false,
    };

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
    const [menuData, setMenuData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const searchParam = ["name", "email", "joiningDate", "mobile", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    const [loading, setLoading] = useState(true);
    const [accessshow, setAccessShow] = useState(false);
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [outletSearch, setOutletSearch] = useState('');
    const [availableMenus, setAvailableMenus] = useState([]);
    const [showMenuSelection, setShowMenuSelection] = useState(false);
    const [menuSearch, setMenuSearch] = useState('');
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [activePermissionMenuId, setActivePermissionMenuId] = useState(null);
    const [menuPermissions, setMenuPermissions] = useState({});
    const [advanceSwitches, setAdvanceSwitches] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingOutlet, setPendingOutlet] = useState(null);
    const [defaultOutlet, setDefaultOutlet] = useState(null);
    const [selectedOutletIds, setSelectedOutletIds] = useState([]);
    const [outletEmpTypes, setOutletEmpTypes] = useState({});
    const [hasMappedOutlets, setHasMappedOutlets] = useState(false);
    const [accessData, setAccessData] = useState([]);

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
    };

    const handleAccessClose = () => {
        setAccessShow(false);
        setSelectedEmployee(null);
    };

    // const handleAccessShow = (employeeID) => {
    //     setAccessShow(true);
    //     fetchEmployeeData();
    //     fetchOutletData();
    //     fetchEmployeeTypeData();
    //     fetchMenuAction();
    //     fetchAccessData(employeeID);
    // };

    const handleAccessShow = (employeeID) => {
        setAccessShow(true);
        fetchEmployeeData(); 
        fetchOutletData();
        fetchEmployeeTypeData();
        fetchMenuAction();
        fetchAccessData(employeeID); 
    };


    const filteredEmployeeData = employeeData?.filter(emp =>
        emp.name?.toLowerCase().includes(employeeSearch.toLowerCase())
    );

    const filteredOutletData = outletData.filter(outlet =>
        outlet.outletName?.toLowerCase().includes(outletSearch.toLowerCase())
    );

    useEffect(() => {
        if (outletData.length > 0 && defaultOutlet === null) {
            setDefaultOutlet(outletData[0].outletId);
        }
    }, [outletData, defaultOutlet]);

    const toggleOutlet = (outletId) => {
        setSelectedOutletIds((prev) =>
            prev.includes(outletId)
                ? prev.filter((id) => id !== outletId)
                : [...prev, outletId]
        );
    };

    const handleDefaultChange = (newOutletId) => {
        if (newOutletId === defaultOutlet) return;
        setPendingOutlet(newOutletId);
        setShowConfirm(true);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchEmployeeData();
    }, []);

    useEffect(() => {
        const encryptedAuthChannels = localStorage.getItem("authChannels");
        if (!encryptedAuthChannels) return;

        try {
            const decryptedChannels = decryptData(encryptedAuthChannels);
            console.log(decryptedChannels, 'ff');

            const menus = decryptedChannels.flatMap(channel =>
                channel.subscriptionModules.flatMap(mod =>
                    mod.menus.map(menu => ({
                        menuId: menu.menuId,
                        menuName: menu.menuName,
                    }))
                )
            );

            setAvailableMenus(menus);
            setShowMenuSelection(true);
        } catch (err) {
            console.error("Failed to decrypt authChannels", err);
        }
    }, []);

    const advancePermissions = menuData
        ?.filter(item => item.menuId === activePermissionMenuId && item.parentActionName)
        ?.map(item => item.parentActionName);

    const uniqueAdvancePermissions = [...new Set(advancePermissions)];


    useEffect(() => {
        if (accessData?.outlets) {
            const defaultOutlet = accessData.outlets.find(o => o.isDefaultOutlet);
            if (defaultOutlet) {
                setSelectedEmployee(prev => ({
                    ...prev,
                    defaultOutletName: defaultOutlet.outletName,
                }));
            }
        }
    }, [accessData]);


    const handleEmployeeSelect = async (emp) => {
        setSelectedEmployee(emp);
        setSelectedOutletIds([]);
        setOutletEmpTypes({});
        setDefaultOutlet('');
        setHasMappedOutlets(false);
        await fetchAccessData(emp.employeeID);
    };

    // const fetchAccessData = async (employeeID) => {
    //     try {
    //         const res = await api.get(`/employeeaccess/${employeeID}`);
    //         const rawData = res?.data?.data;
    //         console.log(rawData, 'kk');

    //         // If it's a single object, wrap it in an array
    //         if (rawData && typeof rawData === 'object') {
    //             const sortedData = [rawData].sort(
    //                 (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    //             );
    //             setAccessData(sortedData);
    //         } else {
    //             setAccessData([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching table data", error);
    //         setAccessData([]);
    //         setLoadingIndicator(false);
    //     }
    // };

    // console.log(accessData, 'oo');

    // const fetchAccessData = async (employeeID) => {
    //     try {
    //         const res = await api.get(`/employeeaccess/${employeeID}`);
    //         setAccessData(res?.data?.data);
    //     } catch (error) {
    //         setLoadingIndicator(false)
    //         console.error("Error fetching department data", error);
    //     }
    // };
    console.log(accessData, 'oo');


    const fetchAccessData = async (employeeID) => {
        try {
            const res = await api.get(`/employeeaccess/${employeeID}`);
            const data = res?.data?.data;
            setAccessData(data);

            const defaultOutlet = data?.outlets?.find(outlet => outlet.isDefaultOutlet);

            // Set selectedEmployee with name and defaultOutletName
            setSelectedEmployee({
                employeeID: data.employeeID,
                name: data.name,
                defaultOutletName: defaultOutlet?.outletName || null,
            });
        } catch (error) {
            setLoadingIndicator(false);
            console.error("Error fetching department data", error);
        }
    };


    const fetchDepartmentData = async () => {
        try {
            const res = await api.get(`/department`);
            setDepartmentData(res?.data?.list);
        } catch (error) {
            setLoadingIndicator(false)
            console.error("Error fetching department data", error);
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

    const fetchEmployeeTypeData = async () => {
        try {
            const res = await api.get(`/employeetype`);
            setEmployeeTypeData(res?.data?.list);
        } catch (error) {
            setLoadingIndicator(false)
            console.error("Error fetching employee data", error);
        }
    };

    const fetchMenuAction = async () => {
        try {
            const res = await api.get(`/menuaction`);
            const sortedData = res?.data?.data?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setMenuData(sortedData);
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
            isAllowBackDays: row.isAllowBackDays,
            noOfDays: row.noOfDays
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
            name: <h6 className="fw-bold">Name</h6>,
            selector: row => row.name,
            cell: row => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={
                            row.photo
                                ? `${import.meta.env.VITE_IMG_BASE_URL}/${row.photo}`
                                : 'src/assets/person.png'
                        }
                        alt="Profile"
                        width={35}
                        height={35}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>{row.name}</div>
                </div>
            ),
            sortable: true,
        },
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
                    <Link className="action-icon" onClick={() => handleEditClick(row)} title='Edit'>
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.employeeID, row.name)} title='Delete'>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                    <Link
                        onClick={() => handleAccessShow(row.employeeID)}
                        style={{ cursor: "pointer" }}
                    >
                        <LiaSitemapSolid size={30} style={{ margin: "0.2vh" }} color="green" title='Outlet & Access Mapping' />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => {
        return (
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
                <Button variant="info"
                    onClick={handleExpoShow}
                >
                    <CiExport size={20} style={{ marginTop: "-0.5vh" }} /> Import
                </Button>
                <Button variant="success"
                >
                    <CiImport size={20} style={{ marginTop: "-0.5vh" }} /> Export
                </Button>
                <Button variant="warning" onClick={handleShow}>
                    <GoPlus size={20} style={{ marginTop: "-0.5vh" }} /> Add
                </Button>
            </div>
        );
    }, [filterText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payloadForPost = {
            channelID: channelId,
            psid: Number(formValues.psId),
            name: formValues.employeeName,
            password: formValues.password,
            email: formValues.email,
            mobile: formValues.mobile,
            joiningDate: formValues.joiningDate,
            deptId: formValues.deptId,
            empTypeId: formValues.empTypeId,
            empCode: formValues.empCode,
            isActive: formValues.isActive,
            isAllowBackDays: formValues.isAllowBackDays,
            noOfDays: Number(formValues.noOfDays),
            isDefaultChannel: true,
        }

        const payloadForPut = {
            ...payloadForPost,
            securityQuestionID: formValues.securityQuestionId,
            answer: formValues.securityAnswer,
            dob: formValues.dob,
            doa: formValues.anniversary,
            designation: formValues.designation,
            isAllowBackDays: formValues.isAllowBackDays,
            noOfDays: formValues.noOfDays
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

    const validateSubmission = () => {
        if (!selectedEmployee) {
            toast.warning("Please select an employee");
            return false;
        }
        if (selectedOutletIds.length === 0) {
            toast.warning("Select at least one outlet");
            return false;
        }
        if (!defaultOutlet) {
            toast.warning("Choose a default outlet");
            return false;
        }
        if (selectedMenu.length === 0) {
            toast.warning("Select at least one menu");
            return false;
        }
        // ensure empType chosen for every outlet
        const missingType = selectedOutletIds.find(id => !outletEmpTypes[id]);
        if (missingType) {
            toast.warning("Assign employee type for every outlet");
            return false;
        }
        return true;
    };

    const handleAccess = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            toast.error("Please select an employee.");
            return;
        }
        if (selectedOutletIds.length === 0) {
            toast.error("Please choose at least one outlet.");
            return;
        }
        if (selectedMenu.length === 0) {
            toast.error("Please choose at least one menu.");
            return;
        }
        const buildActionIds = (menuId) => {
            const ids = new Set();

            Object.entries(advanceSwitches).forEach(([key, on]) => {
                if (!on || !key.startsWith(menuId + "-")) return;

                const rest = key.slice(menuId.length + 1);
                if (rest.length === 36) {
                    ids.add(rest);
                } else if (rest.length === 73) {
                    const parentActionId = rest.slice(0, 36);
                    const actionId = rest.slice(37);
                    ids.add(parentActionId);
                    ids.add(actionId);
                } else {
                    console.warn("Unexpected switch key:", key);
                }
            });

            return Array.from(ids);
        };
        const buildMenuPermissions = (menuId) => {
            const basic = menuPermissions[menuId] || {};
            return {
                menuId,
                permissions: {
                    read: basic.read || false,
                    write: basic.write || false,
                    delete: basic.delete || false,
                    import: basic.import || false,
                    export: basic.export || false,
                    print: basic.print || false,
                    approve: basic.approve || false,
                    printLimit: basic.printLimit || 0,
                    printCount: basic.printCount || 0,
                    maxDiscount: basic.maxDiscount || 0,
                    actionIds: buildActionIds(menuId),
                },
            };
        };
        const configuration = selectedMenu.map(buildMenuPermissions);
        const outlets = selectedOutletIds.map((outletId) => ({
            outletId,
            empTypeId: outletEmpTypes[outletId] || null,
            isDefaultOutlet: outletId === defaultOutlet,
            menus: selectedMenu.map(buildMenuPermissions),
        }));
        const payload = {
            employeeID: selectedEmployee.employeeID,
            configuration,
            outlets,
            isActive: true,
        };

        console.log("%cFinal payload →", "color:orange;font-weight:bold", payload);
        setLoading(true);
        try {
            let res;
            if (hasMappedOutlets) {
                res = await api.put(`/employeeaccess/${selectedEmployee.employeeID}`, payload);
            } else {
                res = await api.post("/employeeaccess", payload);
            }
            // const res = isEditMode
            //     ? await api.put(`/employeeaccess/${accessId}`, payload)
            //     : await api.post("/employeeaccess", payload);

            toast.success(res.data?.successMessage || "Access saved!");
            resetPermissionState();
            handleAccessClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.errorMessage || "Save failed, try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetPermissionState = () => {
        setSelectedEmployee(null);
        setEmployeeSearch("");
        setSelectedOutletIds([]);
        setOutletSearch("");
        setOutletEmpTypes({});
        setDefaultOutlet(null);
        setSelectedMenu([]);
        setMenuSearch("");
        setMenuPermissions({});
        setAdvanceSwitches({});
        setActivePermissionMenuId(null);
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
                    <Form className='h-90 ' onSubmit={(e) => handleSubmit(e)} autoComplete='off'>
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
                                        name="real-password"
                                        value={formValues.password || ""}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className={errors.password ? 'input-error' : ''}
                                        autoComplete="new-password"
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
                                        type="email"
                                        name='real-email'
                                        value={formValues.email}
                                        autoComplete='off'
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
                                    <InputGroup.Text id="deptId">
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
                                    <InputGroup.Text id="noOfDays">
                                        <FaIdCardAlt size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="noOfDays"
                                        value={formValues.noOfDays || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange("noOfDays", value);
                                            }
                                        }}
                                        placeholder="Enter no of days"
                                        aria-label="psid"
                                        isInvalid={!!errors.noOfDays}
                                        isValid={formValues.noOfDays && !errors.noOfDays}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
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
                            <Col md={6}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="isAllowBackDays">
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        id="custom-checkbox"
                                        label="isAllowBackDays"
                                        name="isAllowBackDays"

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
                                                setFormValues({ ...formValues, isAllowBackDays: e.target.checked })
                                            }
                                            checked={formValues.isAllowBackDays}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                cursor: "pointer",
                                                marginRight: "8px",
                                            }}
                                        />
                                        <Form.Check.Label htmlFor="custom-checkbox">
                                            Allow Back Days
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

            <Offcanvas
                show={accessshow}
                onHide={handleAccessClose}
                backdrop="static"
                placement="end"
                className="emp-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add Outlet Assignment for Employees
                            {selectedEmployee && (
                                <>
                                    {' '}|{' '}
                                    <span style={{ color: 'orange' }}>{selectedEmployee.name}</span>
                                    {selectedEmployee.defaultOutletName && (
                                        <>
                                            {' '}|{' '}
                                            <span style={{ color: 'green' }}>
                                                {selectedEmployee.defaultOutletName}
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </Offcanvas.Title>

                        {/* <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add Outlet Assignment for Employees
                            {selectedEmployee && (
                                <>
                                    {' '}|{' '}
                                    <span style={{ color: 'orange' }}>{selectedEmployee.name}</span>
                                    {accessData?.outlets?.find(o => o.isDefaultOutlet)?.outletName && (
                                        <>
                                            {' '}|{' '}
                                            <span style={{ color: 'green' }}>
                                                {accessData.outlets.find(o => o.isDefaultOutlet).outletName}
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </Offcanvas.Title> */}

                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column" style={{ padding: 0, height: '100vh' }}>
                    <div className="container-fluid h-100 d-flex flex-column">
                        <div className="row flex-grow-1">
                            <div className="col border">
                                <div
                                    style={{
                                        width: '200px',
                                        padding: '10px',
                                        height: '490px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div
                                        className="d-flex align-items-center rounded-pill border px-3 py-1 mb-3"
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    >
                                        <CiSearch size={20} className="me-2 text-muted" />
                                        <Form.Control
                                            type="text"
                                            placeholder="Search Employee"
                                            value={employeeSearch}
                                            onChange={(e) => setEmployeeSearch(e.target.value)}
                                            className="border-0 bg-transparent shadow-none p-0"
                                            style={{ height: '30px', flex: 1 }}
                                        />
                                        {employeeSearch && (
                                            <button
                                                onClick={() => setEmployeeSearch('')}
                                                className="btn btn-sm btn-link p-0 ms-2"
                                                style={{ textDecoration: 'none', fontSize: '18px', color: '#999' }}
                                                type="button"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                    {filteredEmployeeData?.map((emp) => (
                                        <div
                                            key={emp.employeeID}
                                            onClick={() => handleEmployeeSelect(emp)}
                                            className="d-flex align-items-center gap-2 px-2 py-2 mb-1 rounded"
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    selectedEmployee?.employeeID === emp.employeeID ? '#fff3cd' : '',
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                {selectedEmployee?.employeeID === emp.employeeID && (
                                                    <span
                                                        style={{
                                                            color: 'orange',
                                                            fontWeight: 'bold',
                                                            fontSize: '20px',
                                                        }}
                                                        className="me-2"
                                                    >
                                                        |
                                                    </span>
                                                )}
                                                <img
                                                    src={
                                                        emp.photo
                                                            ? `${import.meta.env.VITE_IMG_BASE_URL}/${emp.photo}`
                                                            : 'src/assets/person.png'
                                                    }
                                                    alt={emp.name}
                                                    width="45"
                                                    height="45"
                                                    className="rounded-circle"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ lineHeight: '1.2' }}>
                                                <div className="fw-semibold">{emp.name}</div>
                                                <div className="text-muted small">{emp.designation}</div>
                                                <div className="text-muted small">{emp.empCode}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col border">
                                <div
                                    style={{
                                        width: '450px',
                                        padding: '10px',
                                        height: '504px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div
                                        className="d-flex align-items-center rounded-pill border px-3 py-1 mb-3"
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    >
                                        <CiSearch size={20} className="me-2 text-muted" />
                                        <Form.Control
                                            type="text"
                                            placeholder="Search Outlet"
                                            value={outletSearch}
                                            onChange={(e) => setOutletSearch(e.target.value)}
                                            className="border-0 bg-transparent shadow-none p-0"
                                            style={{ height: '30px', flex: 1 }}
                                        />
                                        {outletSearch && (
                                            <button
                                                onClick={() => setOutletSearch('')}
                                                className="btn btn-sm btn-link p-0 ms-2"
                                                style={{ textDecoration: 'none', fontSize: '18px', color: '#999' }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                    {filteredOutletData?.map((outlet, index) => (
                                        <div
                                            key={outlet.outletId}
                                            className="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded border"
                                        >
                                            <div className="d-flex align-items-start gap-2" style={{ width: '35%' }}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input mt-1"
                                                    checked={selectedOutletIds.includes(outlet.outletId)}
                                                    onChange={(e) => {
                                                        const updated = e.target.checked
                                                            ? [...selectedOutletIds, outlet.outletId]
                                                            : selectedOutletIds.filter(id => id !== outlet.outletId);
                                                        setSelectedOutletIds(updated);
                                                    }}
                                                />
                                                <div>
                                                    <div className="fw-semibold">{outlet.outletName}</div>
                                                    <div className="text-muted small">{outlet.channelName}</div>
                                                </div>
                                            </div>
                                            <div style={{ width: '40%' }}>
                                                <Form.Select
                                                    size="sm"
                                                    value={outletEmpTypes[outlet.outletId] || ''}
                                                    onChange={(e) =>
                                                        setOutletEmpTypes((prev) => ({
                                                            ...prev,
                                                            [outlet.outletId]: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="">Select Employee Type</option>
                                                    {employeeTypeData?.map((item) => (
                                                        <option key={item.empTypeId} value={item.empTypeId}>
                                                            {item.empTypeName}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                            </div>
                                            <div style={{ width: '10%', textAlign: 'end' }}>
                                                <input
                                                    type="radio"
                                                    name="defaultOutlet"
                                                    className="form-check-input"
                                                    checked={defaultOutlet === outlet.outletId}
                                                    onChange={() => handleDefaultChange(outlet.outletId)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col border">
                                <div
                                    style={{
                                        width: '300px',
                                        padding: '10px',
                                        height: '490px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <>
                                        <div
                                            className="d-flex align-items-center rounded-pill border px-3 py-1 mb-3"
                                            style={{ backgroundColor: '#f5f5f5' }}
                                        >
                                            <CiSearch size={20} className="me-2 text-muted" />
                                            <Form.Control
                                                type="text"
                                                placeholder="Search Menu"
                                                value={menuSearch}
                                                onChange={(e) => setMenuSearch(e.target.value)}
                                                className="border-0 bg-transparent shadow-none p-0"
                                                style={{ height: '30px', flex: 1 }}
                                            />
                                            {menuSearch && (
                                                <button
                                                    onClick={() => setMenuSearch('')}
                                                    className="btn btn-sm btn-link p-0 ms-2"
                                                    style={{ textDecoration: 'none', fontSize: '18px', color: '#999' }}
                                                    type="button"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>

                                        {availableMenus
                                            .filter(menu => menu.menuName.toLowerCase().includes(menuSearch.toLowerCase()))
                                            .map(menu => (
                                                <div
                                                    key={menu.menuId}
                                                    className="d-flex align-items-center justify-content-between px-3 py-2 mb-2 rounded border"
                                                >
                                                    <div className="fw-semibold">{menu.menuName}</div>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`menu-switch-${menu.menuId}`}
                                                        checked={selectedMenu.includes(menu.menuId)}
                                                        onChange={() => {
                                                            if (selectedMenu.includes(menu.menuId)) {
                                                                const updated = selectedMenu.filter(id => id !== menu.menuId);
                                                                setSelectedMenu(updated);
                                                                if (activePermissionMenuId === menu.menuId) {
                                                                    setActivePermissionMenuId(null);
                                                                }
                                                            } else {
                                                                const updated = [...selectedMenu, menu.menuId];
                                                                setSelectedMenu(updated);
                                                                setActivePermissionMenuId(menu.menuId);
                                                                console.log("Checked Menu ID:", menu.menuId);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                    </>
                                </div>
                            </div>
                            {selectedMenu.length > 0 && activePermissionMenuId && (
                                <div className="col border">
                                    <div style={{ width: '200px', padding: '10px' }}>
                                        <h5>
                                            Basic Permission -{' '}
                                            {
                                                availableMenus.find(menu => menu.menuId === activePermissionMenuId)?.menuName
                                            }
                                        </h5>
                                        <div className="mb-3">
                                            {['read', 'write', 'delete', 'import', 'export', 'print', 'approve'].map((perm) => (
                                                <Form.Check
                                                    key={perm}
                                                    type="checkbox"
                                                    id={`perm-${perm}`}
                                                    label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                                                    checked={menuPermissions[activePermissionMenuId]?.[perm] || false}
                                                    onChange={(e) =>
                                                        setMenuPermissions((prev) => ({
                                                            ...prev,
                                                            [activePermissionMenuId]: {
                                                                ...prev[activePermissionMenuId],
                                                                [perm]: e.target.checked,
                                                            },
                                                        }))
                                                    }
                                                    className="mb-2"
                                                />
                                            ))}
                                        </div>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Print Limit</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                value={menuPermissions[activePermissionMenuId]?.printLimit || ''}
                                                onChange={(e) =>
                                                    setMenuPermissions((prev) => ({
                                                        ...prev,
                                                        [activePermissionMenuId]: {
                                                            ...prev[activePermissionMenuId],
                                                            printLimit: parseInt(e.target.value) || 0,
                                                        },
                                                    }))
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Print Count</Form.Label>
                                            <Form.Control
                                                type="text"
                                                min={0}
                                                value={menuPermissions[activePermissionMenuId]?.printCount || ''}
                                                onChange={(e) =>
                                                    setMenuPermissions((prev) => ({
                                                        ...prev,
                                                        [activePermissionMenuId]: {
                                                            ...prev[activePermissionMenuId],
                                                            printCount: parseInt(e.target.value) || 0,
                                                        },
                                                    }))
                                                }
                                            />
                                        </Form.Group>
                                        {(() => {
                                            const advancePermissions = menuData
                                                ?.filter(item => item.menuId === activePermissionMenuId && item.parentActionName)
                                                ?.map(item => ({
                                                    parentActionId: item.parentActionId,
                                                    parentActionName: item.parentActionName,
                                                })) || [];

                                            const uniqueAdvancePermissions = Object.values(
                                                advancePermissions.reduce((acc, item) => {
                                                    acc[item.parentActionId] = item;
                                                    return acc;
                                                }, {})
                                            );

                                            return (
                                                <>
                                                    {uniqueAdvancePermissions.length > 0 && <h5 className="mt-4">Advance Permission</h5>}
                                                    {uniqueAdvancePermissions.map(({ parentActionId, parentActionName }) => {
                                                        const parentKey = `${activePermissionMenuId}-${parentActionId}`;
                                                        return (
                                                            <div
                                                                key={parentActionId}
                                                                className="d-flex justify-content-between align-items-center mb-2"
                                                            >
                                                                <Form.Label className="mb-0">{parentActionName}</Form.Label>
                                                                <Form.Check
                                                                    type="switch"
                                                                    id={`switch-${parentActionId}`}
                                                                    checked={advanceSwitches[parentKey] || false}
                                                                    onChange={(e) =>
                                                                        setAdvanceSwitches((prev) => ({
                                                                            ...prev,
                                                                            [parentKey]: e.target.checked,
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                            {selectedMenu.length > 0 && activePermissionMenuId && (
                                <div className="col border">
                                    <div
                                        style={{
                                            width: '200px',
                                            padding: '10px',
                                        }}
                                    >
                                        {(() => {
                                            const parentActionMap = {};

                                            menuData
                                                ?.filter(item => item.menuId === activePermissionMenuId && item.parentActionName)
                                                ?.forEach(item => {
                                                    const parentId = item.parentActionId;
                                                    if (!parentActionMap[parentId]) {
                                                        parentActionMap[parentId] = {
                                                            parentActionName: item.parentActionName,
                                                            actions: [],
                                                        };
                                                    }
                                                    parentActionMap[parentId].actions.push({
                                                        actionId: item.actionId,
                                                        actionName: item.actionName,
                                                    });
                                                });

                                            const parentActionEntries = Object.entries(parentActionMap);
                                            const visibleParents = parentActionEntries.filter(([parentId]) =>
                                                advanceSwitches[`${activePermissionMenuId}-${parentId}`]
                                            );

                                            if (visibleParents.length === 0) return null;

                                            return (
                                                <>
                                                    <h5>Internal Permission -</h5>
                                                    {visibleParents.map(([parentId, { parentActionName, actions }]) => (
                                                        <div key={parentId} className="mb-3">
                                                            <h6 className="fw-semibold">{parentActionName}</h6>
                                                            <div className="d-flex flex-column gap-2 ps-2">
                                                                {actions.map((action) => {
                                                                    const actionKey = `${activePermissionMenuId}-${parentId}-${action.actionId}`;
                                                                    return (
                                                                        <div
                                                                            key={action.actionId}
                                                                            className="d-flex justify-content-between align-items-center w-100"
                                                                            style={{ maxWidth: '270px' }}
                                                                        >
                                                                            <Form.Label className="mb-0">{action.actionName}</Form.Label>
                                                                            <Form.Check
                                                                                type="switch"
                                                                                id={`action-switch-${action.actionId}`}
                                                                                checked={advanceSwitches[actionKey] || false}
                                                                                onChange={(e) =>
                                                                                    setAdvanceSwitches(prev => ({
                                                                                        ...prev,
                                                                                        [actionKey]: e.target.checked,
                                                                                    }))
                                                                                }
                                                                            />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="row mt-auto">
                            <div className="col text-end p-3">
                                <button className="btn btn-warning" onClick={handleAccess}>
                                    {hasMappedOutlets ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <Modal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Default Outlet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to set{' '}
                    <strong>{outletData.find(o => o.outletId === pendingOutlet)?.outletName}</strong>{' '}
                    as the default outlet instead of{' '}
                    <strong>{outletData.find(o => o.outletId === defaultOutlet)?.outletName}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        No
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setDefaultOutlet(pendingOutlet);
                            setPendingOutlet(null);
                            setShowConfirm(false);
                        }}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Employee;
