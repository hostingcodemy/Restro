import React, { useEffect, useState } from 'react';
import api from '../../../config/AxiosInterceptor';
import "src/components/SmallComponents/Transfer/AllTransfer.css";
import UniversalSearch from '../UniversalSearch';
import { useTransferTable } from '../../../Context/TransferContext';
import { IoPersonCircleOutline } from "react-icons/io5";

const RightPart = ({ facility, transferMode }) => {

    const outletId = localStorage.getItem("currentOutletId");
    const authChannelStr = localStorage.getItem("authChannels");
    const authChannels = JSON.parse(authChannelStr);
    const [selectedOutletId, setSelectedOutletId] = useState(outletId);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { selectedTables, handleSelectTable } = useTransferTable();
    useEffect(() => {
        fetchTableData(selectedOutletId);
    }, [selectedOutletId]);

    const fetchTableData = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/tablelog/outlet/${id}`);
            setTableData(response?.data?.list || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const selectedTableIds = selectedTables.map(t => t.tableId);
    const filteredTables = tableData.filter(table =>
        (table.prefix === 'V' || table.prefix === 'O') &&
        table.tableName?.toLowerCase().includes(searchTerm) &&
        !selectedTableIds.includes(table.tableId)
    );

    const facilityColorMap = {};
    facility?.forEach(f => {
        facilityColorMap[f?.facilityStatusId] = f?.colour;
    });

    const getBgColor = (status) => {
        return facilityColorMap[status] || "gray";
    };


    return (
        <div className="p-3 w-100 w-md-25 border-end overflow-auto">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
                <div className="flex-grow-1">
                    <select
                        className="form-select w-25 border-0"
                        value={selectedOutletId}
                        onChange={(e) => setSelectedOutletId(e.target.value)}
                    >
                        {authChannels[0]?.channelOutlets?.map((outlet) => (
                            <option key={outlet.outletID} value={outlet.outletID}>
                                {outlet.outletName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="fw-semibold text-nowrap">To Table</div>
            </div>
            <UniversalSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search table..."
            />

            {loading ? (
                <div className="fancy-loader-wrapper d-flex justify-content-center align-items-center w-100" style={{ minHeight: '150px' }}>
                    <div className="fancy-spinner" />
                </div>
            ) : (
                <div className="d-flex flex-wrap gap-2 mt-2">
                    {filteredTables.map((table) => (
                        <div
                            key={table.tableId}
                            className="p-2 rounded  cursor-pointer small-box text-white"
                            style={{ width: '135px', backgroundColor: getBgColor(table.facilityStatusId) }}
                            onClick={() => handleSelectTable(table)}
                        >
                            <div>

                                <div className="">{table?.tableName}</div>
                                <div className="small"> {table?.customerName || 'NA'}</div>
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ color: "#bfbfbf" }}>

                                <div className="small">₹ {table?.amount}</div>
                                <div className="small">₹ {table?.withTaxAmount}</div>
                            </div>
                            <div className="small d-flex align-items-center justify-content-end">

                                <div className="paxWrapper bg-white d-flex align-items-center gap-2 "
                                    style={{ color: getBgColor(table?.facilityStatusId) }}
                                ><IoPersonCircleOutline />{table?.capacity || 0}</div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default RightPart;




