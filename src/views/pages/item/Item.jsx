import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Row, Col, Spinner, Table, Modal } from "react-bootstrap";
import { MdDeleteForever, MdOutlineFastfood } from "react-icons/md";
import { FaRegEdit, FaRegFile, FaRegStar, FaExclamationTriangle, FaTimesCircle, FaTrash } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { FaObjectUngroup } from "react-icons/fa6";
import { TbHandClick, TbCategoryPlus, TbPencilCode } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { LiaProductHunt, LiaWeightSolid } from "react-icons/lia";
import { LuTypeOutline } from "react-icons/lu";
import { IoBarcodeOutline } from "react-icons/io5";
import Select from 'react-select';
import { LiaSitemapSolid } from "react-icons/lia";
import { PiMicrophoneThin } from "react-icons/pi";

const Item = () => {

  const channelId = localStorage.getItem('channelId');
  const outletId = localStorage.getItem("currentOutletId");

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
    ItemImageFile: null,
    HSNCode: "",
    qrCode: "",
    itemQuantity: "",
    itemPrice: "",
    outletId: "",
    taxId: [],
    itemSize: "",
    isSoldMRP: false,
    isDiscountable: false,
    isVisible: false,
    isActive: true,
    taxWithDiscount: false,
  };

  const addInitialValues = {
    itemId: [],
    IsCompulsory: false,
    isActive: true
  }
  const [addFormValues, setAddFormValues] = useState(addInitialValues);
  const [addErrors, setAddErrors] = useState({});
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [groupData, setGroupData] = useState([]);
  const [subGroupData, setSubGroupData] = useState([]);
  const [itemTypeData, setItemTypeData] = useState([]);
  const [itemSubTypeData, setItemSubTypeData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [itemSizeData, setItemSizeData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const fetchCalled = useRef(false);
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
  const [addOnShow, setAddOnShow] = useState(false);
  const handleAddOnClose = () => setAddOnShow(false);
  const handleAddOnShow = () => setAddOnShow(true);
  const [formRows, setFormRows] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = (index) => {
    fetchTaxData();
    setCurrentRowIndex(index);
    const selected = formRows[index]?.taxes?.map(t => t.taxId) || [];
    setSelectedTaxes(selected);
    setShowModal(true);
  };

  const hasFetchedTaxes = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const filteredTaxes = taxData?.filter((tax) =>
    tax.taxName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (addOnShow) {
      fetchItemSizeData();
    }
  }, [addOnShow]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (selectedOptions) => {
    const updatedItems = selectedOptions.map((opt) => {
      const existing = selectedItems.find((item) => item.value === opt.value);
      return {
        value: opt.value,
        label: opt.label,
        isCompulsory: existing ? existing.isCompulsory : false,
        itemSizeId: existing ? existing.itemSizeId : "",
        qty: existing ? existing.qty : ""
      };
    });

    setSelectedItems(updatedItems);
  };

  const handleClose = () => {
    setShow(false);
    setFormValues(initialValues);
    setErrors({});
    setIsEditMode(false);
  };

  const handleShow = () => {
    localStorage.removeItem('tableData');

    setFormValues(initialValues);
    setIsEditMode(false);
    setErrors({});
    setShow(true);
    fetchGroupData();
    fetchOutletData();
    fetchUomData();
    setLoading(false);
  };

  const handleCheckboxChange = (taxId) => {
    setSelectedTaxes((prev) =>
      prev.includes(taxId)
        ? prev.filter((id) => id !== taxId)
        : [...prev, taxId]
    );
  };

  const handleModalSave = () => {
    const selectedTaxObjects = taxData.filter(tax => selectedTaxes.includes(tax.taxId));

    setFormRows(prevRows => {
      const updatedRows = [...prevRows];
      if (currentRowIndex !== null) {
        updatedRows[currentRowIndex].taxes = selectedTaxObjects;
      }
      return updatedRows;
    });

    setShowModal(false);
    setSelectedTaxes([]);
    setCurrentRowIndex(null);
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchItemData();
  }, []);

  const [primaryState, setPrimaryState] = useState({
    itemPrice: false,
    isSoldMRP: false,
    isDiscountable: false,
    isVisible: false,
    taxes: false,
  });

  const handleColumnStarClick = (columnKey) => {
    const primaryValue = formRows[0][columnKey];

    if (
      (columnKey === "itemSize" && !primaryValue) ||
      (columnKey === "itemPrice" && primaryValue === "")
    ) {
      toast.error(`Please enter a value for "${columnKey === "itemSize" ? "Item Size" : "Item Price"}" in the first row before using this feature.`);
      return;
    }

    const isActive = primaryState[columnKey];

    setPrimaryState((prev) => ({
      ...prev,
      [columnKey]: !isActive,
    }));

    setFormRows((prev) =>
      prev.map((row, i) =>
        i === 0
          ? row
          : {
            ...row,
            [columnKey]: !isActive
              ? Array.isArray(primaryValue)
                ? [...primaryValue]
                : primaryValue
              : getDefaultValue(columnKey),
          }
      )
    );
  };

  const getDefaultValue = (key) => {
    switch (key) {
      case "itemPrice":
      case "itemSize":
        return "";
      case "taxId":
        return [];
      default:
        return false;
    }
  };

  const itemTypeOptions = [
    { label: "Veg", value: "Veg" },
    { label: "NonVeg", value: "NonVeg" },
    { label: "Mixed", value: "Mixed" },
  ];

  const productTypeOptions = [
    { label: "S - Saleable Item", value: "Saleable Item" },
    { label: "O - Stockable Item", value: "Stockable Item" },
    { label: "P - Purchase Item", value: "Purchase Item" },
  ];

  const fetchItemData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/outlet/${outletId}`);
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
      const res = await api.get(`/outlets/channel/${channelId}`);
      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setOutletData(sortedData);
    } catch (error) {
      console.error("Error fetching outlet data", error);
    }
  };

  const fetchTaxData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tax`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setTaxData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localData = localStorage.getItem("tableData");
    if (!localData && outletData.length > 0) {
      const rows = outletData.map((outlet) => ({
        outletId: outlet.outletId,
        outletName: outlet.outletName,
        itemSize: "",
        itemPrice: "",
        isSoldMRP: false,
        isDiscountable: false,
        isVisible: false,
        taxes: []
      }));
      setFormRows(rows);
    }
  }, [outletData]);

  useEffect(() => {
    if (mappingShow) {
      const storedData = localStorage.getItem("tableData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed)) {
            setFormRows(parsed);
          }
        } catch (err) {
          console.error("Error parsing localStorage tableData", err);
        }
      }
    }
  }, [mappingShow]);

  const fetchItemSizeData = async () => {
    try {
      const res = await api.get("/itemsize");
      const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setItemSizeData(sortedData);
    } catch (error) {
      console.error("Error fetching item size data", error);
    }
  };

  const [addOnItems, setAddOnItems] = useState([]);

  const fetchItemAddOnData = async (itemId) => {
    try {
      const res = await api.get(`/itemaddon/${outletId}/${itemId}`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setAddOnItems(sortedData);

      if (res?.data?.data?.items?.length > 0) {
        setAddOnItems(res.data.data.items);
      } else {
        setAddOnItems([]);
      }
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

  useEffect(() => {
    const fetchTaxesForInitialRows = async () => {
      const subGroupId = formValues.itemSubGroupId;
      if (!mappingShow || !subGroupId || formRows.length === 0 || hasFetchedTaxes.current) return;

      hasFetchedTaxes.current = true;

      const updatedRows = await Promise.all(
        formRows.map(async (row) => {
          if (row.outletId && (!row.taxes || row.taxes.length === 0)) {
            try {
              const res = await api.get(`/outletsubgrouptax/${row.outletId}/${subGroupId}`);
              const taxes = res?.data?.list?.[0]?.taxes || [];
              return { ...row, taxes };
            } catch (err) {
              console.error("Error auto-fetching taxes:", err);
              return row;
            }
          }
          return row;
        })
      );

      setFormRows(updatedRows);
    };

    fetchTaxesForInitialRows();
  }, [mappingShow, formValues.itemSubGroupId, formRows.length]);
  useEffect(() => {
    if (!mappingShow) {
      hasFetchedTaxes.current = false;
    }
  }, [mappingShow]);

  const handleRowChange = async (index, name, value) => {
    const updatedRows = [...formRows];
    const currentRow = { ...updatedRows[index], [name]: value };

    const targetOutlet = name === "outletId" ? value : currentRow.outletId;
    const targetItemSize = name === "itemSize" ? value : currentRow.itemSize;

    if (targetOutlet && targetItemSize) {
      const isDuplicate = formRows.some((row, i) =>
        i !== index &&
        row.outletId === targetOutlet &&
        row.itemSize === targetItemSize
      );

      if (isDuplicate) {
        toast.error("This Outlet and Item Size combination already exists.");
        return;
      }
    }

    if (name === "outletId") {
      const subGroupId = formValues.itemSubGroupId;
      let taxes = [];

      if (subGroupId && value) {
        try {
          const res = await api.get(`/outletsubgrouptax/${value}/${subGroupId}`);
          taxes = res?.data?.list?.[0]?.taxes || [];
        } catch (error) {
          console.error("Error fetching taxes for outlet:", error);
        }
      }

      updatedRows[index] = {
        ...currentRow,
        taxes,
      };
    } else {
      updatedRows[index] = currentRow;
    }

    setFormRows(updatedRows);
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
      HSNCode,
      productType,
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
    // if (!HSNCode) {
    //   isValid = false;
    //   errors.HSNCode = "HSN code is required";
    // }
    if (!productType) {
      isValid = false;
      errors.productType = "Product type is required";
    }

    setErrors(errors);
    return isValid;
  };

  useEffect(() => {
    if (formValues.itemGroupId) fetchSubGroupData(formValues.itemGroupId);
    if (formValues.itemSubGroupId) fetchItemTypeData(formValues.itemSubGroupId);
    if (formValues.itemCategoryId) fetchItemSubTypeData(formValues.itemCategoryId);
  }, [formValues.itemGroupId, formValues.itemSubGroupId, formValues.itemCategoryId]);


  // const handleEditClick = (row) => {
  //   console.log(row, 'oo');

  //   setIsEditMode(true);
  //   setFormValues({
  //     ...initialValues,
  //     itemName: row.itemName,
  //     itemGroupId: String(row.itemGroupId ?? ""),
  //     itemSubGroupId: String(row.itemSubGroupId ?? ""),
  //     itemCategoryId: String(row.itemCategoryId ?? ""),
  //     itemSubCategoryId: String(row.itemSubCategoryId ?? ""),
  //     productType: row.productType ?? "",
  //     itemType: row.itemType ?? "",
  //     itemCode: row.itemCode ?? "",
  //     uom: String(row.uomID ?? ""),
  //     ItemImageFile: row.itemImage,
  //     HSNCode: row.hsnCode ?? "",
  //     qrCode: row.qrCode ?? "",
  //     itemQuantity: row.itemQuantity ?? "",
  //     itemPrice: row.itemPrice ?? "",
  //     itemSize: String(row.itemSizeId ?? ""),
  //     outletId: String(row.outletId ?? ""),
  //     isVisible: !!row.isVisible,
  //     isDiscountable: !!row.isDiscountable,
  //     isSoldMRP: !!row.isSoldMRP,
  //     isActive: !!row.isActive,
  //     taxWithDiscount: !!row.taxWithDiscount,
  //   });
  //   setShow(true);
  // };

  const handleEditClick = (row) => {
    console.log(row, 'oo');

    fetchGroupData();
    fetchUomData();
    fetchSubGroupData(row.itemGroupId);
    fetchItemTypeData(row.itemSubGroupId);
    fetchItemSubTypeData(row.itemCategoryId);

    setFormValues({
      itemId: row.itemId,
      itemName: row.itemName || "",
      itemGroupId: String(row.itemGroupId || ""),
      itemSubGroupId: String(row.itemSubGroupId || ""),
      itemCategoryId: String(row.itemCategoryId || ""),
      itemSubCategoryId: String(row.itemSubCategoryId || ""),
      productType: row.productType || "",
      itemType: row.itemType || "",
      itemCode: row.itemCode || "",
      uom: String(row.uomID || ""),
      ItemImageFile: null,
      HSNCode: row.hsnCode || "",
      qrCode: row.qrCode || "",
      itemQuantity: "",
      itemPrice: "",
      itemSize: "",
      outletId: "",
      isVisible: !!row.isVisible,
      isDiscountable: !!row.isDiscountable,
      isSoldMRP: !!row.isSoldMRP,
      isActive: !!row.isActive,
      taxWithDiscount: !!row.taxWithDiscount,
    });
    const taxMap = {};
    (row.taxes || []).forEach(tax => {
      if (!taxMap[tax.outletId]) taxMap[tax.outletId] = [];
      taxMap[tax.outletId].push({
        taxName: tax.taxName,
        taxRate: tax.taxRate,
        taxId: tax.taxId
      });
    });

    const mappedRows = (row.prices || []).map(price => ({
      outletId: String(price.outletId),
      outletName: price.outletName || "",
      itemSize: String(price.itemSizeId || ""),
      itemPrice: String(price.itemPrice || ""),
      isSoldMRP: !!price.isSoldMRP,
      isDiscountable: !!price.isDiscountable,
      isVisible: !!price.isVisible,
      taxes: taxMap[price.outletId] || [],
      isNew: false,
    }));

    setFormRows(mappedRows);

    setIsEditMode(true);
    setShow(true);
  };

  const handleDeleteClick = (itemId, itemName) => {
    setToDelete({ id: itemId, name: itemName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/items/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Item deleted successfully!");
        fetchItemData();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item.");
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

  const validateAddForm = () => {
    const errors = {};
    let isValid = true;

    // Validate item selection
    if (selectedItems.length === 0) {
      isValid = false;
      errors.itemId = "Please select at least one item.";
    }

    // Validate that at least one item has isCompulsory === true
    const hasCompulsory = selectedItems.some(item => item.isCompulsory);
    if (selectedItems.length > 0 && !hasCompulsory) {
      isValid = false;
      errors.isCompulsory = "At least one item must be marked as compulsory.";
    }

    setAddErrors(errors);
    return isValid;
  };

  const handleAddOnClick = (itemId) => {
    setSelectedItemId(itemId);
    setAddFormValues({ itemId: [] });
    setAddOnShow(true);
    fetchItemAddOnData(itemId);
  };

  const columns = [
    {
      name: <h5>Item Image</h5>,
      selector: (row) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={
              row.itemImage
                ? `${import.meta.env.VITE_IMG_BASE_URL}/${row.itemImage}`
                : 'src/assets/food.png'
            }
            alt={row.itemName}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'fill',
              borderRadius: '0px',
            }}
          />
        </div>
      ),
      sortable: false,
      center: true,
    },
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
      name: <h5>Group</h5>,
      selector: (row) => row.itemGroupName,
      sortable: true,
    },
    {
      name: <h5>Sub Group</h5>,
      selector: (row) => row.itemSubGroupName,
      sortable: true,
    },
    {
      name: <h5>Category</h5>,
      selector: (row) => row.itemCategoryName,
      sortable: true,
    },
    {
      name: <h5>Sub Category</h5>,
      selector: (row) => row.itemSubCategoryName,
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
          <Link className="action-icon" onClick={() => handleEditClick(row)} title='Edit'>
            <FaRegEdit size={24} color="#87CEEB" />
          </Link>
          <Link className="action-icon" onClick={() => handleDeleteClick(row.itemId, row.itemName)} title='Delete'>
            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
          </Link>
          <Link
            onClick={(e) => {
              e.preventDefault();
              handleAddOnClick(row.itemId);
            }}
            style={{ cursor: "pointer" }}
          >
            <LiaSitemapSolid size={30} style={{ margin: "0.2vh" }} color="green" />
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
      <PiMicrophoneThin size={30} color='yellow' />
      <Button variant="info" onClick={handleExpoShow}>
        <CiExport size={20} /> Import
      </Button>
      <Button variant="success">
        <CiImport size={20} /> Export
      </Button>
      <Button variant="warning" onClick={handleShow}>
        <GoPlus size={20} /> Add
      </Button>
    </div>
  ), [filterText]);

  const handleNext = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setMappingShow(true);
    setShow(false);
    fetchOutletData();
    fetchItemSizeData();
    const stored = localStorage.getItem("tableData");
  };

  const handleBack = () => {
    setMappingShow(false);
    setShow(true);

    if (formRows && formRows.length > 0) {
      localStorage.setItem("tableData", JSON.stringify(formRows));
    } else {
      console.warn("formRows is empty, skipping localStorage update");
    }
  };

  useEffect(() => {
    if (mappingShow) {
      const storedData = localStorage.getItem("tableData");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed)) {
            setFormRows(parsed);
          }
        } catch (e) {
          console.error("Failed to parse tableData from localStorage");
        }
      }
    }
  }, [mappingShow]);

  const handleAddNewRow = () => {
    setFormRows(prevRows => [
      ...prevRows,
      {
        outletId: "",
        itemSize: "",
        itemPrice: "",
        isSoldMRP: false,
        isDiscountable: false,
        isVisible: false,
        taxes: [],
        isNew: true,
      }
    ]);
  };

  const handleDelete = (indexToRemove) => {
    setFormRows((prevRows) => prevRows.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMappings = formRows.filter(row =>
      row.outletId && row.itemSize && row.itemPrice && parseFloat(row.itemPrice) > 0
    );

    if (validMappings.length === 0) {
      toast.error("Please add at least one valid outlet mapping with outlet, item size, and price.");
      return;
    }

    const formData = new FormData();

    formData.append("Item.ItemName", formValues.itemName);
    formData.append("Item.ItemGroupId", formValues.itemGroupId);
    formData.append("Item.ItemSubGroupId", formValues.itemSubGroupId);
    formData.append("Item.ItemCategoryId", formValues.itemCategoryId);
    formData.append("Item.ItemSubCategoryId", formValues.itemSubCategoryId);
    formData.append("Item.ProductType", formValues.productType);
    formData.append("Item.ItemType", formValues.itemType);
    formData.append("Item.ItemCode", formValues.itemCode);
    formData.append("Item.uomID", formValues.uom);
    formData.append("Item.HSNCode", formValues.HSNCode);
    formData.append("Item.qrCode", formValues.qrCode);
    formData.append("Item.IsActive", formValues.isActive);
    formData.append("Item.ItemQuantity", parseFloat(formValues.itemQuantity) || 1);
    formData.append("Item.TaxWithDiscount", formValues.taxWithDiscount || false);

    if (formValues.ItemImageFile instanceof File) {
      formData.append("Item.ItemImageFile", formValues.ItemImageFile);
    }

    validMappings.forEach((row, i) => {
      const base = `Item.Mappings[${i}]`;

      formData.append(`${base}.OutletId`, row.outletId);

      const priceBase = `${base}.Prices[0]`;
      formData.append(`${priceBase}.ItemQuantity`, parseFloat(formValues.itemQuantity) || 1);
      formData.append(`${priceBase}.ItemSizeId`, row.itemSize);
      formData.append(`${priceBase}.ItemPrice`, parseFloat(row.itemPrice));
      formData.append(`${priceBase}.IsSoldMRP`, row.isSoldMRP);
      formData.append(`${priceBase}.IsDiscountable`, row.isDiscountable);
      formData.append(`${priceBase}.IsVisible`, row.isVisible);
      formData.append(`${priceBase}.IsActive`, formValues.isActive);

      (row.taxes || []).forEach((tax, j) => {
        const taxBase = `${base}.Taxes[${j}]`;
        formData.append(`${taxBase}.TaxId`, tax.taxId);
        formData.append(`${taxBase}.TaxAfterDiscount`, formValues.taxWithDiscount || false);
        formData.append(`${taxBase}.OnPercentage`, 0);
        formData.append(`${taxBase}.IsActive`, formValues.isActive);
      });
    });

    try {
      setLoading(true);

      const response = await api.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.successMessage || "Item created successfully!");
      setFormValues(initialValues);
      setFormRows([]);
      setMappingShow(false);
      setShow(false);
      fetchItemData();

    } catch (error) {
      console.error("Error creating item:", error);
      toast.error(
        error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        "Something went wrong while creating the item!"
      );
    } finally {
      setLoading(false);
    }
  };

  const itemOptions = itemsData?.map((item) => ({
    value: item.itemId,
    label: item.itemName,
  }));

  const handleAddOnSubmit = async () => {
    const isValid = validateAddForm();
    if (!isValid) return;

    const payload = {
      itemParentId: selectedItemId,
      addonItems: selectedItems.map(item => ({
        itemId: item.value,
        itemSizeId: item.itemSizeId,
        qty: Number(item.qty) || 0,
        isCompulsory: item.isCompulsory,
        isActive: true
      }))
    };

    try {
      const res = await api.post("/itemaddon", payload);
      toast.success(res.data.successMessage || "Success!");
      setSelectedItems([]);
      setAddFormValues({
        isActive: true,
      });
      setAddErrors({});

      handleAddOnClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save add-on items.");
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
                    autoComplete='off'
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
                    autoComplete='off'
                  />
                  {errors.itemCode && <span className="error-msg">{errors.itemCode}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="HSNCode ">
                    <TbPencilCode size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="HSNCode "
                    value={formValues.HSNCode || ""}
                    onChange={(e) => handleChange("HSNCode ", e.target.value)}
                    placeholder="Hsn code"
                    aria-label="HSNCode "
                    isInvalid={!!errors.HSNCode}
                    isValid={formValues.HSNCode && !errors.HSNCode}
                    autoComplete='off'
                  />
                  {errors.HSNCode && <span className="error-msg">{errors.HSNCode}</span>}
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
                    autoComplete='off'
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
                  <InputGroup.Text id="ItemImageFile">
                    <FaRegFile size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormValues(prev => ({
                          ...prev,
                          ItemImageFile: file
                        }));
                      }
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" variant="warning" className="me-2" onClick={handleNext}>
                Next
              </Button>
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
              {isEditMode
                ? `Edit Outlet & Tax Mapping - ${formValues.itemName || ""}`
                : `Add Outlet & Tax Mapping - ${formValues.itemName || ""}`}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Outlet Name</th>
                  <th>
                    <span
                      style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer", width: "120px" }}
                      onClick={() => handleColumnStarClick("itemSize")}
                    >
                      Item Size
                      <FaRegStar size={20} color={primaryState.itemSize ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>
                    <span
                      style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer", width: "120px" }}
                      onClick={() => handleColumnStarClick("itemPrice")}
                    >
                      Item Price
                      <FaRegStar size={20} color={primaryState.itemPrice ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
                      onClick={() => handleColumnStarClick("isSoldMRP")}
                    >
                      Sold MRP
                      <FaRegStar size={20} color={primaryState.isSoldMRP ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
                      onClick={() => handleColumnStarClick("isDiscountable")}
                    >
                      Discount
                      <FaRegStar size={20} color={primaryState.isDiscountable ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
                      onClick={() => handleColumnStarClick("isVisible")}
                    >
                      Visible
                      <FaRegStar size={20} color={primaryState.isVisible ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "20px", cursor: "pointer" }}
                      onClick={() => handleColumnStarClick("taxes")}
                    >
                      Taxes
                      <FaRegStar size={20} color={primaryState.taxes ? "gold" : "gray"} />
                    </span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formRows?.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {row.isNew ? (
                        <Form.Select
                          value={row.outletId}
                          onChange={(e) => handleRowChange(index, "outletId", e.target.value)}
                        >
                          <option value="">Select Outlet</option>
                          {outletData.map((outlet) => (
                            <option key={outlet.outletId} value={outlet.outletId}>
                              {outlet.outletName}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder="Enter Outlet Name"
                          value={row.outletName}
                          readOnly
                        />
                      )}
                    </td>
                    <td>
                      <Form.Select
                        value={row.itemSize || ""}
                        onChange={(e) =>
                          handleRowChange(index, "itemSize", e.target.value)
                        }
                      >
                        <option value="">Select Item Size</option>
                        {itemSizeData?.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.sizeName}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td style={{ width: "100px", padding: "4px" }}>
                      <Form.Control
                        value={row.itemPrice || ""}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "itemPrice",
                            e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*?)\..*/g, "$1")
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "2px 4px",
                          fontSize: "20px",
                        }}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={row.isSoldMRP || ""}
                        onChange={(e) =>
                          handleRowChange(index, "isSoldMRP", e.target.checked)
                        }
                        style={{
                          transform: "scale(1.5)",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={row.isDiscountable || ""}
                        onChange={(e) =>
                          handleRowChange(index, "isDiscountable", e.target.checked)
                        }
                        style={{
                          transform: "scale(1.5)",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={row.isVisible || ""}
                        onChange={(e) =>
                          handleRowChange(index, "isVisible", e.target.checked)
                        }
                        style={{
                          transform: "scale(1.5)",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      />
                    </td>
                    <td onClick={() => handleModalShow(index)} style={{ cursor: 'pointer' }}>
                      {row.taxes && row.taxes.length > 0 ? (
                        row.taxes.length === 1 ? (
                          <div>
                            {row.taxes[0].taxName} - {row.taxes[0].taxRate}%
                          </div>
                        ) : (
                          row.taxes.map((tax, i) => (
                            <div key={i}>
                              {tax.taxName} - {tax.taxRate}%
                            </div>
                          ))
                        )
                      ) : (
                        <span style={{ color: "gray", fontStyle: "italic" }}>No Tax</span>
                      )}
                    </td>
                    <td>
                      <MdDeleteForever
                        size={20}
                        style={{ margin: "1vh", cursor: "pointer" }}
                        color="#FF474C"
                        onClick={() => handleDelete(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-2">
              <Button variant="warning" onClick={handleAddNewRow}>
                Add New
              </Button>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <Button variant="warning" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" variant="warning" onClick={handleSubmit} className="ms-3">
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

      <Offcanvas
        show={addOnShow}
        onHide={handleAddOnClose}
        placement="end"
        backdrop="static"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              Add on Item
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className='mt-2 d-flex flex-column gap-3'>
          <Row className='mb-2'>
            <Col md={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="itemId">
                  <FaObjectUngroup size={25} color="#ffc800" />
                </InputGroup.Text>
                <Select
                  isMulti
                  name="itemId"
                  options={itemOptions}
                  value={selectedItems.map(({ value }) =>
                    itemOptions.find(opt => opt.value === value)
                  )}
                  onChange={handleSelectChange}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      width: "19.5rem",
                      borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                      boxShadow: state.isFocused
                        ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                        : provided.boxShadow,
                      '&:hover': {
                        borderColor: '#ffc800',
                      },
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? '#ffc800'
                        : state.isFocused
                          ? '#ffe066'
                          : 'white',
                      color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                      cursor: 'pointer',
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: '#fff3cd',
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: '#856404',
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: '#856404',
                      ':hover': {
                        backgroundColor: '#ffc800',
                        color: 'black',
                      },
                    }),
                  }}
                />
                {addErrors.itemId && <span className="error-msg">{addErrors.itemId}</span>}
              </InputGroup>
            </Col>
          </Row>
          <h5>Add on Item</h5>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Size</th>
                <th>Item Qty</th>
                <th>Is Compulsory</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, idx) => (
                <tr key={item.value}>
                  <td>{item.label}</td>
                  <td>
                    <Form.Select
                      value={item.itemSizeId}
                      onChange={(e) => {
                        const updated = [...selectedItems];
                        updated[idx].itemSizeId = e.target.value;
                        setSelectedItems(updated);
                      }}
                    >
                      <option value="">Select</option>
                      {itemSizeData?.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.sizeName}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      min="0"
                      value={item.qty}
                      onChange={(e) => {
                        const updated = [...selectedItems];
                        updated[idx].qty = e.target.value.replace(/\D/g, '');
                        setSelectedItems(updated);
                      }}
                      className="w-75"
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={item.isCompulsory}
                      onChange={() => {
                        const updated = [...selectedItems];
                        updated[idx].isCompulsory = !updated[idx].isCompulsory;
                        setSelectedItems(updated);
                      }}
                      style={{ transform: "scale(1.5)" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {addErrors.isCompulsory && (
            <div className="text-danger mt-1">{addErrors.isCompulsory}</div>
          )}

          <div className="d-flex justify-content-center mt-4">
            <Button onClick={handleAddOnSubmit} variant="warning">
              Save
            </Button>
          </div>
          <h5>Existing Item</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Size</th>
                <th>Qty</th>
                <th className="text-center">Is Compulsory</th>
              </tr>
            </thead>
            <tbody>
              {addOnItems.map((item, index) => {
                const defaultPrice = item.prices?.find(p => p.isDefaultSize) || item.prices?.[0];
                return (
                  <tr key={`${item.itemId}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{defaultPrice?.itemSizeName || "-"}</td>
                    <td>{defaultPrice?.itemQuantity ?? "-"}</td>
                    <td className="text-center">{item.isCompulsory ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        backdrop="static"
        centered
      >
        <div
          style={{
            maxHeight: "80vh",
            height: "80vh",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Tax</Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: "1rem"
            }}
          >
            <Form.Group controlId="searchTax">
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  placeholder="Search tax name..."
                  className="me-2 rounded-pill"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <span
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#999"
                    }}
                  >
                    &#10005;
                  </span>
                )}
              </div>
            </Form.Group>

            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tax Name</th>
                  <th>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredTaxes && filteredTaxes.length > 0 ? (
                  filteredTaxes.map((tax, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedTaxes.includes(tax.taxId)}
                          onChange={() => handleCheckboxChange(tax.taxId)}
                          style={{
                            transform: "scale(1.5)",
                            cursor: "pointer",
                            marginRight: "8px"
                          }}
                        />
                      </td>
                      <td>{tax.taxName}</td>
                      <td>{tax.taxRate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="warning"
              onClick={() => {
                handleModalSave();
                handleModalClose();
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  )
}

export default Item
