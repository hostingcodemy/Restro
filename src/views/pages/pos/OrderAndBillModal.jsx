import React, { useEffect, useState, useRef } from "react";
import "./OrderAndBillModal.css";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, TextField, Autocomplete } from "@mui/material";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import api from '../../../config/AxiosInterceptor';
import { COffcanvas, COffcanvasBody, COffcanvasHeader, CModal } from '@coreui/react';
import Select from "react-select";
import dayjs from "dayjs";
import { CiSearch } from "react-icons/ci";
import { TbToolsKitchen2Off } from "react-icons/tb";

const OrderAndBillModal = ({ onClose, OrderBillPopUp }) => {
  const [activeMode, setActiveMode] = useState("Order"); // "Order" or "Bill"
  const fetchCalled = useRef(false);
  const outletId = localStorage.getItem("currentOutletId");
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [order, setOrder] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs()); // update current time every minute
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchOrder();
  }, [])

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/outlet/${outletId}`);
      setOrder(res.data.list);

    } catch (error) {
      console.log(error);

    }
  }

  const allColumns = [
    { field: 'kotNumber', headerName: 'Order No', width: 100, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'orderType', headerName: 'Order Type', width: 120 },
    { field: 'orderDate', headerName: 'Order Date', width: 150, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'tableName', headerName: 'Table No', width: 100 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'customerPhone', headerName: 'Phone', width: 120 },
    { field: 'totalItems', headerName: 'Total Items', width: 100, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'duration', headerName: 'Duration', width: 100 },
    { field: 'orderMode', headerName: 'Mode', width: 80 },
    { field: 'grossAmount', headerName: 'Gross Amount', width: 120, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'discount', headerName: 'Discount', width: 100, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'tax', headerName: 'Tax', width: 80, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'netAmount', headerName: 'Net Amount', width: 120, headerAlign: 'center', cellClassName: 'amount-cell' },
    { field: 'isEstimated', headerName: 'Estimated', width: 100 },
    {
      field: 'tableDelete',
      headerName: 'Table Delete',
      headerAlign: 'center', cellClassName: 'amount-cell',
      width: 120,
      renderCell: () => <button className="btn btn-sm btn-danger">Delete</button>,
    },
    {
      field: 'orderDelete',
      headerName: 'Order Delete',
      headerAlign: 'center',
      cellClassName: 'amount-cell',
      width: 120,
      renderCell: () => <TbToolsKitchen2Off color="red" size={25} />,
    },
    { field: 'proforma', headerName: 'Proforma', width: 100 },
    { field: 'bill', headerName: 'Bill', width: 80 },
    { field: 'update', headerName: 'Update', width: 100 },
    { field: 'dlink', headerName: 'Dlink', width: 100 },
    { field: 'view', headerName: 'View', width: 100 },
    { field: 'whatsapp', headerName: 'WhatsApp', width: 120 },
    { field: 'settlement', headerName: 'Settlement', width: 120 },
  ];

  const columns = activeMode === "Order"
    ? allColumns.filter(
      (col) =>
        !["bill", "dlink", "whatsapp", "settlement", "discount", "proforma"].includes(col.field)
    )
    : allColumns;


  useEffect(() => {
    filterOrders();
  }, [order, selectedFilters]);

  const filterOrders = () => {
    let filtered = [...order];

    if (!selectedFilters.includes("All")) {
      filtered = order.filter(o =>
        selectedFilters.some(f =>
          o.orderType?.replace(/\s/g, '').toLowerCase().includes(f.toLowerCase())
        )
      );
    }

    setFilteredRows(
      filtered.map((order, index) => {
        let itemTotal = 0;
        let addonTotal = 0;

        order.orderDetails?.forEach((item) => {
          itemTotal += (item.rate || 0) * (item.qty || 1);
          item.addonList?.forEach((addon) => {
            addonTotal += (addon.rate || 0) * (addon.qty || 1);
          });
        });

        const grossAmount = itemTotal + addonTotal;
        const discount = 0;
        const tax = 0;
        const netAmount = grossAmount - discount + tax;
        const duration = `${now.diff(dayjs(order.orderDate), 'minute')} mins`;

        return {
          id: index,
          kotNumber: order.kotNumber,
          orderType: order.orderType,
          orderDate: dayjs(order.orderDate).format("DD/MM/YYYY"),
          tableName: order.tableName,
          customerName: order.customerName || "-",
          customerPhone: order.customerPhone || "-",
          totalItems: order.orderDetails?.length || 0,
          duration,
          orderMode: "Dine In",
          grossAmount,
          discount,
          tax,
          netAmount,
          isEstimated: order.isEstimated ? "Yes" : "No",
          proforma: "Yes",
          bill: "Yes",
          update: "Edit",
          dlink: "Link",
          view: "View",
          whatsapp: "Send",
          settlement: "Pending",
        };
      })
    );
  };



  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  return (
    <COffcanvas
      placement="top"
      visible={OrderBillPopUp}
      onHide={onClose}
      backdrop={true}
      scroll={true}
      style={{ height: '90vh', maxHeight: '100vh', overflowY: 'auto', marginTop: "3vh" }}
    >
      <COffcanvasHeader className="d-flex">
        <div className="outletName">
             
        </div>

        <div className="toggle-container">
          <div className={`toggle-bg ${activeMode === "Bill" ? "right" : ""}`} />
          <button
            className={`toggle-btn ${activeMode === "Order" ? "active" : ""}`}
            onClick={() => setActiveMode("Order")}
          >
            Order
          </button>
          <button
            className={`toggle-btn ${activeMode === "Bill" ? "active" : ""}`}
            onClick={() => setActiveMode("Bill")}
          >
            Bill
          </button>
        </div>

        <button
          type="button"
          className="btn-close"
          onClick={onClose}
        />
      </COffcanvasHeader>

      <COffcanvasBody>

        <div className="mb-2 d-flex align-items-center gap-4">
          <div className="filter-button-row d-flex flex-wrap gap-2 p-1 rounded">
            {["All", "Dinein", "Online", "Despatch", "Advance", "Web", "Pickup", "Corporate", "Members"].map((type) => {
              const isActive = selectedFilters.includes(type);
              return (
                <button
                  key={type}
                  className={`filter-btn ${isActive ? "active shadow-sm" : ""}`}
                  onClick={() => {
                    if (type === "All") {
                      setSelectedFilters(["All"]);
                    } else {
                      setSelectedFilters((prev) => {
                        const withoutAll = prev.filter((f) => f !== "All");
                        if (withoutAll.includes(type)) {
                          const updated = withoutAll.filter((f) => f !== type);
                          return updated.length === 0 ? ["All"] : updated;
                        } else {
                          return [...withoutAll, type];
                        }
                      });
                    }
                  }}
                >
                  {type}
                </button>
              );
            })}
            <button onClick={() => setSelectedFilters(["All"])} className="reset-btn">Reset</button>
          </div>
          <div className="search-wrapper shadow-sm d-flex align-items-center">
            <div className="search-icon-container d-flex align-items-center justify-content-center">
              <CiSearch size={20} color="black" />
            </div>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search here"
              // value={searchText}
              // onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                sx: {
                  border: "none",
                  "& fieldset": { border: "none" },
                  paddingLeft: 0,
                  padding: 0
                },
              }}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  border: "none",
                  background: "transparent",
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "#ffc300",
                  },
                },
              }}
            />
          </div>
          <div>
            <div
              className="date-range-toggle d-flex align-items-center gap-2 shadow-sm"
            // onClick={() => setShowDatePicker((prev) => !prev)}
            >
              {/* <FiCalendar size={16} /> */}
              <span>
                {/* {dayjs(range[0].startDate).format("DD MMMM")} - {dayjs(range[0].endDate).format("DD MMMM")} */}

              </span>

            </div>

            {/* {showDatePicker && (
              <div className="position-absolute z-3 bg-white shadow p-2 rounded">
                <DateRange
                  ref={datePickerRef}
                  editableDateInputs={true}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                />
              </div>
            )} */}

          </div>

          {/* <div className="d-flex align-items-center gap-2 " style={{ minWidth: 200, marginLeft: "2rem" }}>
            <div className="selectBtn shadow-sm">
              <Select
                options={userOptions}
                placeholder="Select users"
                styles={customStyles}
                onChange={(selected) => console.log('Selected:', selected)}
              />

            </div>
            <div className="more-btn shadow-sm">

              <BsThreeDots size={18} style={{ cursor: 'pointer' }} />
            </div>
          </div> */}

        </div>

        <Box
          sx={{
            height: 500,
            minWidth: 1000,
            backgroundColor: 'white',
            borderRadius: 2,
            mt: 4,
            boxShadow: 2,
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            rowHeight={35}
            pagination={false}
            disableRowSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                fontSize: 14,
              },
              '& .amount-cell': {
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />

        </Box>



      </COffcanvasBody>


    </COffcanvas>
  );
};

export default OrderAndBillModal;
