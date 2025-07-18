import React, { useState } from "react";
import { COffcanvas } from "@coreui/react";
import UniversalSearch from "./UniversalSearch";
import "./Transfer.css";
import api from "../../config/AxiosInterceptor";
import { toast, ToastContainer } from 'react-toastify';
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoGridOutline } from "react-icons/io5";
import { LuTable } from "react-icons/lu";
import KOTTransfer from "./KOTTransfer";
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Transfer = ({ tableData = [], facility, fetchTableData }) => {

    const [viewMode, setViewMode] = useState("grid");
    const [visible, setVisible] = useState(true);
    const [selectedTables, setSelectedTables] = useState([]);
    const [checkedItems, setCheckedItems] = useState({ tables: [], kots: {}, items: {} });
    const [quantities, setQuantities] = useState({});
    const [destinationTableId, setDestinationTableId] = useState(null);
    const [leftSearch, setLeftSearch] = useState("");
    const [middleSearch, setMiddleSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");

    const outletId = localStorage.getItem("currentOutletId");
    const [selectedOutletId, setSelectedOutletId] = useState(outletId);
    const authChannelStr = localStorage.getItem("authChannels");
    const [fromTableId, setFromTableId] = useState([]);
    const authChannels = JSON.parse(authChannelStr);
    const userDetails = authChannels[0]?.adminDetails;
    const [itemEnabled, setItemEnabled] = useState(false);
    const [droppedItems, setDroppedItems] = useState([]);
    const oTables = tableData.filter(t => t.prefix === "O");
    const vTables = tableData.filter(t => t.prefix === "V");
    // console.log(droppedItems);

    const toggleTableSelection = table => {
        setSelectedTables(prev =>
            prev.some(t => t.tableId === table.tableId)
                ? prev.filter(t => t.tableId !== table.tableId)
                : [...prev, table]
        );
    };

    const updateQty = (orderId, serial, delta) => {
        const key = `${orderId}_${serial}`;
        setQuantities(prev => {
            const current = prev[key] ?? delta;
            const newQty = current + delta;
            return { ...prev, [key]: newQty > 0 ? newQty : 1 };
        });
    };

    const handleCheckbox = (type, key) => {
        if (type === "tables") {
            setCheckedItems(prev => {
                const exists = prev.tables.includes(key);
                return {
                    ...prev,
                    tables: exists ? prev.tables.filter(id => id !== key) : [...prev.tables, key],
                };
            });
        } else {
            setCheckedItems(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    [key]: !prev[type][key],
                },
            }));
        }
    };

    const getTotalWithoutTax = (table) => {
        return table.runningOrder?.reduce((total, order) => {
            return total + (order.orderDetails?.reduce((sum, item) => sum + (item.rate * item.qty), 0) || 0);
        }, 0) || 0;
    };

    const filteredLeftTables = oTables.filter(t => t?.tableName?.toLowerCase().includes(leftSearch.toLowerCase()));
    const filteredMiddleTables = selectedTables.filter(table =>
        table.tableName.toLowerCase().includes(middleSearch.toLowerCase()) ||
        table.runningOrder?.some(order =>
            order.kotNumber?.toLowerCase().includes(middleSearch.toLowerCase()) ||
            order.orderDetails?.some(item => item?.itemName?.toLowerCase().includes(middleSearch.toLowerCase()))
        )
    );
    const filteredRightTables = [...vTables, ...oTables].filter(t => t?.tableName?.toLowerCase().includes(rightSearch.toLowerCase()));

    // const isTransferAllowed = (checkedItems.tables.length > 0 || Object.values(checkedItems.kots).some(Boolean) || Object.values(checkedItems.items).some(Boolean)) && destinationTableId;

    const tabletransfer = async () => {
        // if (!isTransferAllowed) return;

        const payload = {
            fromTableId: fromTableId[0],
            toTableId: destinationTableId,
            toOutletId: selectedOutletId
        };
        console.log(payload);


        try {
            const res = await api.post("/order/tabletransfer", payload);
            if (res.data.isValid) {
                fetchTableData();
                setVisible(false);
                toast.success(`Table Transfer Successfully`);
            } else {
                toast.error(`Failed to transfer table`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const itemTransfers = async () => {

        const payload = droppedItems.map(entry => ({
            fromOutlet: entry.fromOutlet,
            fromTableDtos: entry.fromTableDtos.map(tableDto => ({
                fromTable: tableDto.fromTable,
                fromOrderDtos: tableDto.fromOrderDtos.map(orderDto => ({
                    fromOrderId: orderDto.fromOrderId,
                    itemTransfers: orderDto.itemTransfers.map(item => ({
                        itemId: item.itemId,
                        qty: item.qty
                    }))
                }))
            })),
            toTransfers: {
                toOutletId: entry.toTransfers.toOutletId,
                toTable: entry.toTransfers.toTable
            }
        }));

        console.log(payload);
        

        try {
            const res = api.post("/order/transferitems", payload);
            if (res.data.isValid) {
                fetchTableData();
                setVisible(false);
                toast.success(`Item Transfer Successfully`);
            } else {
                toast.error(`Failed to transfer Item`);
            }

        } catch (error) {
            console.log(error);

        }
    }

    const selectedItemKeys = Object.keys(checkedItems.items).filter(key => checkedItems.items[key]);
    const totalQty = selectedItemKeys.reduce((sum, key) => sum + (quantities[key] ?? 1), 0);
    const totalItems = selectedItemKeys.length;
    const totalPrice = selectedTables.reduce((sum, table) => {
        return sum + (table.runningOrder?.reduce((kotSum, order) => {
            return kotSum + (order.orderDetails?.reduce((itemSum, item) => {
                const key = `${order.orderID}_${item.serial}`;
                const qty = quantities[key] ?? item.qty;
                const isSelected = checkedItems.items[key];
                return itemSum + (isSelected ? item.rate * qty : 0);
            }, 0) || 0);
        }, 0) || 0);
    }, 0);
    const totalKots = Object.values(checkedItems.kots).filter(Boolean).length;

    const facilityColorMap = {};
    facility?.forEach(f => {
        facilityColorMap[f?.facilityStatusId] = f?.colour;
    });

    const getBgColor = (status) => facilityColorMap[status] || "#ffc300";

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <ToastContainer autoClose={2000} />
                <COffcanvas
                    placement="top"
                    visible={visible}
                    onHide={() => setVisible(false)}
                    backdrop={true}
                    scroll={true}
                    style={{ height: "90vh", marginTop: "3vh", maxWidth: "85vw", margin: "3vh auto" }}
                    className="rounded shadow border"
                >
                    <div className="transfer-toggle-container d-flex justify-content-center py-2">
                        <div className="toggle-group bg-white d-flex bg-light rounded-pill shadow-sm">
                            {['table', 'kot'].map((mode, idx) => (
                                <button
                                    key={mode}
                                    className={`toggle-btn px-3 py-1 rounded-pill fw-semibold ${transferMode === mode ? 'active' : ''
                                        }`}
                                    onClick={() => setTransferMode(mode)}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row h-100 transition-all">
                        <div className="w-100 w-md-25 border-end p-2 overflow-auto ">
                            <h6 className="fw-semibold text-center text-dark">From Tables</h6>
                            <UniversalSearch placeholder="Search Table..." value={leftSearch} onChange={setLeftSearch} />
                            <div className="d-flex flex-wrap gap-2 mt-2 justify-content-start">
                                {filteredLeftTables.map(table => {
                                    const isSelected = selectedTables.some(t => t.tableId === table.tableId);
                                    const total = getTotalWithoutTax(table);
                                    return (
                                        <div
                                            key={table?.tableId}
                                            className={`p-2 rounded  cursor-pointer small-box  shadow-md ${isSelected ? "text-black" : " text-white"}`}
                                            onClick={() => {
                                                if (transferMode === "kot") {
                                                    setFromTableId((prev) => [
                                                        ...prev, table.tableId
                                                    ])
                                                } else {
                                                    setFromTableId([table.tableId])
                                                }
                                                toggleTableSelection(table)
                                            }
                                            }
                                            // onClick={() => }
                                            style={{ width: '135px', backgroundColor: getBgColor(table?.facilityStatusId) }}
                                        >
                                            <div>

                                                <div className="">{table?.tableName}</div>
                                                <div className="small"> {table?.customerName || 'NA'}</div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2" style={{ color: "#bfbfbf" }}>

                                                <div className="small">₹ {table.amount}</div>
                                                <div className="small">₹ {table.withTaxAmount}</div>
                                            </div>
                                            <div className="small d-flex align-items-center justify-content-end">

                                                <div className="paxWrapper bg-white d-flex align-items-center gap-2 "
                                                    style={{ color: getBgColor(table?.facilityStatusId) }}
                                                ><IoPersonCircleOutline />{table?.capacity || 0}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <KOTTransfer
                            filteredMiddleTables={filteredMiddleTables}
                            filteredRightTables={filteredRightTables}
                            getTotalWithoutTax={getTotalWithoutTax}
                            getBgColor={getBgColor}
                            authChannels={authChannels}
                            transferMode={transferMode}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            middleSearch={middleSearch}
                            setMiddleSearch={setMiddleSearch}
                            rightSearch={rightSearch}
                            setRightSearch={setRightSearch}
                            itemEnabled={itemEnabled}
                            setItemEnabled={setItemEnabled}
                            checkedItems={checkedItems}
                            handleCheckbox={handleCheckbox}
                            quantities={quantities}
                            updateQty={updateQty}
                            selectedOutletId={selectedOutletId}
                            setSelectedOutletId={setSelectedOutletId}
                            destinationTableId={destinationTableId}
                            setDestinationTableId={setDestinationTableId}
                            setDroppedItems={setDroppedItems}
                            droppedItems={droppedItems}
                        />
                        {/* <div className={`border-end overflow-auto bg-white ${transferMode !== 'table' ? 'animate-middle p-3 w-md-50' : 'animate-middle-hidden'}`}>

                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <h6 className="fw-semibold mb-0">Selected KOTs</h6>

                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                <UniversalSearch
                                    placeholder="Search table, kot, item..."
                                    value={middleSearch}
                                    onChange={setMiddleSearch}
                                />
                                <button
                                    className={`btn btn-sm ${itemEnabled ? "btn-danger" : "btn-outline-success"}`}
                                    onClick={() => setItemEnabled(!itemEnabled)}
                                >
                                    {itemEnabled ? "Disable Item" : "Enable Item"}
                                </button>
                            </div>
                        </div>

                 
                        {filteredMiddleTables.map(table => (
                            <div key={table.tableId} className="mb-4">
                
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={checkedItems.tables.includes(table.tableId)}
                                        onChange={() => handleCheckbox("tables", table.tableId)}
                                    />
                                    <h6 className="mb-0 text-primary">{table.tableName}</h6>
                                </div>

           
                                {table.runningOrder?.map(order => (
                                    <div
                                        key={order.orderID}
                                        className={`mt-1 rounded border p-2 ${itemEnabled ? "bg-transparent border-secondary" : "bg-light"}`}
                                    >
                                        <div
                                            key={order.orderID}
                                            className={` rounded  p-2 ${itemEnabled ? "bg-transparent " : "bg-light"}`}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={checkedItems.kots[order.orderID] || false}
                                                    onChange={() => {
                                                        handleCheckbox("kots", order.orderID);

                                                        if (itemEnabled) {
                                                            order.orderDetails.forEach(item => {
                                                                const key = `${order.orderID}_${item.serial}`;
                                                                setCheckedItems(prev => ({
                                                                    ...prev,
                                                                    items: {
                                                                        ...prev.items,
                                                                        [key]: true,
                                                                    },
                                                                }));
                                                            });
                                                        }
                                                    }}
                                                />
                                                <span className="text-success fw-semibold">KOT: {order.kotNumber}</span>
                                            </div>
                                        </div>


                     
                                        {order.orderDetails?.map((item, idx) => {
                                            const key = `${order.orderID}_${item.serial}`;
                                            const qty = quantities[key] ?? item.qty;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`d-flex justify-content-between align-items-center ps-4 py-2 rounded ${itemEnabled ? "bg-warning-subtle" : "text-muted"
                                                        }`}
                                                    style={{
                                                        pointerEvents: itemEnabled ? "auto" : "none",
                                                        opacity: itemEnabled ? 1 : 0.6,
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={checkedItems.items[key] || false}
                                                            onChange={() => handleCheckbox("items", key)}
                                                        />
                                                        <span>{item.itemName}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => updateQty(order.orderID, item.serial, -1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{qty}</span>
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => updateQty(order.orderID, item.serial, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div> 

                         <div className="w-100 w-md-25 p-3 overflow-auto">

                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <select
                                className="rounded shadow-sm border-0"
                                value={selectedOutletId}
                                onChange={(e) => {
                                    const newId = e.target.value;
                                    setSelectedOutletId(newId);
                                    setDestinationTableId(null);
                                }}
                            >
                                {authChannels[0]?.channelOutlets?.map((outlet) => (
                                    <option key={outlet.outletID} value={outlet.outletID}>
                                        {outlet.outletName}
                                    </option>
                                ))}
                            </select>

                            <div className="d-flex align-items-center gap-2">
                                <h6 className="fw-semibold text-dark mb-0">To Tables</h6>

                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <UniversalSearch placeholder="Search Table..." value={rightSearch} onChange={setRightSearch} />
                            <div
                                className="toggle-switch d-flex align-items-center p-1 bg-light rounded-pill shadow-sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                            >
                                <div
                                    className={`p-1 rounded-circle d-flex align-items-center justify-content-center transition ${viewMode === "grid" ? "bg-warning text-white" : ""
                                        }`}
                                    style={{ width: 30, height: 30 }}
                                >
                                    <IoGridOutline size={16} />
                                </div>
                                <div
                                    className={`p-1 rounded-circle d-flex align-items-center justify-content-center transition ${viewMode === "table" ? "bg-warning text-white" : ""
                                        }`}
                                    style={{ width: 30, height: 30 }}
                                >
                                    <LuTable size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="position-relative mt-2" style={{ minHeight: "200px" }}>
                         
                            <div
                                className={`transition-fade ${viewMode === "grid" ? "show" : "hide"}`}
                                key="grid-view"
                            >
                                <div className="d-flex flex-wrap gap-2 justify-content-start">
                                    {filteredRightTables.map((table) => {
                                        const total = getTotalWithoutTax(table);
                                        return (
                                            <div
                                                key={table.tableId}
                                                className={`p-2 rounded cursor-pointer small-box shadow-md ${destinationTableId === table.tableId ? "text-black" : "text-white"
                                                    }`}
                                                onClick={() => setDestinationTableId(table.tableId)}
                                                style={{
                                                    width: "135px",
                                                    backgroundColor: getBgColor(table.facilityStatusId),
                                                }}
                                            >
                                                <div>
                                                    <div>{table?.tableName}</div>
                                                    <div className="small">{table?.customerName || "NA"}</div>
                                                </div>
                                                <div className="d-flex align-items-center gap-2" style={{ color: "#bfbfbf" }}>
                                                    <div className="small">₹ {table.amount}</div>
                                                    <div className="small">₹ {table.withTaxAmount}</div>
                                                </div>
                                                <div className="small d-flex align-items-center justify-content-end">
                                                    <div
                                                        className="paxWrapper bg-white d-flex align-items-center gap-2"
                                                        style={{ color: getBgColor(table?.facilityStatusId) }}
                                                    >
                                                        <IoPersonCircleOutline />
                                                        {table?.capacity || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            <div
                                className={`transition-fade ${viewMode === "table" ? "show" : "hide"}`}
                                key="table-view"
                            >
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm text-center">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>With Tax</th>
                                                <th>Capacity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRightTables.map((table) => (
                                                <tr
                                                    key={table.tableId}
                                                    className={destinationTableId === table.tableId ? "table-active" : ""}
                                                    onClick={() => setDestinationTableId(table.tableId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <td>{table?.tableName}</td>
                                                    <td>{table?.customerName || "NA"}</td>
                                                    <td>₹ {table.amount}</td>
                                                    <td>₹ {table.withTaxAmount}</td>
                                                    <td>{table?.capacity || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    </div>

                    <div className="p-3 border-top bg-white d-flex flex-column flex-md-row justify-content-between align-items-center">
                        <div className="text-muted small">
                            Items: <strong>{totalItems}</strong> | Qty: <strong>{totalQty}</strong> | KOTs: <strong>{totalKots}</strong> | ₹ <strong>{totalPrice.toFixed(2)}</strong>
                        </div>
                        <div
                            style={{ backgroundColor: "#ffc300" }}
                            className="btn px-4 shadow mt-2 mt-md-0 text-dark fw-semibold"
                            // disabled={!isTransferAllowed}
                            onClick={() => {

                                if (transferMode === "table") {
                                    tabletransfer()
                                } else {
itemTransfers()
                                }
                            }}
                        >
                            Confirm Transfer
                        </div>
                    </div>
                </COffcanvas>
            </DndProvider>
        </>
    );
};

export default Transfer;
