import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Row, Col, Spinner, Table } from "react-bootstrap";
import { MdDeleteForever, MdOutlineFastfood, MdProductionQuantityLimits } from "react-icons/md";
import { FaRegEdit, FaRegFile } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { FaObjectUngroup } from "react-icons/fa6";
import { TbHandClick, TbCategoryPlus, TbPencilCode } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { LiaProductHunt, LiaWeightSolid } from "react-icons/lia";
import { LuTypeOutline } from "react-icons/lu";
import { IoBarcodeOutline, IoPricetagOutline } from "react-icons/io5";

const Item = () => {

  const location = useLocation();
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (location.state?.permissions) {
      setPermissions(location.state.permissions);
    }
  }, [location.state?.permissions]);
  const outletId = localStorage.getItem("outletId");

  const initialValues = {
    itemId: "",
    itemName: "",
    itemGroupId: "",
    itemSubGroupId: "",
    itemCategoryId: "",
    itemSubCategoryId: "",
    productType: "",
    itemType: "",
    uom: "",
    itemCode: "",
    itemImage: "",
    hsnCode: "",
    qrCode: "",
    itemQuantity: "",
    itemPrice: "",
    outletId: "",
    taxId: "",
    itemSize: "",
    isSoldMRP: false,
    isDiscountable: false,
    isVisible: false,
    isActive: false,
    taxWithDiscount: false,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [groupData, setGroupData] = useState([]);
  const [subGroupData, setSubGroupData] = useState([]);
  const [itemTypeData, setItemTypeData] = useState([]);
  const [itemSubTypeData, setItemSubTypeData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [itemSizeData, setItemSizeData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const fetchCalled = useRef(false);
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useState([]);
  const searchParam = ["itemName", "isActive"];
  const [isEditMode, setIsEditMode] = useState(false);
  const [show, setShow] = useState(false);
  const [expoShow, setExpoShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mappingShow, setMappingShow] = useState(false);
  const handleExpoClose = () => setExpoShow(false);
  const handleExpoShow = () => setExpoShow(true);
  const handleMappingClose = () => setMappingShow(false);
  const handleMappingShow = () => {
    setMappingShow(true);
    setShow(false);
  };


  const handleClose = () => {
    setShow(false);
    setFormValues(initialValues);
    setErrors({});
    setIsEditMode(false);
    fetchGroupData();
    fetchOutletData();
    fetchTaxData();
    fetchUomData();
  };

  const handleShow = () => {
    setFormValues(initialValues);
    setIsEditMode(false);
    setErrors({});
    setShow(true);
    fetchGroupData();
    fetchOutletData();
    fetchTaxData();
    fetchUomData();
    fetchItemSizeData();
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchItemData();
    fetchOutletTaxData();
  }, []);

  const itemTypeOptions = [
    { label: "Veg", value: "Veg" },
    { label: "NonVeg", value: "NonVeg" },
  ];

  const productTypeOptions = [
    { label: "S - Saleable Item", value: "Saleable Item" },
    { label: "O - Stockable Item", value: "Stockable Item" },
    { label: "P - Purchase Item", value: "Purchase Item" },
  ];

  const fetchItemData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/outlet/849065aa-9146-42e9-9acc-59ee060e007f`);
      //const res = await api.get(`/items/outlet/${outletId}`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setItemsData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/itemgroups`);
      setGroupData(res.data.list);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubGroupData = async (groupId) => {
    try {
      const res = await api.get(`/itemsubgroups/group/${groupId}`);
      setSubGroupData(res?.data?.list);
    } catch (error) {
      console.error("Error fetching subgroup data", error);
    }
  };

  const fetchItemTypeData = async (subgroupid) => {
    try {
      const res = await api.get(`/itemcategory/subgroup/${subgroupid}`);
      setItemTypeData(res.data.list);
    } catch (error) {
      console.error("Error fetching subgroup data", error);
    }
  };

  const fetchItemSubTypeData = async (categoryid) => {
    try {
      const res = await api.get(`/itemsubcategory/category/${categoryid}`);
      setItemSubTypeData(res.data.list);
    } catch (error) {
      console.error("Error fetching subgroup data", error);
    }
  };

  const fetchUomData = async () => {
    try {
      const res = await api.get(`/uom`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setUomData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };

  const fetchOutletData = async () => {
    try {
      const res = await api.get("/outlets");
      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setOutletData(sortedData);
    } catch (error) {
      console.error("Error fetching outlet data", error);
    }
  };

  const fetchOutletTaxData = async (itemSubGroupId) => {
    try {
      const outletId = "8451cb46-2d5c-4aa7-a794-5965f6c5c6bd";
      const subgroupId = "4f76b1f3-4188-4eda-aa4c-97c3a2ffbec8";

      const res = await api.get(`/outletsubgrouptax/${outletId}/${subgroupId}`);

      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setOutletData(sortedData);
    } catch (error) {
      console.error("Error fetching outlet data", error);
    }
  };

  const fetchTaxData = async () => {
    try {
      const res = await api.get("/tax");
      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setTaxData(sortedData);
    } catch (error) {
      console.error("Error fetching tax data", error);
    }
  };

  const fetchItemSizeData = async () => {
    try {
      const res = await api.get("/itemsize");
      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setItemSizeData(sortedData);
    } catch (error) {
      console.error("Error fetching item size data", error);
    }
  };

  const handleChange = (name, value) => {
    if (formValues[name] === value) return;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      ...(name === "itemGroupId" && { itemSubGroupId: "", itemCategoryId: "", itemSubCategoryId: "" }),
      ...(name === "itemSubGroupId" && { itemCategoryId: "", itemSubCategoryId: "" }),
      ...(name === "itemCategoryId" && { itemSubCategoryId: "" })
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "itemGroupId") {
      fetchSubGroupData(value);
    }

    if (name === "itemSubGroupId") {
      fetchItemTypeData(value);
    }

    if (name === "itemCategoryId") {
      fetchItemSubTypeData(value);
    }
  };

  const validateForm = () => {
    const {
      itemName,
      itemGroupId,
      itemSubGroupId,
      itemCategoryId,
      itemSubCategoryId,
      itemType,
      uom,
      itemCode,
      hsnCode,
      qrCode,
      productType,
      itemSize,
    } = formValues;
    const errors = {};
    let isValid = true;

    if (!itemName) {
      isValid = false;
      errors.itemName = "Item name is required.";
    }
    if (!itemGroupId) {
      isValid = false;
      errors.itemGroupId = "Group is required";
    }
    if (!itemSubGroupId) {
      isValid = false;
      errors.itemSubGroupId = "Sub group is required";
    }
    if (!itemCategoryId) {
      isValid = false;
      errors.itemCategoryId = "Item category is required";
    }
    if (!itemSubCategoryId) {
      isValid = false;
      errors.itemSubCategoryId = "Item sub category is required";
    }
    if (!itemCode) {
      isValid = false;
      errors.itemCode = "Item code is required";
    }
    if (!uom) {
      isValid = false;
      errors.uom = "Uom is required";
    }
    if (!itemType) {
      isValid = false;
      errors.itemType = "Item type is required";
    }
    if (!hsnCode) {
      isValid = false;
      errors.hsnCode = "HSN code is required";
    }
    if (!productType) {
      isValid = false;
      errors.productType = "Product type is required";
    }
    if (!itemSize) {
      isValid = false;
      errors.itemSize = "Size is required";
    }
    if (!qrCode) {
      isValid = false;
      errors.qrCode = "QR code is required";
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    console.log(row, 'kk');
    navigate("/group", { state: { groupData: row } });
  };

  const handleDeleteClick = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete the item "${itemName}"?`)) {
      api.delete(`/items/${itemId}`)
        .then((res) => {
          toast.success(res.data.successMessage || "Item deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchItemData();
        })
        .catch((error) => {
          console.error("Error deleting item :", error);
          toast.error("Failed to delete item.", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const columns = [
    {
      name: <h5>Item Name</h5>,
      selector: (row) => row.itemName,
      sortable: true,
    },
    {
      name: <h5>Item Code</h5>,
      selector: (row) => row.itemCode,
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
          {permissions?.write && (
            <Link className="action-icon" onClick={() => handleEditClick(row)}>
              <FaRegEdit size={24} color="#87CEEB" />
            </Link>
          )}
          {permissions?.delete && (
            <Link className="action-icon" onClick={() => handleDeleteClick(row.itemId, row.itemName)}>
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

  const handleNext = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return;
    // }

    setMappingShow(true);
    setShow(false);
  };

  const handleSubmit = async () => {
    const payload = {
      item: {
        itemName: formValues.itemName,
        itemGroupId: formValues.itemGroupId,
        itemSubGroupId: formValues.itemSubGroupId,
        itemCategoryId: formValues.itemCategoryId,
        itemSubCategoryId: formValues.itemSubCategoryId,
        productType: formValues.productType,
        itemType: formValues.itemType,
        channelId: formValues.outletId,
        itemCode: formValues.itemCode,
        uom: formValues.uom,
        isActive: formValues.isActive,
        itemImage: formValues.itemImage,
        hsnCode: formValues.hsnCode,
        qrCode: formValues.qrCode,
        mappings: [
          {
            outletId: formValues.outletId,
            prices: [
              {
                itemPriceId: formValues.itemId,
                itemId: values.itemId,
                outletId: values.outletId,
                itemQuantity: parseFloat(values.itemQuantity) || 0,
                itemPrice: parseFloat(values.itemPrice) || 0,
                isSoldMRP: values.isSoldMRP,
                isDiscountable: values.isDiscountable,
                isActive: values.isActive,
                isVisible: values.isVisible
              }
            ],
            taxes: [
              {
                itemTaxOutletMappingId: values.itemId,
                itemId: values.itemId,
                outletId: values.outletId,
                taxId: values.taxId,
                taxWithDiscount: values.taxWithDiscount,
                isActive: values.isActive
              }
            ]
          }
        ]
      }
    };
    setLoading(true);
    try {
      const res = await api.post("/items", payload);
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
      toast.error(res.data.ErrorMessage || "Something went wrong! Please try again.", {
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

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
          <Spinner animation="grow" variant="secondary" size="sm" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="secondary" size="sm" />
          <Spinner animation="grow" variant="warning" />
        </div>
      ) : (
        <div className='d-flex'>
          <div className='p-3' style={{ width: "93vw" }}>
            <div className="" style={{ width: "100%" }}>
              <DataTable
                columns={columns}
                data={DataTableSettings.filterItems(
                  itemsData,
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
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Item" : "Add Item"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90'>
            <Row className='mb-2'>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="itemName">
                    <MdOutlineFastfood size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="itemName"
                    value={formValues.itemName || ""}
                    onChange={(e) =>
                      handleChange("itemName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                    placeholder="Item name"
                    aria-label="itemName"
                    isInvalid={!!errors.itemName}
                    isValid={formValues.itemName && !errors.itemName}
                  />
                  {errors.itemName && <span className="error-msg">{errors.itemName}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemGroupId">
                    <FaObjectUngroup size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemGroupId"
                    value={formValues.itemGroupId || ""}
                    onChange={(e) => handleChange("itemGroupId", e.target.value)}
                  >
                    <option>Select group</option>
                    {groupData?.map((item) => (
                      <option key={item.itemGroupId} value={item.itemGroupId}>
                        {item.itemGroupName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemGroupId && <span className="error-msg">{errors.itemGroupId}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemSubGroupId">
                    <FaObjectUngroup size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemSubGroupId"
                    value={formValues.itemSubGroupId || ""}
                    onChange={(e) => handleChange("itemSubGroupId", e.target.value)}
                  >
                    <option value="">Select sub group</option>
                    {subGroupData?.map((item) => (
                      <option key={item.itemSubGroupId} value={item.itemSubGroupId}>
                        {item.itemSubGroupName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemSubGroupId && <span className="error-msg">{errors.itemSubGroupId}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemCategoryId">
                    <BiCategoryAlt size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemCategoryId"
                    value={formValues.itemCategoryId || ""}
                    onChange={(e) => handleChange("itemCategoryId", e.target.value)}
                  >
                    <option value="">Select category</option>
                    {itemTypeData?.map((item) => (
                      <option key={item.itemCategoryId} value={item.itemCategoryId}>
                        {item.itemCategoryName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemCategoryId && <span className="error-msg">{errors.itemCategoryId}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemSubCategoryId">
                    <TbCategoryPlus size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemSubCategoryId"
                    value={formValues.itemSubCategoryId || ""}
                    onChange={(e) => handleChange("itemSubCategoryId", e.target.value)}
                  >
                    <option value="">Select sub category</option>
                    {itemSubTypeData?.map((item) => (
                      <option key={item.itemSubCategoryID} value={item.itemSubCategoryID}>
                        {item.itemSubCategoryName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemSubCategoryId && <span className="error-msg">{errors.itemSubCategoryId}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="productType">
                    <LiaProductHunt size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="productType"
                    value={formValues.productType || ""}
                    onChange={(e) => handleChange("productType", e.target.value)}
                  >
                    <option value="">Select product type</option>
                    {productTypeOptions?.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.productType && <span className="error-msg">{errors.productType}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemType">
                    <LuTypeOutline size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemType"
                    value={formValues.itemType || ""}
                    onChange={(e) => handleChange("itemType", e.target.value)}
                  >
                    <option value="">Select item type</option>
                    {formValues.itemType &&
                      !itemTypeOptions?.some(
                        (opt) => opt.value === formValues.itemType
                      ) && (
                        <option value={formValues.itemType}>
                          {formValues.itemType}
                        </option>
                      )}
                    {itemTypeOptions?.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemType && <span className="error-msg">{errors.itemType}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="uom">
                    <LiaWeightSolid size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="uom"
                    value={formValues.uom || ""}
                    onChange={(e) => handleChange("uom", e.target.value)}
                  >
                    <option value="">Select uom</option>
                    {uomData?.map((item) => (
                      <option key={item.uomId} value={item.uomId}>
                        {item.uomName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.uom && <span className="error-msg">{errors.uom}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemCode">
                    <IoBarcodeOutline size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="itemCode"
                    value={formValues.itemCode || ""}
                    onChange={(e) => handleChange("itemCode", e.target.value)}
                    placeholder="Item code"
                    aria-label="itemCode"
                    isInvalid={!!errors.itemCode}
                    isValid={formValues.itemCode && !errors.itemCode}
                  />
                  {errors.itemCode && <span className="error-msg">{errors.itemCode}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="hsnCode">
                    <TbPencilCode size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="hsnCode"
                    value={formValues.hsnCode || ""}
                    onChange={(e) => handleChange("hsnCode", e.target.value)}
                    placeholder="Hsn code"
                    aria-label="hsnCode"
                    isInvalid={!!errors.hsnCode}
                    isValid={formValues.hsnCode && !errors.hsnCode}
                  />
                  {errors.hsnCode && <span className="error-msg">{errors.hsnCode}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="qrCode">
                    <TbPencilCode size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="qrCode"
                    value={formValues.qrCode || ""}
                    onChange={(e) => handleChange("qrCode", e.target.value)}
                    placeholder="QR code"
                    aria-label="qrCode"
                    isInvalid={!!errors.qrCode}
                    isValid={formValues.qrCode && !errors.qrCode}
                  />
                  {errors.qrCode && <span className="error-msg">{errors.qrCode}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
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
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemSize">
                    <LiaWeightSolid size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Select
                    name="itemSize"
                    value={formValues.itemSize || ""}
                    onChange={(e) => handleChange("itemSize", e.target.value)}
                  >
                    <option value="">Select item size</option>
                    {itemSizeData?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.sizeName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.itemSize && <span className="error-msg">{errors.itemSize}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="itemImage">
                    <FaRegFile size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                  />
                </InputGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" variant="warning" className="me-2" onClick={handleNext}>
                Next
                {/* {isEditMode ? "Update" : "Save"} */}
              </Button>
              {/* <Button type="submit" variant="secondary" onClick={handleMappingShow}>
                Outlet Mapping
              </Button> */}
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={mappingShow}
        onHide={handleMappingClose}
        backdrop="static"
        placement="end"
        className="custom-offcanvass"
      >
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Outlet & Tax" : "Add Outlet & Tax"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Outlet Name</th>
                  <th>Item Name</th>
                  <th>Item Size</th>
                  <th>Item Price</th>
                  <th>IsSoldMRP</th>
                  <th>IsDiscount</th>
                  <th>IsVisible</th>
                  <th>Taxes</th>
                </tr>
              </thead>
              <tbody>
                {outletData?.map((outlet) => (
                  <tr key={outlet.outletId}>
                    <td>{outlet.outletName}</td>
                    <td>Item Name</td>
                    <td>Size</td>
                    <td>₹0.00</td>
                    <td> <input type="checkbox" /></td>
                    <td> <input type="checkbox" /></td>
                    <td> <input type="checkbox" /></td>
                    <td>0%</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-5">
              <Button type="submit" variant="warning">
                Save
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
              <InputGroup.Text id="itemGroupName">
                <FaRegFile size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                type="file"

              />
            </InputGroup>
            <div className="d-flex justify-content-center mt-5">
              <Button type="submit" variant="warning">
                Save
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Item
