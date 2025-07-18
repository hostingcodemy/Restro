import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit, FaMicrophone, FaExclamationTriangle, FaTimesCircle, FaTrash } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { Form, Button, Offcanvas, InputGroup, Spinner, Row, Col, Table } from "react-bootstrap";
import { MdOutlineDiscount } from "react-icons/md";
import { PiMicrophoneThin } from "react-icons/pi";
import { decryptData } from '../../../config/secureStorage';

const DiscountSetUp = () => {

    const initialValues = {
        discountID: "",
        isActive: true,
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [discountSetData, setDiscountSetData] = useState([]);
    const [discountData, setDiscountData] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchParam = ["discountName", "isActive"];
    const [activeStep, setActiveStep] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [itemSearch, setItemSearch] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [outletData, setOutletData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [outletSearch, setOutletSearch] = useState("");
    const [selectedOutlets, setSelectedOutlets] = useState([]);
    const [selectAllOutlet, setSelectAllOutlet] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState([]);
    const [selectAllCustomer, setSelectAllCustomer] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState({});

    const filteredItems = itemsData?.filter((item) =>
        [item.itemName, item.itemCode, item.itemSubGroupName, item.itemCategoryName, item.itemSubCategoryName, item.itemSizeName, item.itemType].some(
            (field) => field && field.toLowerCase().includes(itemSearch.toLowerCase())
        )
    );

    const filteredOutlets = outletData?.filter((outlet) =>
        [outlet.outletName, outlet.outletCode].some(
            (field) => field && field.toLowerCase().includes(outletSearch.toLowerCase())
        )
    );
    const filteredCustomers = customerData?.filter((customer) =>
        [customer.name, customer.memberTypeName, customer.phone].some(
            (field) => field && field.toLowerCase().includes(customerSearch.toLowerCase())
        )
    );

    useEffect(() => {
        const handleStorageChange = () => {
            const encryptedOutletId = localStorage.getItem("currentOutletId");
            if (encryptedOutletId) {
                const outletId = decryptData(encryptedOutletId);
            }
        };

        window.addEventListener('outlet-changed', handleStorageChange);
        handleStorageChange();

        return () => {
            window.removeEventListener('outlet-changed', handleStorageChange);
        };
    }, []);


    const handleShowFirst = async (e, isEditing = false) => {
        if (e?.preventDefault) e.preventDefault();

        if (!isEditing) {
            setFormValues(initialValues);
            setIsEditMode(false);
        } else {
            setIsEditMode(true);
        }

        setErrors({});
        setActiveStep(1);

        fetchDiscountData();
        const encrypted = localStorage.getItem("currentOutletId");
        const outletId = encrypted ? decryptData(encrypted) : null;
        if (outletId) await fetchItemData(outletId);
        fetchOutletData();
        fetchCustomerData();
    };

    const handleCloseAll = () => {
        setActiveStep(0);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchDiscountSetupData();
    }, []);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        setSelectedItems(checked ? filteredItems.map((item) => item.itemId) : []);
    };

    const handleItemCheck = (itemId) => {
        setSelectedItems((prevSelected) => {
            const newSelected = prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId];

            setSelectAll(newSelected.length === filteredItems.length);
            return newSelected;
        });
    };

    const handleSelectAllOutlet = (e) => {
        const checked = e.target.checked;
        setSelectAllOutlet(checked);
        setSelectedOutlets(checked ? filteredOutlets.map((o) => o.outletId) : []);
    };

    const handleCheckOutlet = (id) => {
        setSelectedOutlets((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id];
            const allSelected =
                updated.length === filteredOutlets.length && filteredOutlets.length > 0;
            setSelectAllOutlet(allSelected);

            return updated;
        });
    };

    const handleSelectAllCustomer = (e) => {
        const checked = e.target.checked;
        setSelectAllCustomer(checked);
        setSelectedCustomer(checked ? filteredCustomers.map(c => c.customerID) : []);
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

    const handleCheckCustomer = (id) => {
        setSelectedCustomer((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id];
            const allSelected =
                updated.length === filteredCustomers.length && filteredCustomers.length > 0;
            setSelectAllCustomer(allSelected);

            return updated;
        });
    };

    // const handleSizeClick = (itemId, itemSizeId) => {
    //     setSelectedSizes((prev) => {
    //         const current = prev[itemId] || [];
    //         const updated = current.includes(itemSizeId)
    //             ? current.filter(id => id !== itemSizeId)
    //             : [...current, itemSizeId];

    //         return { ...prev, [itemId]: updated };
    //     });
    // };

    const handleSizeClick = (itemId, sizeId) => {
        setSelectedSizes(prev => {
            const currentSizes = prev[itemId] || [];
            const isSelected = currentSizes.includes(sizeId);

            return {
                ...prev,
                [itemId]: isSelected
                    ? currentSizes.filter(id => id !== sizeId) // remove if already selected
                    : [...currentSizes, sizeId],              // add if not
            };
        });
    };


    const fetchDiscountSetupData = async () => {
        try {
            const res = await api.get(`/discountsetup`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setDiscountSetData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchDiscountData = async () => {
        try {
            const res = await api.get(`/discount`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setDiscountData(sortedData);
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

    // const handleEditClick = (row) => {
    //     setFormValues(prev => ({
    //         ...prev,
    //         discountID: String(row.discountID),
    //         isActive: row.isActive,
    //     }));

    //     const customerIds = row.customers.map(c => c.customerID);
    //     setSelectedCustomer(customerIds);

    //     const outletIds = row.discountDetails.map(d => d.outletId);
    //     setSelectedOutlets(outletIds);

    //     const itemIds = new Set();
    //     const sizeMap = {};

    //     row.discountDetails.forEach(outlet => {
    //         outlet.items.forEach(item => {
    //             itemIds.add(item.itemId);
    //             const sizeIds = item.itemsizes
    //                 .filter(size => size.itemSizeId && size.itemSizeName)
    //                 .map(size => size.itemSizeId);
    //             sizeMap[item.itemId] = sizeIds;
    //         });
    //     });

    //     setSelectedItems([...itemIds]);
    //     setSelectedSizes(sizeMap);
    //     handleShowFirst(null, true);
    // };

    const handleEditClick = (row) => {
        console.log(row);

        /* ---------- 1. basic edit‑mode setup ---------- */
        setIsEditMode(true);
        setFormValues(prev => ({
            ...prev,
            discountID: String(row.discountID),
            isActive: row.isActive,
        }));

        /* ---------- 2. customers & outlets ---------- */
        setSelectedCustomer(row.customers.map(c => c.customerID));
        setSelectedOutlets(row.discountDetails.map(d => d.outletId));

        /* ---------- 3. items & sizes (fixed) ---------- */
        const itemIds = new Set();
        const sizeMap = {};           // { itemId: [sizeId, ...] }

        // ✅ <‑‑‑‑‑ this is the code you asked about
        row.discountDetails.forEach(outlet => {
            outlet.items.forEach(item => {
                itemIds.add(item.itemId);

                const sizeIds = item.itemsizes
                    .filter(s => s.itemSizeId && s.itemSizeName)
                    .map(s => s.itemSizeId);

                if (!sizeMap[item.itemId]) {
                    sizeMap[item.itemId] = [...sizeIds];         // first time
                } else {
                    sizeMap[item.itemId] = [
                        ...new Set([...sizeMap[item.itemId], ...sizeIds]), // merge & dedupe
                    ];
                }
            });
        });
        // ✅ <‑‑‑‑‑ end of merge logic

        setSelectedItems([...itemIds]);
        setSelectedSizes(sizeMap);

        /* ---------- 4. finally open the drawer ---------- */
        handleShowFirst(null, true);   // pass “edit” flag
    };

    const handleDeleteClick = (discountID, discountName) => {
        setToDelete({ id: discountID, name: discountName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/discountsetup/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Discount setup deleted successfully!");
                fetchDiscountSetupData();
            })
            .catch((error) => {
                console.error("Error deleting item size:", error);
                toast.error("Failed to delete item size.");
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
            name: <h5>Name</h5>,
            selector: (row) => row.discountName,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <span
                    style={{
                        color: row.isActive ? "green" : "red",
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
                    <Link className="action-icon"
                        onClick={() => {
                            handleEditClick(row);
                        }}
                    >
                        <FaRegEdit size={24} color="blue" title='Edit' />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.discountID, row.discountName)}>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="red" title='Delete' />
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
                <Button variant="warning" onClick={(e) => handleShowFirst(e, false)}>
                    <GoPlus size={20} /> Add
                </Button>
            </div>
        );
    }, []);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validation
    //     if (!formValues.discountID) {
    //         toast.error("Please select a discount.");
    //         return;
    //     }

    //     if (selectedItems.length === 0) {
    //         toast.error("Please select at least one item.");
    //         return;
    //     }

    //     const itemSizeIds = Object.values(selectedSizes).flat();

    //     if (itemSizeIds.length === 0) {
    //         toast.error("Please select at least one item size.");
    //         return;
    //     }

    //     if (selectedOutlets.length === 0) {
    //         toast.error("Please select at least one outlet.");
    //         return;
    //     }

    //     if (selectedCustomer.length === 0) {
    //         toast.error("Please select at least one customer.");
    //         return;
    //     }

    //     const payload = [
    //         {
    //             discountID: formValues.discountID,
    //             itemIds: selectedItems,
    //             itemSizeId: [...itemSizeIds],
    //             outletIds: selectedOutlets,
    //             customerID: selectedCustomer,
    //             isActive: formValues.isActive ?? true,
    //         }
    //     ];
    //     setLoading(true);
    //     try {
    //         let res;
    //         if (isEditMode) {
    //             res = await api.put(`/discountsetup/${formValues.discountID}`, payload);
    //         } else {
    //             res = await api.post("/discountsetup", payload);
    //         }
    //         toast.success(response.data.successMessage || "Discount setup saved successfully!");
    //         setFormValues({ discountID: "", isActive: true });
    //         setSelectedItems([]);
    //         setSelectedSizes({});
    //         setSelectedOutlets([]);
    //         setSelectedCustomer([]);
    //         setSelectAll(false);
    //         setSelectAllOutlet(false);
    //         setSelectAllCustomer(false);
    //         handleCloseAll();
    //         fetchDiscountSetupData();
    //     } catch (error) {
    //         console.error("Error saving discount setup:", error);
    //         toast.error(
    //             error?.response?.data?.errorMessage ||
    //             error?.response?.data?.message ||
    //             "Failed to save discount setup."
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!formValues.discountID) {
            return toast.error("Please select a discount.");
        }
        if (selectedItems.length === 0) {
            return toast.error("Please select at least one item.");
        }
        if (selectedOutlets.length === 0) {
            return toast.error("Please select at least one outlet.");
        }
        // if (selectedCustomer.length === 0) {
        //     return toast.error("Please select at least one customer.");
        // }
      
        const itemSizeIds = [
            ...new Set(                                 
                selectedItems.flatMap(                    
                    (itemId) => selectedSizes[itemId] || [] 
                )
            ),
        ];

        if (itemSizeIds.length === 0) {
            return toast.error("Please select at least one item size.");
        }
     
        const payload = [
            {
                discountID: String(formValues.discountID),
                itemIds: selectedItems.map(String),
                itemSizeId: itemSizeIds.map(String),
                outletIds: selectedOutlets.map(String),
                customerID: selectedCustomer.map(String),
                isActive: formValues.isActive ?? true,
            },
        ];
       
        setLoading(true);
        try {
            const url = isEditMode
                ? `/discountsetup/${formValues.discountID}`
                : "/discountsetup";

            const res = isEditMode
                ? await api.put(url, payload)
                : await api.post(url, payload);

            toast.success(
                res.data?.successMessage || "Discount setup saved successfully!"
            );
           
            setFormValues({ discountID: "", isActive: true });
            setSelectedItems([]);
            setSelectedSizes({});
            setSelectedOutlets([]);
            setSelectedCustomer([]);
            setSelectAll(false);
            setSelectAllOutlet(false);
            setSelectAllCustomer(false);
            setIsEditMode(false);
            handleCloseAll();
            fetchDiscountSetupData();
        } catch (error) {
            console.error("Error saving discount setup:", error);
            toast.error(
                error?.response?.data?.errorMessage ||
                error?.response?.data?.message ||
                "Failed to save discount setup."
            );
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
                            data={DataTableSettings.filterItems(discountSetData, searchParam, filterText)}
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
                show={activeStep === 1}
                onHide={handleCloseAll}
                placement="end"
                backdrop="false"
                className="custom-offcanvass">
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Discount Setup" : "Add Discount Setup"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row>
                            <Col md={3}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text>
                                        <MdOutlineDiscount size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="discountID"
                                        value={formValues.discountID || ""}
                                        onChange={(e) => handleChange("discountID", e.target.value)}
                                    >
                                        <option value="">Select Discount</option>
                                        {discountData?.map((item) => (
                                            <option key={item.discountID} value={item.discountID}>
                                                {item.discountName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {/* {errors.discountID && <span className="error-msg">{errors.discountID}</span>} */}
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong className="me-3">Items</strong>
                            <InputGroup className="w-auto">
                                <Form.Control
                                    type="search"
                                    placeholder="Search..."
                                    aria-label="Search"
                                    className="rounded-pill pe-5"
                                    style={{ paddingRight: "2.5rem" }}
                                    value={itemSearch}
                                    onChange={(e) => setItemSearch(e.target.value)}
                                />
                                <InputGroup.Text
                                    style={{
                                        marginLeft: "-3rem",
                                        background: "transparent",
                                        border: "none",
                                        zIndex: 10,
                                    }}
                                >
                                    <PiMicrophoneThin size={25} color="gold" />
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <Table striped bordered hover size="sm" className="mb-0">
                                <thead>
                                    <tr>
                                        <th className="text-center align-middle">
                                            <div className="d-inline-flex align-items-center justify-content-center gap-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                                All
                                            </div>
                                        </th>
                                        <th>Item Name</th>
                                        <th>Sub Group</th>
                                        <th>Category</th>
                                        <th>Sub Category</th>
                                        <th>Code</th>
                                        <th>Size</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.length > 0 ? (
                                        filteredItems?.map((item) => (
                                            <tr key={item.itemId}>
                                                <td className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                        checked={selectedItems.includes(item.itemId)}
                                                        onChange={() => handleItemCheck(item.itemId)}
                                                    />
                                                </td>
                                                <td>{item.itemName}</td>
                                                <td>{item.itemSubGroupName}</td>
                                                <td>{item.itemCategoryName}</td>
                                                <td>{item.itemSubCategoryName}</td>
                                                <td>{item.itemCode}</td>
                                                <td>
                                                    {item.prices?.map((price) => (
                                                        <span
                                                            key={price.itemSizeId}
                                                            onClick={() => handleSizeClick(item.itemId, price.itemSizeId)}
                                                            style={{
                                                                cursor: "pointer",
                                                                padding: "2px 6px",
                                                                marginRight: "4px",
                                                                borderRadius: "4px",
                                                                backgroundColor: selectedSizes[item.itemId]?.includes(price.itemSizeId) ? "yellow" : "transparent",
                                                                border:
                                                                    selectedSizes[item.itemId]?.includes(price.itemSizeName)
                                                                        ? "1px solid #ccc"
                                                                        : "1px solid transparent",
                                                            }}
                                                        >
                                                            {price.itemSizeName}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>{item.itemType}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center text-muted">
                                                No matching items found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <div className='mt-3'>
                            <Row>
                                <Col md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong className="me-3">Outlets</strong>
                                        <InputGroup className="w-auto">
                                            <Form.Control
                                                type="search"
                                                placeholder="Search..."
                                                value={outletSearch}
                                                onChange={(e) => setOutletSearch(e.target.value)}
                                                className="rounded-pill pe-5"
                                                style={{ paddingRight: "2.5rem" }}
                                            />
                                            <InputGroup.Text
                                                style={{
                                                    marginLeft: "-3rem",
                                                    background: "transparent",
                                                    border: "none",
                                                    zIndex: 10,
                                                }}
                                            >
                                                <PiMicrophoneThin size={25} color="gold" />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>

                                    <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                                        <Table striped bordered hover size="sm" className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-center align-middle">
                                                        <div className="d-inline-flex align-items-center justify-content-center gap-2">
                                                            <Form.Check
                                                                type="checkbox"
                                                                style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                                checked={selectAllOutlet}
                                                                onChange={handleSelectAllOutlet}
                                                            />
                                                            All
                                                        </div>
                                                    </th>
                                                    <th>Outlet</th>
                                                    <th>Code</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOutlets.length > 0 ? (
                                                    filteredOutlets.map((outlet) => (
                                                        <tr key={outlet.outletId}>
                                                            <td className="text-center">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                                    checked={selectedOutlets.includes(outlet.outletId)}
                                                                    onChange={() => handleCheckOutlet(outlet.outletId)}
                                                                />
                                                            </td>
                                                            <td>{outlet.outletName}</td>
                                                            <td>{outlet.outletCode}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center text-muted">
                                                            No matching outlets found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong className="me-3">Customer</strong>
                                        <InputGroup className="w-auto">
                                            <Form.Control
                                                type="search"
                                                placeholder="Search..."
                                                value={customerSearch}
                                                onChange={(e) => setCustomerSearch(e.target.value)}
                                                className="rounded-pill pe-5"
                                                style={{ paddingRight: "2.5rem" }}
                                            />
                                            <InputGroup.Text
                                                style={{
                                                    marginLeft: "-3rem",
                                                    background: "transparent",
                                                    border: "none",
                                                    zIndex: 10,
                                                }}
                                            >
                                                <PiMicrophoneThin size={25} color="gold" />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>

                                    <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                                        <Table striped bordered hover size="sm" className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-center align-middle">
                                                        <div className="d-inline-flex align-items-center justify-content-center gap-2">
                                                            <Form.Check
                                                                type="checkbox"
                                                                style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                                checked={selectAllCustomer}
                                                                onChange={handleSelectAllCustomer}
                                                            />
                                                            All
                                                        </div>
                                                    </th>
                                                    <th>Customer Name</th>
                                                    <th>Member Type</th>
                                                    <th>Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map((customer) => (
                                                        <tr key={customer.customerID}>
                                                            <td className="text-center">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    style={{ transform: "scale(1.5)", marginRight: "0.25rem" }}
                                                                    checked={selectedCustomer.includes(customer.customerID)}
                                                                    onChange={() => handleCheckCustomer(customer.customerID)}
                                                                />
                                                            </td>
                                                            <td>{customer.name}</td>
                                                            <td>{customer.memberTypeName}</td>
                                                            <td>{customer.phone}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="text-center text-muted">
                                                            No matching customers found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <Button type="submit" variant="warning" onClick={handleSubmit}>
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default DiscountSetUp
