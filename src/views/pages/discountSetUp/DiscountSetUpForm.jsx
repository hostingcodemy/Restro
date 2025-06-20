import React, { useEffect, useRef, useState } from 'react';
import MenuBar from '../../Components/MenuBar';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Row, Col, Accordion, Table, Button } from "react-bootstrap";
import { MdOutlineDiscount } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../Context/CategoryContext';
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import api from '../../config/AxiosInterceptor';
import axios from 'axios';
import { FaAngleDown } from "react-icons/fa";

const DiscountSetUpForm = () => {

    const outletId = localStorage.getItem("outletId");
    const token = localStorage.getItem("accessToken");
    const nameRef = useRef(null);
    const fetchCalled = useRef(false);
    const navigate = useNavigate();
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        discountID: "",
        discountName: "",
        clientIDs: [],
        outletIds: [],
        itemIds: [],
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const [discountData, setDiscountData] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const [customerData, setCustomerData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [activeSection, setActiveSection] = useState('Item');

    const [activeKey, setActiveKey] = useState("0");


    const filteredItems = itemsData.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOutlets = outletData.filter((item) =>
        item.outletName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCustomers = customerData.filter((item) =>
        item.outletName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // useEffect(() => {
    //     if (fetchCalled.current) return;
    //     fetchCalled.current = true;
    //     fetchDiscountData();
    // }, []);

    useEffect(() => {
        setTimeout(() => {
            setDiscountData(dummyDiscounts);
        }, 500);
    }, []);


    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchItemData();
        fetchOutletData();
        fetchCustomerData();
    }, []);

    const fetchItemData = async () => {
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
            const res = await api.get(`/customers`, {

            });
            setCustomerData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const dummyDiscounts = [
        {
            Serial: 1,
            DiscountID: "8AA22613-65AA-4A4B-8123-8CAE1F376E0F",
            DiscountName: "gen25%",
            DiscountRate: 25,
            DiscountStart: "2025-04-28T08:40:45.850",
            DiscountEnd: "2025-05-02T08:30:45.850",
            Prefix: "GNRL",
            OnGrossNet: "G",
            CreatedBy: "074fa337-fbdf-4be5-a388-43563252b95a",
            CreatedDate: "2025-04-28T18:43:56.463",
            Ulm: null,
            Dlm: "2025-04-28T18:45:07.200",
            IsActive: 0
        },
        {
            Serial: 2,
            DiscountID: "8AA22613-65AA-4A4B-8123-8CAE1F376E0F",
            DiscountName: "gen35%",
            DiscountRate: 35,
            DiscountStart: "2025-04-28T08:40:45.850",
            DiscountEnd: "2025-05-02T08:30:45.850",
            Prefix: "GNRL",
            OnGrossNet: "G",
            CreatedBy: "074fa337-fbdf-4be5-a388-43563252b95a",
            CreatedDate: "2025-04-28T18:45:08.483",
            Ulm: "074fa337-fbdf-4be5-a388-43563252b95a",
            Dlm: "2025-04-28T18:46:13.123",
            IsActive: 0
        },
        {
            Serial: 3,
            DiscountID: "8AA22613-65AA-4A4B-8123-8CAE1F376E0F",
            DiscountName: "gen45%",
            DiscountRate: 45,
            DiscountStart: "2025-04-28T08:40:45.850",
            DiscountEnd: "2025-05-02T08:30:45.850",
            Prefix: "GNRL",
            OnGrossNet: "G",
            CreatedBy: "074fa337-fbdf-4be5-a388-43563252b95a",
            CreatedDate: "2025-04-28T18:46:13.123",
            Ulm: "074fa337-fbdf-4be5-a388-43563252b95a",
            Dlm: "2025-04-28T18:50:45.153",
            IsActive: 0
        },
        {
            Serial: 4,
            DiscountID: "3072A99E-123E-4162-A71D-C89ED0A04FB5",
            DiscountName: "gen55%",
            DiscountRate: 25,
            DiscountStart: "2025-04-28T08:40:45.850",
            DiscountEnd: "2025-05-02T08:30:45.850",
            Prefix: "GNRL",
            OnGrossNet: "G",
            CreatedBy: "074fa337-fbdf-4be5-a388-43563252b95a",
            CreatedDate: "2025-04-28T19:07:58.500",
            Ulm: null,
            Dlm: null,
            IsActive: 1
        }
    ];

    const fetchDiscountData = async () => {
        try {
            const res = await api.get(`/discounts`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setDiscountData(sortedData);
        } catch (error) {
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
        const {
            discountID,
            discountRate,
            discountStart,
            discountEnd,
            prefix,
            onGrossOrNet,
            discountOn
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!discountID) {
            isValid = false;
            errors.discountID = "Discount name is required.";
        }
        if (!discountRate) {
            isValid = false;
            errors.discountRate = "Discount rate is required";
        }
        if (!discountStart) {
            isValid = false;
            errors.discountStart = "Start date & time is required";
        }
        if (!discountEnd) {
            isValid = false;
            errors.discountEnd = "End date & time is required";
        }
        if (!prefix) {
            isValid = false;
            errors.prefix = "Prefix is required";
        }
        if (!onGrossOrNet) {
            isValid = false;
            errors.onGrossOrNet = "Gross or Net is required";
        }
        if (!discountOn) {
            isValid = false;
            errors.discountOn = "Discount type is required";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }

        const payload = {
            discounts: [
                {
                    discountID: formValues.discountID,
                    clientIDs: selectedCustomers.map(c => c.customerID),
                    outletIds: selectedOutlets.map(o => o.outletID),
                    itemIds: selectedItems.map(i => i.itemId),
                    isActive: true,
                },
            ],
        };

        try {
            let res;
            if (formValues.discountId) {
                res = await api.put(`/discount/${formValues.discountId}`, payload);
            } else {
                res = await axios.post("http://192.168.0.110:5000/api/v1/discountsetup", payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            setFormValues(initialValues);
            toast.success(res.data.successMessage || "Success!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                navigate("/discounts");
            }, 3000);
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
        }
    };

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedOutlets, setSelectedOutlets] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);


    const handleItemRowClick = (item) => {
        setSelectedItems((prevSelected) => {
            const alreadySelected = prevSelected.find((i) => i.itemId === item.itemId);
            if (alreadySelected) {
                // Remove if already selected
                return prevSelected.filter((i) => i.itemId !== item.itemId);
            } else {
                // Add if not selected
                return [...prevSelected, item];
            }
        });
    };

    const handleOutletRowClick = (outlet) => {
        setSelectedOutlets((prevSelected) => {
            const alreadySelected = prevSelected.find((o) => o.outletID === outlet.outletID);
            if (alreadySelected) {
                return prevSelected.filter((o) => o.outletID !== outlet.outletID);
            } else {
                return [...prevSelected, outlet];
            }
        });
    };

    const handleCustomerRowClick = (customer) => {
        setSelectedCustomers((prevSelected) => {
            const alreadySelected = prevSelected.find((c) => c.customerID === customer.customerID);
            if (alreadySelected) {
                return prevSelected.filter((c) => c.customerID !== customer.customerID);
            } else {
                return [...prevSelected, customer];
            }
        });
    };

    const sectionKeyMap = {
        Item: "0",
        Outlet: "1",
        Customer: "2",
    };


    return (
        <>
            <div className='d-flex'>
                <MenuBar />
                <ToastContainer />

                <div className="configurationFormContainer">
                    <div className='configurationCenterFormWrapper'>
                        <div className="d-flex justify-content-between align-items-center configurationgroupFormHeader w-100">
                            <h2>Add <span>Discount</span> <span>Setup</span></h2>
                            <Button variant="warning" className="rounded-pill">
                                VIEWS
                            </Button>
                        </div>

                        <Form className="w-100">
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group controlId="discountID">
                                        <div className="configurationSelectWrapper shadow-sm" style={{ width: "30rem" }}>
                                            <div className="configurationIconWrapper">
                                                <MdOutlineDiscount size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountID || formValues.discountID ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountID || formValues.discountID ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountID || formValues.discountID ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountID || formValues.discountID ? "12px" : "14px",
                                                    color: "orange",
                                                    backgroundColor: "#fff",
                                                    padding: focus.discountID || formValues.discountID ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Select Discount Name
                                            </div>
                                            <Select
                                                name="discountID"
                                                isSearchable
                                                placeholder=""
                                                value={formValues.discountID ? discountData?.find((item) => item.value === formValues.discountID) : null}
                                                ref={nameRef}
                                                onChange={(selectedOption) => handleChange("discountID", selectedOption.value)}
                                                onFocus={() => setFocus((prev) => ({ ...prev, discountID: true }))}
                                                onBlur={() => setFocus((prev) => ({ ...prev, discountID: false }))}
                                                options={discountData?.map((item) => ({
                                                    label: item.DiscountName,
                                                    value: item.DiscountID,
                                                }))}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        border: "none",
                                                        boxShadow: "none",
                                                        backgroundColor: "transparent",
                                                        height: "1.5rem",
                                                        width: "27rem",
                                                        fontSize: "14px",
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "#8c8c8c",
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: "#333",
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountID && errors.discountID}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex justify-content-end" style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "10px" }}>
                                        <span
                                            style={{
                                                borderBottom: activeKey === "0" ? "2px solid yellow" : "none",
                                                marginRight: "10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setActiveKey("0");
                                                setActiveSection("Item");
                                            }}
                                        >
                                            Item
                                        </span>
                                        &gt;
                                        <span
                                            style={{
                                                borderBottom: activeKey === "1" ? "2px solid yellow" : "none",
                                                margin: "0 10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setActiveKey("1");
                                                setActiveSection("Outlet");
                                            }}
                                        >
                                            Outlet
                                        </span>
                                        &gt;
                                        <span
                                            style={{
                                                borderBottom: activeKey === "2" ? "2px solid yellow" : "none",
                                                marginLeft: "10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setActiveKey("2");
                                                setActiveSection("Customer");
                                            }}
                                        >
                                            Customer
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Accordion
                                    activeKey={activeKey}
                                    onSelect={(key) => {
                                        setActiveKey(key);
                                        const section = Object.keys(sectionKeyMap).find((k) => sectionKeyMap[k] === key);
                                        setActiveSection(section);
                                    }}
                                >
                                    <Accordion activeKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <div className="ms-2 d-flex flex-column gap-2">
                                                    {selectedItems.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {selectedItems.map((i) => (
                                                                <span
                                                                    key={i.itemId}
                                                                    className="badge bg-warning text-dark d-flex align-items-center"
                                                                >
                                                                    {i.itemName}
                                                                    <span
                                                                        className="ms-2"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedItems((prev) =>
                                                                                prev.filter((item) => item.itemId !== i.itemId)
                                                                            );
                                                                        }}
                                                                    >
                                                                        ❌
                                                                    </span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {["1", "2"].includes(activeKey) && selectedOutlets.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {selectedOutlets.map((o) => (
                                                                <span
                                                                    key={o.outletID}
                                                                    className="badge bg-info text-dark d-flex align-items-center"
                                                                >
                                                                    {o.outletName}
                                                                    <span
                                                                        className="ms-2"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedOutlets((prev) =>
                                                                                prev.filter((outlet) => outlet.outletID !== o.outletID)
                                                                            );
                                                                        }}
                                                                    >
                                                                        ❌
                                                                    </span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {activeKey === "0" && (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <Form.Group className="d-flex align-items-center mb-0" controlId="formItemName">
                                                                <Form.Label className="me-2 mb-0" style={{ minWidth: "100px" }}>Items</Form.Label>
                                                                <Form.Control
                                                                    type="search"
                                                                    placeholder="Search Items..."
                                                                    className="me-2 rounded-pill"
                                                                    aria-label="Search"
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    style={{ width: "550px" }}
                                                                />
                                                            </Form.Group>

                                                            <Button variant="warning" className="rounded-pill">
                                                                Sort By <FaAngleDown />
                                                            </Button>
                                                        </div>

                                                        <Table bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Code</th>
                                                                    <th>Type</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredItems.length > 0 ? (
                                                                    filteredItems.map((item) => (
                                                                        <tr
                                                                            key={item.itemId}
                                                                            onClick={() => handleItemRowClick(item)}
                                                                            className={selectedItems.some((i) => i.itemId === item.itemId) ? "yellow" : "white"}
                                                                        >
                                                                            <td>{item.itemName}</td>
                                                                            <td>{item.itemCode}</td>
                                                                            <td>{item.itemType}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="3" className="text-center text-muted">No item found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                )}

                                                {activeKey === "1" && (
                                                    <>
                                                        <Form.Group className="mb-3 d-flex align-items-center" controlId="formOutletName">
                                                            <Form.Label className="me-2 mb-0" style={{ minWidth: "100px" }}>Outlets</Form.Label>
                                                            <Form.Control
                                                                type="search"
                                                                placeholder="Search Outlet..."
                                                                className="me-2 rounded-pill"
                                                                aria-label="Search"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                style={{ width: "550px" }}
                                                            />
                                                        </Form.Group>

                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Code</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredOutlets.length > 0 ? (
                                                                    filteredOutlets.map((outlet) => (
                                                                        <tr
                                                                            key={outlet.outletID}
                                                                            onClick={() => handleOutletRowClick(outlet)}
                                                                            className={selectedOutlets.some((o) => o.outletID === outlet.outletID) ? "yellow" : "white"}
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            <td>{outlet.outletName}</td>
                                                                            <td>{outlet.outletCode}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="2" className="text-center text-muted">No outlet found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                )}

                                                {activeKey === "2" && (
                                                    <>
                                                        <Form.Group className="mb-3 d-flex align-items-center" controlId="formCustomerName">
                                                            <Form.Label className="me-2 mb-0" style={{ minWidth: "100px" }}>Customers</Form.Label>
                                                            <Form.Control
                                                                type="search"
                                                                placeholder="Search Customer..."
                                                                className="me-2 rounded-pill"
                                                                aria-label="Search"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                style={{ width: "550px" }}
                                                            />
                                                        </Form.Group>

                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Client Code</th>
                                                                    <th>DOB</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredCustomers.length > 0 ? (
                                                                    filteredCustomers.map((customer) => (
                                                                        <tr
                                                                            key={customer.customerID}
                                                                            onClick={() => handleCustomerRowClick(customer)}
                                                                            className={selectedCustomers.some((c) => c.customerID === customer.customerID) ? "yellow" : "white"}
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            <td>{customer.firstName} {customer.lastName}</td>
                                                                            <td>{customer.customerID}</td>
                                                                            <td>{new Date(customer.dateOfBirth).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="3" className="text-center text-muted">No customer found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Accordion>
                            </Row>
                            {["0", "1"].includes(activeKey) && (
                               <div
                               style={{ textAlign: "center", marginTop: "20px", cursor: "pointer" }}
                               onClick={() => {
                                   if (activeKey === "0") setActiveKey("1");
                                   else if (activeKey === "1") setActiveKey("2");
                               }}
                           >
                               <span style={{ textDecoration: "underline", color: "yellow", fontWeight: "bold" }}>N</span>
                               <span style={{ color: "black", marginLeft: "5px" }}>
                                   EXT
                                   <span
                                       style={{
                                           display: "inline-block",
                                           backgroundColor: "yellow",
                                           color: "black",
                                           borderRadius: "50%",
                                           padding: "0 8px",
                                           marginLeft: "5px",
                                           fontWeight: "bold",
                                           lineHeight: "1.5",
                                       }}
                                   >
                                       &gt;
                                   </span>
                               </span>
                           </div>
                            )}
                        </Form>

                        {activeKey === "2" && (
                            <div className="submitBtnWrapper d-flex justify-content-center bg-white w-100">
                                <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                                    Submit
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DiscountSetUpForm
