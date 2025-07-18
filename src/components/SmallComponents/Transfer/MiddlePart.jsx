import React, { useState } from 'react'
import UniversalSearch from '../UniversalSearch';
import { useTransferTable } from '../../../Context/TransferContext';

const MiddlePart = ({ transferMode }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        selectedTables,
        isChecked,
        toggleCheck,
        quantities,
        changeQty
    } = useTransferTable();

    return (
        <div className={`border-end overflow-auto bg-white ${transferMode !== 'table' ? 'animate-middle p-2 w-md-50' : 'animate-middle-hidden'}`}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-column gap-2">
                <h6 className="fw-semibold mb-0">Selected KOT and Items</h6>


                <div className="d-flex  align-items-center w-100 gap-2">
                    <UniversalSearch
                        placeholder="Search table, kot, item..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />


                </div>
                <div className="p-3">
                    {selectedTables.map(table => (
                        <div key={table.tableId} className="mb-3 border p-2 rounded shadow-sm ">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    checked={isChecked('tables', table.tableId)}
                                    onChange={() => toggleCheck('tables', table.tableId, {
                                        kots: table.runningOrder
                                    })}
                                />
                                <h6 className="ms-2 mb-0 fw-bold">{table.tableName}</h6>
                            </div>

                            {table.runningOrder.map(kot => (
                                <div key={kot.orderID} className="ms-4 mt-3 border-start ps-3">
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            checked={isChecked('kots', kot.orderID)}
                                            onChange={() => toggleCheck('kots', kot.orderID, {
                                                items: kot.orderDetails
                                            })}
                                        />
                                        <span className="ms-2 fw-semibold text-warning">
                                            KOT : {kot.kotNumber}
                                        </span>
                                    </div>

                                    {kot.orderDetails.map(item => (
                                        <div key={item.itemId} className="ms-4 mt-2 d-flex align-items-center justify-content-between gap-5">
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked('items', item.itemId)}
                                                    onChange={() => toggleCheck('items', item.itemId)}
                                                />
                                                <span className="ms-2">
                                                    {item.itemName} ({item.sizeName})
                                                </span>
                                            </div>

                                            <div className="d-flex align-items-center gap-3">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => changeQty(item.itemId, -1)}
                                                >
                                                    -
                                                </button>
                                                <span className='text-warning fw-bold'>{quantities[item.itemId] || item.qty}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => changeQty(item.itemId, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default MiddlePart;
