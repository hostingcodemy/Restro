import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IoGridOutline } from 'react-icons/io5';
import { LuTable } from 'react-icons/lu';
import { IoPersonCircleOutline } from 'react-icons/io5';
import "src/components/SmallComponents/Transfer.css";
import UniversalSearch from './UniversalSearch';
import { IoDocumentsSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
const KOTTransfer = ({ filteredMiddleTables, filteredRightTables, getTotalWithoutTax, getBgColor, authChannels, transferMode, middleSearch, setMiddleSearch, itemEnabled, setItemEnabled, checkedItems, handleCheckbox, quantities, updateQty, selectedOutletId, setSelectedOutletId, destinationTableId, setDestinationTableId, rightSearch, setRightSearch, viewMode, setViewMode, setDroppedItems, droppedItems }) => {

    const [showTablePopup, setShowTablePopup] = useState(null);
    const [disabledItems, setDisabledItems] = useState({ kots: new Set(), items: new Set(), kotItemMap: {} });
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowTablePopup(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDrop = (toTableId, item) => {
        setDroppedItems(prev => {
            const existingTransfer = prev.find(entry =>
                entry.toTransfers.toTable === toTableId &&
                entry.toTransfers.toOutletId === selectedOutletId
            );

            const sourceTable = filteredMiddleTables.find(t =>
                t.runningOrder?.some(o =>
                    o.orderID === item?.orderID || o.orderID === item?.data?.orderID
                )
            );
            const fromOutlet = sourceTable?.outletID || '';
            const fromTableId = sourceTable?.tableId;

            const orderID = item.type === 'KOT' ? item.data.orderID : item.orderID;
            const kotNumber = sourceTable?.runningOrder?.find(o => o.orderID === orderID)?.kotNumber || '';

            const itemsToAdd = item.type === 'KOT'
                ? item.data.orderDetails.map(i => ({
                    itemId: i.itemId,
                    qty: i.qty,
                    itemName: i.itemName
                }))
                : [{
                    itemId: item.data.itemId,
                    qty: item.data.qty,
                    itemName: item.data.itemName
                }];

            const updated = [...prev];

            if (existingTransfer) {
                const fromTableDto = existingTransfer.fromTableDtos.find(ft => ft.fromTable === fromTableId);
                if (fromTableDto) {
                    const fromOrderDto = fromTableDto.fromOrderDtos.find(fo => fo.fromOrderId === orderID);
                    if (fromOrderDto) {
                        fromOrderDto.itemTransfers.push(...itemsToAdd);
                    } else {
                        fromTableDto.fromOrderDtos.push({
                            fromOrderId: orderID,
                            kotNumber,
                            itemTransfers: itemsToAdd
                        });
                    }
                } else {
                    existingTransfer.fromTableDtos.push({
                        fromTable: fromTableId,
                        fromOrderDtos: [{
                            fromOrderId: orderID,
                            kotNumber,
                            itemTransfers: itemsToAdd
                        }]
                    });
                }
            } else {
                updated.push({
                    fromOutlet,
                    fromTableDtos: [{
                        fromTable: fromTableId,
                        fromOrderDtos: [{
                            fromOrderId: orderID,
                            kotNumber,
                            itemTransfers: itemsToAdd
                        }]
                    }],
                    toTransfers: {
                        toOutletId: selectedOutletId,
                        toTable: toTableId
                    }
                });
            }

            return updated;
        });
    };



    const removeFromTable = (tableId, type, id, kotNumber = null) => {
        const element = document.getElementById(`${type}-${id}-${tableId}`);
        if (element) {
            element.classList.add('fade-out');

            setTimeout(() => {
                setDroppedItems(prev => {
                    return prev
                        .map(entry => {
                            if (entry.toTransfers.toTable !== tableId) return entry;

                            const updatedFromTableDtos = entry.fromTableDtos
                                .map(tableDto => {
                                    const updatedOrders = tableDto.fromOrderDtos
                                        .map(orderDto => {


                                            const isMatch = orderDto.kotNumber === id || orderDto.kotNumber === kotNumber;

                                            // Remove whole KOT
                                            if (type === 'KOT' && isMatch) return null;

                                            // Remove item inside matching KOT
                                            if (type === 'ITEM' && isMatch) {
                                                const remainingItems = orderDto.itemTransfers.filter(item => item.itemId !== id);
                                                if (remainingItems.length === 0) return null;
                                                return {
                                                    ...orderDto,
                                                    itemTransfers: remainingItems
                                                };
                                            }

                                            return orderDto;
                                        })
                                        .filter(Boolean); // Remove null orders

                                    return updatedOrders.length > 0
                                        ? { ...tableDto, fromOrderDtos: updatedOrders }
                                        : null;
                                })
                                .filter(Boolean); // Remove empty fromTableDtos

                            return updatedFromTableDtos.length > 0
                                ? { ...entry, fromTableDtos: updatedFromTableDtos }
                                : null;
                        })
                        .filter(Boolean); // Remove empty top-level entries
                });
            }, 200);
        }
    };



    const getTableDropSummary = (tableId) => {
        const dropped = droppedItems[tableId];
        if (!dropped) return [];
        const grouped = {};
        for (const kot of dropped.kots) {
            grouped[kot.orderID] = { kot, items: [] };
        }
        for (const item of dropped.items) {
            if (!grouped[item.orderID]) grouped[item.orderID] = { kot: null, items: [] };
            grouped[item.orderID].items.push(item);
        }
        return Object.entries(grouped);
    };

    const DraggableKOT = ({ kot }) => {
        const [, drag] = useDrag(() => ({ type: 'KOT', item: { type: 'KOT', data: kot } }));
        return <div ref={drag} className="border p-2 rounded bg-white mb-2 cursor-pointer">KOT: {kot.kotNumber}</div>;
    };

    const DraggableItem = ({ item, orderID }) => {
        const [, drag] = useDrag(() => ({ type: 'ITEM', item: { type: 'ITEM', data: item, orderID } }));
        return <div ref={drag} className="d-flex justify-content-between cursor-pointer"><span>{item.itemName}</span></div>;
    };

    const DroppableTable = ({ table, onClick }) => {
        const [, drop] = useDrop(() => ({
            accept: ['KOT', 'ITEM'],
            drop: (item) => handleDrop(table.tableId, item),
        }));

        const transfer = droppedItems.find(d =>
            d.toTransfers.toTable === table.tableId &&
            d.toTransfers.toOutletId === selectedOutletId
        );

        const tableDrops = [];
        if (transfer) {
            for (const fromTableDto of transfer.fromTableDtos) {
                for (const fromOrderDto of fromTableDto.fromOrderDtos) {
                    tableDrops.push({
                        kotNumber: fromOrderDto.kotNumber, // use kotNumber
                        items: fromOrderDto.itemTransfers  // includes itemName now
                    });
                }
            }
        }


        return (
            <div
                ref={drop}
                onClick={onClick}
                className={`p-2 cursor-pointer border rounded position-relative fw-bold ${destinationTableId === table.tableId ? 'border-warning' : 'border-secondary text-white'}`}
                style={{ backgroundColor: getBgColor(table.facilityStatusId), width: '135px' }}
            >
                <div>{table?.tableName}</div>
                <div className="small">{table?.customerName || 'NA'}</div>
                <div className="d-flex align-items-center gap-2 text-muted">
                    <div className="small">₹ {table.amount}</div>
                    <div className="small">₹ {table.withTaxAmount}</div>
                </div>
                <div className="small d-flex justify-content-end">
                    <div className="paxWrapper bg-white d-flex align-items-center gap-2" style={{ color: getBgColor(table?.facilityStatusId) }}>
                        <IoPersonCircleOutline />{table?.capacity || 0}
                    </div>
                </div>

                {tableDrops.length > 0 && (
                    <div onClick={(e) => {
                        e.stopPropagation();
                        setShowTablePopup(showTablePopup === table.tableId ? null : table.tableId);
                    }} className="position-absolute top-0 end-0 m-1 text-white"><IoDocumentsSharp /></div>
                )}

                {showTablePopup === table.tableId && (
                    <div ref={popupRef} className="popup-animated text-black bg-white p-2 rounded shadow position-absolute top-50 start-0 mt-1 z-3" style={{ minWidth: '260px' }}>
                        <h6 className="text-primary">{table.tableName}</h6>
                        {tableDrops.map(({ kotNumber, items }) => (
                            <div key={kotNumber} className=" pb-2 fade-container" id={`KOT-${kotNumber}-${table.tableId}`}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold">KOT : {kotNumber}</span>
                                    <div className='btn btn-outline-danger btn-sm' onClick={() => removeFromTable(table.tableId, 'KOT', kotNumber)}><RxCross2 /></div>
                                </div>
                                <ul className="mb-1 ps-3">
                                    {items.map((item, idx) => (
                                        <li key={`${item.itemId}-${idx}`} className="d-flex justify-content-between align-items-center fade-container">
                                            <span>{item.itemName} × {item.qty}</span>
                                            <div className='btn btn-outline-danger btn-sm' onClick={() => removeFromTable(table.tableId, 'ITEM', item.itemId, kotNumber)}><RxCross2 /></div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        );
    };


    return (
        <DndProvider backend={HTML5Backend}>

            <div className={`border-end overflow-auto bg-white ${transferMode !== 'table' ? 'animate-middle p-2 w-md-50' : 'animate-middle-hidden'}`}>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-column gap-2">
                    <h6 className="fw-semibold mb-0">Selected KOTs</h6>


                    <div className="d-flex  align-items-center w-100 gap-2">
                        <UniversalSearch
                            placeholder="Search table, kot, item..."
                            value={middleSearch}
                            onChange={setMiddleSearch}
                        />

                        <button style={{ width: "10vw" }} className={`btn btn-sm ${itemEnabled ? 'btn-warning text-white' : 'btn-light'}`} onClick={() => setItemEnabled(!itemEnabled)}>
                            {itemEnabled ? 'Disable Item' : 'Enable Item'}
                        </button>
                    </div>

                </div>

                {filteredMiddleTables.map(table => (
                    <div key={table.tableId} className="mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <input type="checkbox" className="form-check-input" checked={checkedItems.tables.includes(table.tableId)} onChange={() => handleCheckbox('tables', table.tableId)} />
                            <h6 className="mb-0 text-primary">{table.tableName}</h6>
                        </div>
                        {table?.runningOrder?.map(order => (
                            <div key={order.orderID} className={`mt-2 rounded border p-2 ${itemEnabled ? 'bg-transparent shadow-sm' : 'bg-light'}`}>
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        disabled={disabledItems.kots.has(order.orderID)}
                                        checked={checkedItems.kots[order.orderID] || false}
                                        onChange={() => {
                                            handleCheckbox('kots', order.orderID);
                                            if (itemEnabled) {
                                                order.orderDetails.forEach(item => {
                                                    const key = `${order.orderID}_${item.serial}`;
                                                    handleCheckbox('items', key);
                                                });
                                            }
                                        }}
                                    />
                                    <DraggableKOT kot={order} />

                                    {/* <span className={`fw-semibold ${disabledItems.kots.has(order.orderID) ? 'text-muted text-decoration-line-through' : 'text-success'}`}>KOT: {order.kotNumber}</span> */}
                                </div>
                                {order?.orderDetails?.map(item => {
                                    const key = `${order.orderID}_${item.serial}`;
                                    const qty = quantities[key] ?? item.qty;
                                    const isDisabled = disabledItems.items.has(key);
                                    return (
                                        <div key={key} className={`d-flex justify-content-between align-items-center p-1 mb-2 rounded ${itemEnabled ? 'bg-light' : 'text-muted'} ${isDisabled ? 'opacity-50 text-decoration-line-through' : ''}`} style={{ pointerEvents: itemEnabled && !isDisabled ? 'auto' : 'none', opacity: itemEnabled && !isDisabled ? 1 : 0.5 }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <input type="checkbox" className="form-check-input" disabled={isDisabled} checked={checkedItems.items[key] || false} onChange={() => handleCheckbox('items', key)} />

                                                <DraggableItem item={item} orderID={order.orderID} />

                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(order.orderID, item.serial, -1)}>-</button>
                                                <span>{qty}</span>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQty(order.orderID, item.serial, 1)}>+</button>
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
                    <select className="rounded shadow-sm border-0" value={selectedOutletId} onChange={(e) => { setSelectedOutletId(e.target.value); setDestinationTableId(null); }}>
                        {authChannels[0]?.channelOutlets?.map(outlet => (
                            <option key={outlet.outletID} value={outlet.outletID}>{outlet.outletName}</option>
                        ))}
                    </select>
                    <h6 className="fw-semibold text-dark mb-0">To Tables</h6>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <input className="form-control" value={rightSearch} onChange={(e) => setRightSearch(e.target.value)} placeholder="Search Table..." />
                    <div className="toggle-switch d-flex align-items-center p-1 bg-light rounded-pill shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
                        <div className={`p-1 rounded-circle d-flex align-items-center justify-content-center transition ${viewMode === 'grid' ? 'bg-warning text-white' : ''}`} style={{ width: 30, height: 30 }}>
                            <IoGridOutline size={16} />
                        </div>
                        <div className={`p-1 rounded-circle d-flex align-items-center justify-content-center transition ${viewMode === 'table' ? 'bg-warning text-white' : ''}`} style={{ width: 30, height: 30 }}>
                            <LuTable size={16} />
                        </div>
                    </div>
                </div>
                <div className="position-relative mt-2" style={{ minHeight: '200px' }}>
                    <div className={`transition-fade ${viewMode === 'grid' ? 'show' : 'hide'}`} key="grid-view">
                        <div className="d-flex flex-wrap gap-2 justify-content-start">
                            {filteredRightTables.map(table => (
                                <DroppableTable
                                    key={table.tableId}
                                    table={table}
                                    onClick={() => setDestinationTableId(table.tableId)} />
                            ))}
                        </div>
                    </div>
                    <div className={`transition-fade ${viewMode === 'table' ? 'show' : 'hide'}`} key="table-view">
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
                                    {filteredRightTables?.map(table => (
                                        <tr key={table.tableId} className={destinationTableId === table.tableId ? 'table-active' : ''} onClick={() => setDestinationTableId(table.tableId)} style={{ cursor: 'pointer' }}>
                                            <td>{table.tableName}</td>
                                            <td>{table.customerName || 'NA'}</td>
                                            <td>₹ {table.amount}</td>
                                            <td>₹ {table.withTaxAmount}</td>
                                            <td>{table.capacity || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </DndProvider>
    );
};

export default KOTTransfer;

