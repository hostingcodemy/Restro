import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import {
    Form,
    Button,
    Offcanvas,
    InputGroup,
    Spinner,
    Row,
    Col
}
    from "react-bootstrap";
import {
    MdDeleteForever,
    MdOutlineAccessTime,
    MdOutlinePersonOutline,
    MdOutlineLocalOffer,
}
    from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle,
    FaRegCalendarAlt,
    FaMicrophone,
    FaPercentage,
    FaRegClock,
    FaRegCommentDots
}
    from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport, CiMoneyBill } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';
import { decryptData } from '../../../config/secureStorage';
import { RiCoupon2Line } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import Select from 'react-select';

const Offer = () => {

    const initialValues = {
        OfferId: "",
        outletId: "",
        offerName: "",
        offerTypeId: "",
        startTime: "",
        endTime: "",
        validFrom: "",
        validTo: "",
        onItemQty: "",
        onItemSizeID: "",
        offerQty: "",
        offerItemSizeID: "",
        onBillingTotal: "",
        onVisitCount: "",
        freeCouponValue: "",
        offeerPercentage: "",
        nextVisitEligibiity: "",
        itemTypeID: "",
        offerItemTypeQty: "",
        offerPrice: "",
        isActive: true,
    };

    const initialImpValues = {
        File: "",
    };

    const customerValues = {
        offerId: "",
        customerIds: [],
        offerCustomerPercentage: "",
        isActive: true,
    };

    const couponValues = {
        offerId: "",
        couponIds: [],
        couponOfferPercentage: "",
        isApplied: false,
        appliedOn: "",
        appliedRemarks: "",
        isActive: true,
    };

    const fetchCalled = useRef(false);
    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const [formCusValues, setFormCusValues] = useState(customerValues);
    const [cusErrors, setCusErrors] = useState({});
    const [formCouValues, setFormCouValues] = useState(couponValues);
    const [couErrors, setCouErrors] = useState({});
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [offerData, setOfferData] = useState([]);
    const [offerTypeData, setOfferTypeData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const [freeData, setFreeData] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [couponData, setCuponData] = useState([]);
    const searchParam = ["offerName", "offerTypeName", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [cusShow, setCusShow] = useState(false);
    const [couponShow, setCouponShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [onItemSearch, setOnItemSearch] = useState("");
    const [freeItemSearch, setFreeItemSearch] = useState("");
    const [itemSizeData, setItemSizeData] = useState([]);
    const [itemTypesData, setItemTypesData] = useState([]);


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
        fetchOfferTypeData();
        fetchCustomerData();
        fetchFreeItemData();
        fetchOutletData();
        fetchItemSizeData();
        fetchItemTypeData();
        const outletId = getDecryptedOutletId();
        if (outletId) {
            fetchItemData(outletId);
        }
    };

    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    const handleCusClose = () => setCusShow(false);
    const handleCusShow = () => {
        fetchOfferData();
        fetchCustomerData();
        setCusShow(true);
    };
    const handleCouponClose = () => setCouponShow(false);
    const handleCouponShow = () => {
        fetchCouponData();
        setCouponShow(true);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchOfferData();
    }, []);

    const getDecryptedOutletId = () => {
        const encryptedOutletId = localStorage.getItem("currentOutletId");
        return encryptedOutletId ? decryptData(encryptedOutletId) : null;
    };

    const fetchOfferData = async () => {
        try {
            const res = await api.get(`/offer`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setOfferData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchItemData = async (outletId) => {
        try {
            const res = await api.get(`/items/outlet/${outletId}`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setItemsData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchOfferTypeData = async () => {
        try {
            const res = await api.get(`/offertype`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setOfferTypeData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchFreeItemData = async () => {
        try {
            const res = await api.get(`/offerfreeitem`);
            const offerData = res?.data?.data || [];

            const flattened = offerData.flatMap((offer) =>
                offer.offerItemons.flatMap((onItem) =>
                    onItem.offerItems.map((free) => ({
                        itemName: onItem.itemName,
                        freeItemName: free.freeItemName,
                    }))
                )
            );

            setFreeData(flattened);
        } catch (error) {
            console.error("Error fetching table data", error);
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

    const fetchCouponData = async () => {
        try {
            const res = await api.get(`/coupon`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setCuponData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchItemSizeData = async () => {
        try {
            const res = await api.get(`/itemsize`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setItemSizeData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchItemTypeData = async () => {
        try {
            const res = await api.get("/itemtype");
            setItemTypesData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        }
    };

    const customerOptions = customerData?.map((item) => ({
        value: item.customerID,
        label: item.name
    })) || [];

    const couponOptions = couponData?.map((item) => ({
        value: item.couponId,
        label: item.couponCode
    })) || [];

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

    const handleCusChange = (name, value) => {
        setFormCusValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCusErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleCouChange = (name, value) => {
        setFormCouValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCouErrors((prevErrors) => ({
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
        const { offerName } = formValues;
        const errors = {};
        let isValid = true;

        if (!offerName) {
            isValid = false;
            errors.offerName = "Offer name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(offerName)) {
            errors.offerName = 'Name must contain only letters';
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

    const validateCusForm = () => {
        const { offerId, customerIds, offerCustomerPercentage } = formCusValues;
        const errors = {};
        let isValid = true;

        if (!offerId) {
            isValid = false;
            errors.offerId = "Offer is required.";
        }

        if (!customerIds || customerIds.length === 0) {
            isValid = false;
            errors.customerIds = "At least one customer must be selected.";
        }

        if (!offerCustomerPercentage) {
            isValid = false;
            errors.offerCustomerPercentage = "Percentage is required.";
        } else if (!/^\d+(\.\d{1,2})?$/.test(offerCustomerPercentage)) {
            isValid = false;
            errors.offerCustomerPercentage = "Only numbers allowed (up to 2 decimal places).";
        }

        setCusErrors(errors);
        return isValid;
    };

    const validateCouForm = () => {
        const {
            offerId,
            couponIds,
            couponOfferPercentage,
            appliedOn,
            appliedRemarks,
        } = formCouValues;

        const errors = {};
        let isValid = true;

        if (!offerId) {
            errors.offerId = "Offer is required.";
            isValid = false;
        }

        if (!couponIds || couponIds.length === 0) {
            errors.couponIds = "At least one coupon must be selected.";
            isValid = false;
        }

        if (!couponOfferPercentage) {
            errors.couponOfferPercentage = "Percentage is required.";
            isValid = false;
        } else if (!/^\d+(\.\d{1,2})?$/.test(couponOfferPercentage)) {
            errors.couponOfferPercentage = "Only numbers allowed (up to 2 decimals).";
            isValid = false;
        }

        if (!appliedOn) {
            errors.appliedOn = "Applied date/time is required.";
            isValid = false;
        }

        if (!appliedRemarks || appliedRemarks.trim() === "") {
            errors.appliedRemarks = "Remarks are required.";
            isValid = false;
        }

        setCouErrors(errors);
        return isValid;
    };

    const handleEditClick = (row) => {
        console.log(row, 'kk')
        setIsEditMode(true);
        setFormValues({
            offerId: row.offerId,
            offerName: row.offerName,
            outletId: row.outletId,
            offerTypeId: row.offerTypeId,
            startTime: row.startTime,
            endTime: row.endTime,
            validFrom: row.validFrom,
            validTo: row.validTo,
            onItemQty: Number(row.onItemQty),
            onItemSizeID: row.onItemSizeID,
            offerQty: Number(row.offerQty),
            offerItemSizeID: row.offerItemSizeID,
            onBillingTotal: Number(row.onBillingTotal),
            onVisitCount: Number(row.onVisitCount),
            freeCouponValue: Number(row.freeCouponValue),
            offeerPercentage: Number(row.offeerPercentage),
            nextVisitEligibiity: row.nextVisitEligibiity,
            itemTypeID: row.itemTypeID,
            offerItemTypeQty: Number(row.offerItemTypeQty),
            offerPrice: Number(row.offerPrice),
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (offerId, offerName) => {
        setToDelete({ id: offerId, name: offerName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/offer/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Offer deleted successfully!");
                fetchOfferData();
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
            name: <h5>Offer Name</h5>,
            selector: (row) => row.offerName,
            sortable: true,
        },
        {
            name: <h5>Offer Type Name</h5>,
            selector: (row) => row.offerTypeName,
            sortable: true,
        },
        {
            name: <h5>Outlet Name</h5>,
            selector: (row) => row.outletName,
            sortable: true,
        },
        {
            name: <h5>Customer Name</h5>,
            selector: (row) => {
                if (!row.offerCustomers || row.offerCustomers.length === 0) {
                    return "N/A";
                }

                const groupedNames = [];
                for (let i = 0; i < row.offerCustomers.length; i += 2) {
                    const first = row.offerCustomers[i]?.name;
                    const second = row.offerCustomers[i + 1]?.name;
                    groupedNames.push(`${first}${second ? ', ' + second : ''}`);
                }

                return (
                    <div>
                        {groupedNames.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                );
            },
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
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.offerId, row.offerName)} title='Delete'>
                        <MdDeleteForever size={24} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                    <Link className="action-icon" title='Attached Coupon'
                        onClick={(e) => {
                            e.preventDefault();
                            handleCouponShow(row);
                        }}
                    >
                        <RiCoupon2Line size={24} style={{ margin: "1vh" }} color="#FFCA19" />
                    </Link>
                    <Link className="action-icon" title='Attached Customer' onClick={(e) => {
                        e.preventDefault();
                        handleCusShow(row);
                    }}
                    >
                        <IoPersonOutline size={24} style={{ margin: "1vh" }} color="#4bff19ff" />
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
            offerId: formValues.OfferId,
            outletId: formValues.outletId,
            offerName: formValues.offerName,
            offerTypeId: formValues.offerTypeId,
            startTime: formValues.startTime,
            endTime: formValues.endTime,
            validFrom: formValues.validFrom,
            validTo: formValues.validTo,
            onItemQty: parseInt(formValues.onItemQty) || 0,
            onItemSizeID: formValues.onItemSizeID,
            offerQty: parseInt(formValues.offerQty) || 0,
            offerItemSizeID: formValues.offerItemSizeID,
            onBillingTotal: parseFloat(formValues.onBillingTotal) || 0,
            onVisitCount: parseInt(formValues.onVisitCount) || 0,
            freeCouponValue: parseFloat(formValues.freeCouponValue) || 0,
            offeerPercentage: parseFloat(formValues.offeerPercentage) || 0,
            nextVisitEligibiity: parseInt(formValues.nextVisitEligibiity) || 0,
            itemTypeID: formValues.itemTypeID,
            offerItemTypeQty: parseInt(formValues.offerItemTypeQty) || 0,
            offerPrice: parseFloat(formValues.offerPrice) || 0,
            isActive: formValues.isActive,
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/offer/${formValues.OfferId}`, payload);
            } else {
                res = await api.post("/offer", payload);
            }

            handleClose();
            fetchOfferData();
            toast.success(res.data.successMessage || "Offer saved successfully!");
        } catch (error) {
            console.error(error);
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

    const handleCusSubmit = async (e) => {
        e.preventDefault();
        if (!validateCusForm()) return;

        const payload = {
            offerId: formCusValues.offerId,
            customerIds: formCusValues.customerIds,
            offerCustomerPercentage: parseFloat(formCusValues.offerCustomerPercentage),
            isActive: formCusValues.isActive
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/offercustomer/${formCusValues.customerOfferId}`, payload);
            } else {
                res = await api.post("/offercustomer", payload);
            }

            handleCusClose();
            fetchOfferData();
            toast.success(res.data.successMessage || "Customer offer saved successfully!");
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCouSubmit = async (e) => {
        e.preventDefault();
        if (!validateCouForm()) return;

        const payload = {
            offerId: formCouValues.offerId,
            couponIds: formCouValues.couponIds,
            couponOfferPercentage: parseFloat(formCouValues.couponOfferPercentage),
            isApplied: formCouValues.isApplied,
            appliedOn: formCouValues.appliedOn,
            appliedRemarks: formCouValues.appliedRemarks,
            isActive: true,
        };

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/offercoupon/${formCouValues.couponOfferId}`, payload);
            } else {
                res = await api.post("/offercoupon", payload);
            }

            handleCouponClose();
            fetchOfferData();
            toast.success(res.data.successMessage || "Coupon offer saved successfully!");
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
                            data={DataTableSettings.filterItems(offerData, searchParam, filterText)}
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
                className="custom-offcanvass"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Offer" : "Add Offer"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* <Form onClick={handleSubmit}> */}
                    <Row className="align-items-start">
                        <Col md={3} style={{ borderRight: '1px solid #ccc' }}>
                            <h6>On Item</h6>
                            <div className="position-relative">
                                <Form.Control
                                    type="search"
                                    placeholder="Search on item..."
                                    className="me-2 rounded-pill"
                                    aria-label="Search on item"
                                    onChange={(e) => setOnItemSearch(e.target.value)}
                                />
                                <FaMicrophone
                                    size={20}
                                    color="#ffc800"
                                    style={{
                                        position: "absolute",
                                        right: "15px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                    }}
                                />
                            </div>
                            <div className="mt-3" style={{ height: '300px', overflowY: 'auto' }}>
                                {freeData
                                    .filter(item =>
                                        item.itemName.toLowerCase().includes(onItemSearch.toLowerCase())
                                    )
                                    .map((item, idx) => (
                                        <Form.Check
                                            key={`onItem-${idx}`}
                                            type="checkbox"
                                            label={item.itemName}
                                            className="mb-2"
                                        />
                                    ))}
                            </div>
                        </Col>
                        <Col md={3} style={{ borderRight: '1px solid #ccc' }}>
                            <h6>Free Item</h6>
                            <div className="position-relative">
                                <Form.Control
                                    type="search"
                                    placeholder="Search free item..."
                                    className="me-2 rounded-pill"
                                    aria-label="Search free item"
                                    onChange={(e) => setFreeItemSearch(e.target.value)}
                                />
                                <FaMicrophone
                                    size={20}
                                    color="#ffc800"
                                    style={{
                                        position: "absolute",
                                        right: "15px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                    }}
                                />
                            </div>
                            <div className="mt-3" style={{ height: '300px', overflowY: 'auto' }}>
                                {freeData
                                    .filter(item =>
                                        item.freeItemName.toLowerCase().includes(freeItemSearch.toLowerCase())
                                    )
                                    .map((item, idx) => (
                                        <Form.Check
                                            key={`freeItem-${idx}`}
                                            type="checkbox"
                                            label={item.freeItemName}
                                            className="mb-2"
                                        />
                                    ))}
                            </div>
                        </Col>
                        <Col md={6}>
                            <h6>Offer</h6>
                            <div style={{ height: '300px' }}>
                                <Row className="g-4">
                                    <Col md={12}>
                                        <Form className="h-90">
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="offerName">
                                                            <MdOutlinePersonOutline size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            name="offerName"
                                                            value={formValues.offerName}
                                                            onChange={(e) =>
                                                                handleChange("offerName", e.target.value)
                                                            }
                                                            placeholder="Offer name"
                                                            isInvalid={!!errors.offerName}
                                                            isValid={formValues.offerName && !errors.offerName}
                                                        />
                                                    </InputGroup>
                                                    {errors.offerName && <span className="error-msg">{errors.offerName}</span>}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="offerTypeId">
                                                            <MdOutlinePersonOutline size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Select
                                                            name="offerTypeId"
                                                            value={formValues.offerTypeId || ""}
                                                            onChange={(e) => handleChange("offerTypeId", e.target.value)}
                                                        >
                                                            <option>Select offer type</option>
                                                            {offerTypeData?.map((item) => (
                                                                <option key={item.offerTypeId} value={item.offerTypeId}>
                                                                    {item.offerTypeName}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </InputGroup>
                                                    {errors.offerTypeId && (
                                                        <span className="error-msg">{errors.offerTypeId}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="startTime">
                                                            <MdOutlineAccessTime size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="time"
                                                            name="startTime"
                                                            value={formValues.startTime ? formValues.startTime.substring(11, 16) : ""}
                                                            onChange={(e) => handleChange("startTime", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    {errors.startTime && (
                                                        <span className="error-msg">{errors.startTime}</span>
                                                    )}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="endTime">
                                                            <MdOutlineAccessTime size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="time"
                                                            name="endTime"
                                                            value={formValues.endTime ? formValues.endTime.substring(11, 16) : ""}
                                                            onChange={(e) => handleChange("endTime", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    {errors.endTime && <span className="error-msg">{errors.endTime}</span>}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="validFrom">
                                                            <FaRegCalendarAlt size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="date"
                                                            name="validFrom"
                                                            value={(formValues.validFrom || "").slice(0, 10)}
                                                            onChange={(e) => handleChange("validFrom", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    {errors.validFrom && (
                                                        <span className="error-msg">{errors.validFrom}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="validTo">
                                                            <FaRegCalendarAlt size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="date"
                                                            name="validTo"
                                                             value={(formValues.validTo || "").slice(0, 10)}
                                                            onChange={(e) => handleChange("validTo", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    {errors.validTo && <span className="error-msg">{errors.validTo}</span>}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="onBillingTotal">
                                                            <CiMoneyBill size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="onBillingTotal"
                                                            placeholder="Billing Total"
                                                            value={formValues.onBillingTotal || ""}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                if (/^\d*$/.test(v)) handleChange("onBillingTotal", v);
                                                            }}
                                                        />
                                                    </InputGroup>
                                                    {errors.onBillingTotal && (
                                                        <span className="error-msg">{errors.onBillingTotal}</span>
                                                    )}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="onVisitCount">
                                                            <CiMoneyBill size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="onVisitCount"
                                                            placeholder="Visit Count"
                                                            value={formValues.onVisitCount || ""}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                if (/^\d*$/.test(v)) handleChange("onVisitCount", v);
                                                            }}
                                                        />
                                                    </InputGroup>
                                                    {errors.onVisitCount && (
                                                        <span className="error-msg">{errors.onVisitCount}</span>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>On Item Qty</InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            value={formValues.onItemQty || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^\d*$/.test(value)) {
                                                                    handleChange("onItemQty", value);
                                                                }
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>On Item Size</InputGroup.Text>
                                                        <Form.Select
                                                            value={formValues.onItemSizeID || ""}
                                                            onChange={(e) => handleChange("onItemSizeID", e.target.value)}
                                                        >
                                                            <option>Select size</option>
                                                            {itemSizeData?.map((item) => (
                                                                <option key={item.sizeId} value={item.sizeId}>{item.sizeName}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Offer Qty</InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            value={formValues.offerQty || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^\d*$/.test(value)) {
                                                                    handleChange("offerQty", value);
                                                                }
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Offer Item Size</InputGroup.Text>
                                                        <Form.Select
                                                            value={formValues.offerItemSizeID || ""}
                                                            onChange={(e) => handleChange("offerItemSizeID", e.target.value)}
                                                        >
                                                            <option>Select size</option>
                                                            {itemSizeData?.map((item) => (
                                                                <option key={item.sizeId} value={item.sizeId}>{item.sizeName}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Offer %</InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            value={formValues.offeerPercentage || ""}
                                                            onChange={(e) => handleChange("offeerPercentage", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Next Visit Eligible</InputGroup.Text>
                                                        <Form.Check
                                                            type="switch"
                                                            label=""
                                                            checked={formValues.nextVisitEligibiity}
                                                            onChange={(e) => handleChange("nextVisitEligibiity", e.target.checked)}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Item Type</InputGroup.Text>
                                                        <Form.Select
                                                            value={formValues.itemTypeID || ""}
                                                            onChange={(e) => handleChange("itemTypeID", e.target.value)}
                                                        >
                                                            <option>Select item type</option>
                                                            {itemTypesData.map((item) => (
                                                                <option key={item.typeid} value={item.typeid}>{item.ItemTypeName}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Offer Item Type Qty</InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            value={formValues.offerItemTypeQty || ""}
                                                            onChange={(e) => handleChange("offerItemTypeQty", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text>Offer Price</InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            value={formValues.offerPrice || ""}
                                                            onChange={(e) => handleChange("offerPrice", e.target.value)}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="offerTypeId">
                                                            <MdOutlinePersonOutline size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Select
                                                            name="offerTypeId"
                                                            value={formValues.offerTypeId || ""}
                                                            onChange={(e) => handleChange("offerTypeId", e.target.value)}
                                                        >
                                                            <option>Select outlet</option>
                                                            {outletData?.map((item) => (
                                                                <option key={item.outletId} value={item.outletId}>
                                                                    {item.outletName}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </InputGroup>
                                                    {errors.offerTypeId && (
                                                        <span className="error-msg">{errors.offerTypeId}</span>
                                                    )}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup className="mb-4">
                                                        <InputGroup.Text id="freeCouponValue">
                                                            <MdOutlineLocalOffer size={25} color="#ffc800" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            name="freeCouponValue"
                                                            placeholder="Free Coupon Value"
                                                            value={formValues.freeCouponValue || ""}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                if (/^\d*$/.test(v)) handleChange("freeCouponValue", v);
                                                            }}
                                                        />
                                                    </InputGroup>
                                                    {errors.freeCouponValue && (
                                                        <span className="error-msg">{errors.freeCouponValue}</span>
                                                    )}
                                                </Col>
                                                <Col md={4}>
                                                    <InputGroup>
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
                                        </Form>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <div
                        className="position-fixed bottom-0 end-0 p-3"
                        style={{ zIndex: 1050, backgroundColor: '#fff' }}
                    >
                        <Button type="submit" variant="warning">
                            {isEditMode ? 'Update' : 'Save'}
                        </Button>
                    </div>
                    {/* </Form> */}
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

            {/* attached coupon */}
            <Offcanvas
                show={couponShow}
                onHide={handleCouponClose}
                backdrop="static"
                placement="end"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add Attached Coupon
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="offerId">
                                        <MdOutlineLocalOffer size={25} color="#ffc800" title='Offer' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="offerId"
                                        value={formCouValues.offerId || ""}
                                        onChange={(e) => handleCouChange("offerId", e.target.value)}
                                    >
                                        <option>Select offer</option>
                                        {offerData?.map((item) => (
                                            <option key={item.offerId} value={item.offerId}>
                                                {item.offerName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {couErrors.offerId && <span className="error-msg">{couErrors.offerId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponIds">
                                        <MdOutlinePersonOutline size={25} color="#ffc800" title='Coupon' />
                                    </InputGroup.Text>
                                    <Select
                                        name="couponIds"
                                        isMulti
                                        value={couponOptions?.filter(option =>
                                            formCouValues.couponIds?.includes(option.value)
                                        )}
                                        onChange={(selectedOptions) =>
                                            handleCouChange(
                                                "couponIds",
                                                selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                            )
                                        }
                                        options={couponOptions}
                                        placeholder="Select Coupon"
                                    />
                                    {couErrors.couponIds && <span className="error-msg">{couErrors.couponIds}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="couponOfferPercentage">
                                        <FaPercentage size={25} color='#ffc800' title='Coupon offer percentage' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="couponOfferPercentage"
                                        value={formCouValues.couponOfferPercentage || ""}
                                        onChange={(e) =>
                                            handleCouChange(
                                                "couponOfferPercentage",
                                                e.target.value.replace(/[^0-9.]/g, "")
                                            )
                                        }
                                        placeholder="coupon offer Percentage"
                                        aria-label="couponOfferPercentage"
                                        isInvalid={!!couErrors.couponOfferPercentage}
                                        isValid={formCouValues.couponOfferPercentage && !couErrors.couponOfferPercentage}
                                        autoComplete='off'
                                    />
                                    {couErrors.couponOfferPercentage && <span className="error-msg">{couErrors.couponOfferPercentage}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="appliedOn">
                                        <FaRegClock size={25} color="#ffc800" title="Applied On" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="datetime-local"
                                        name="appliedOn"
                                        value={formCouValues.appliedOn || ""}
                                        onChange={(e) =>
                                            handleCouChange("appliedOn", e.target.value)
                                        }
                                        placeholder="Applied On"
                                        aria-label="appliedOn"
                                        isInvalid={!!couErrors.appliedOn}
                                        isValid={formCouValues.appliedOn && !couErrors.appliedOn}
                                    />
                                    {couErrors.appliedOn && (
                                        <span className="error-msg">{couErrors.appliedOn}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="appliedRemarks">
                                        <FaRegCommentDots size={25} color="#ffc800" title="Applied Remarks" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        as="textarea"
                                        name="appliedRemarks"
                                        value={formCouValues.appliedRemarks || ""}
                                        onChange={(e) => handleCouChange("appliedRemarks", e.target.value)}
                                        placeholder="Applied Remarks"
                                        aria-label="appliedRemarks"
                                        isInvalid={!!couErrors.appliedRemarks}
                                        isValid={formCouValues.appliedRemarks && !couErrors.appliedRemarks}
                                        rows={3}
                                        autoComplete='off'
                                    />
                                    {couErrors.appliedRemarks && (
                                        <span className="error-msg">{couErrors.appliedRemarks}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="isApplied"
                                        checked={formCouValues.isApplied}
                                        onChange={(e) => handleCouChange("isApplied", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="isActive"
                                        checked={formCouValues.isActive}
                                        onChange={(e) => handleCouChange("isActive", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning" onClick={handleCouSubmit}>Save</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* attached customer */}
            <Offcanvas
                show={cusShow}
                onHide={handleCusClose}
                backdrop="static"
                placement="end"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add Attached Customer
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="offerId">
                                        <MdOutlineLocalOffer size={25} color="#ffc800" title='Offer' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="offerId"
                                        value={formCusValues.offerId || ""}
                                        onChange={(e) => handleCusChange("offerId", e.target.value)}
                                    >
                                        <option>Select offer</option>
                                        {offerData?.map((item) => (
                                            <option key={item.offerId} value={item.offerId}>
                                                {item.offerName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {cusErrors.offerId && <span className="error-msg">{cusErrors.offerId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="customerIds">
                                        <MdOutlinePersonOutline size={25} color="#ffc800" title='Customer' />
                                    </InputGroup.Text>
                                    <Select
                                        name="customerIds"
                                        isMulti
                                        value={customerOptions?.filter(option =>
                                            formCusValues.customerIds?.includes(option.value)
                                        )}
                                        onChange={(selectedOptions) =>
                                            handleCusChange(
                                                "customerIds",
                                                selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                            )
                                        }
                                        options={customerOptions}
                                        placeholder="Select Customers"
                                    />
                                    {cusErrors.customerIds && <span className="error-msg">{cusErrors.customerIds}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="offerCustomerPercentage">
                                        <FaPercentage size={25} color='#ffc800' title='Offer customerPer percentage' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="offerCustomerPercentage"
                                        value={formCusValues.offerCustomerPercentage || ""}
                                        onChange={(e) =>
                                            handleCusChange(
                                                "offerCustomerPercentage",
                                                e.target.value.replace(/[^0-9.]/g, "")
                                            )
                                        }
                                        placeholder="offer Customer Percentage"
                                        aria-label="offerCustomerPercentage"
                                        isInvalid={!!cusErrors.offerCustomerPercentage}
                                        isValid={formCusValues.offerCustomerPercentage && !cusErrors.offerCustomerPercentage}
                                        autoComplete='off'
                                    />
                                    {cusErrors.offerCustomerPercentage && <span className="error-msg">{cusErrors.offerCustomerPercentage}</span>}
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
                                        label="isActive"
                                        checked={formCusValues.isActive}
                                        onChange={(e) => handleCusChange("isActive", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning" onClick={handleCusSubmit}>Save</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Offer
