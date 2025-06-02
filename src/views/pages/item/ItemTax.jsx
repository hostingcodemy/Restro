import React, { useEffect, useState, useRef } from 'react';
//import MenuBar from '../../Components/MenuBar';
//import { useCategory } from '../../Context/CategoryContext';
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineFormatListNumberedRtl } from "react-icons/md";
import { IoFastFoodOutline, IoRestaurantOutline } from "react-icons/io5";
import { HiOutlineReceiptTax } from "react-icons/hi";
import api from '../../../config/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';
import { TbTax } from "react-icons/tb";

const ItemTax = () => {

    const navigate = useNavigate();
    const fetchCalled = useRef(false);
    const location = useLocation();
    const { itemData, outletData } = location.state || {};
    const [taxData, setTaxData] = useState([]);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // const { setIsHiddenSidebarOpen } = useCategory();

    // useEffect(() => {
    //     setIsHiddenSidebarOpen(true);
    // }, []);

    useEffect(() => {
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            fetchTaxData();
        }
    }, []);

    const fetchTaxData = async () => {
        try {
            const res = await api.get("/tax");
            const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setTaxData(sortedData);
        } catch (error) {
            console.error("Error fetching tax data", error);
        }
    };

    useEffect(() => {
        if (itemData && outletData?.length) {
            const mappedData = outletData.map((outlet, index) => ({
                id: index + 1,
                itemName: itemData.itemName || 'Unnamed Item',
                itemImage: itemData.itemImage || 'src/assets/default.png',
                outletName: outlet.outletName || 'Unnamed Outlet',
                selectedTaxes: [],
                isTaxWithDiscount: outlet.isTaxWithDiscount || false,
            }));
            setData(mappedData);
        }
    }, [itemData, outletData]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const toggleTax = (rowIndex, taxId) => {
        const newData = [...filteredData];
        const globalIndex = data.findIndex(d => d.id === newData[rowIndex].id);
        const row = data[globalIndex];
        const isSelected = row.selectedTaxes.includes(taxId);
        row.selectedTaxes = isSelected
            ? row.selectedTaxes.filter(t => t !== taxId)
            : [...row.selectedTaxes, taxId];
        setData([...data]);
    };

    const toggleAllTaxes = (rowIndex) => {
        const newData = [...filteredData];
        const globalIndex = data.findIndex(d => d.id === newData[rowIndex].id);
        const row = data[globalIndex];
        const hasAll = taxData.every(t => row.selectedTaxes.includes(t.taxId));
        row.selectedTaxes = hasAll ? [] : taxData.map(t => t.taxId);
        setData([...data]);
    };

    const isAllSelected = (row) => taxData.every(t => row.selectedTaxes.includes(t.taxId));

    const filteredData = data.filter(
        (item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.outletName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);


    const handleSubmit = async () => {
        if (!itemData || !outletData) return;

        const mappedOutlets = outletData.map((outlet, index) => {
            const row = data.find(d => d.outletName === outlet.outletName);

            return {
                outletId: outlet.outletId,
                prices: outlet.prices || [],
                taxes: row?.selectedTaxes?.map(taxId => ({
                    taxId,
                    isActive: true
                })) || []
            };
        });

        const payload = {
            item: {
                ...itemData,
                mappings: mappedOutlets
            }
        };

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
            setTimeout(() => {
                navigate("/items");
            }, 3000);
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
        }
    };


    return (
        <div className='d-flex overflow-hidden'>
            {/* <MenuBar /> */}
            <ToastContainer />
            <div className="configurationFormContainer">
                <div className='configurationFormWrapper'>
                    <div className='d-flex flex-column gap-3'>
                        <div className='configurationgroupFormHeader'>
                            <h2>Tax <span>Setup</span></h2>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by item or outlet name"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control mb-3"
                        />
                        <div className="table-container shadow-sm rounded-2">
                            <table>
                                <thead>
                                    <tr>
                                        <th className='serialNo'><MdOutlineFormatListNumberedRtl /> Sl No</th>
                                        <th className='item'><IoFastFoodOutline /> Item Name</th>
                                        <th className='outletHeading'><IoRestaurantOutline /> Outlet</th>
                                        <th className='taxWithDiscount'><TbTax />Tax with Discount</th>
                                        <th className='taxType'><HiOutlineReceiptTax /> Selected Taxes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((row, index) => (
                                        <tr key={row.id}>
                                            <td className='serialNo'>{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                            <td className='itemRow'>
                                                <div className="item-info">
                                                    <img src={row.itemImage} alt={row.itemName} />
                                                    <div>{row.itemName}</div>
                                                </div>
                                            </td>
                                            <td className='outletrow'>
                                                <span className='outletName'>{row.outletName}</span>
                                            </td>
                                            <td className='taxDiscount'>
                                                <input
                                                    type="checkbox"
                                                    checked={row.isTaxWithDiscount}
                                                    onChange={() => {
                                                        const updated = [...data];
                                                        updated.find(d => d.id === row.id).isTaxWithDiscount = !row.isTaxWithDiscount;
                                                        setData(updated);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <div className="tax-buttons">
                                                    <button
                                                        className={isAllSelected(row) ? 'taxBtn taxSelected' : 'taxBtn'}
                                                        onClick={() => toggleAllTaxes(index)}
                                                    >
                                                        All
                                                    </button>
                                                    {taxData.map((tax) => (
                                                        <button
                                                            key={tax.taxId}
                                                            className={row.selectedTaxes.includes(tax.taxId) ? 'taxBtn taxSelected' : 'taxBtn'}
                                                            onClick={() => toggleTax(index, tax.taxId)}
                                                        >
                                                            {tax.taxName}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="pagination">
                                <span onClick={() => page > 1 && setPage(page - 1)}>
                                    <TbPlayerTrackPrev />
                                </span>
                                <div>Page {page} of {totalPages}</div>
                                <span onClick={() => page < totalPages && setPage(page + 1)}>
                                    <TbPlayerTrackNext />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bottomBtn d-flex align-items-center justify-content-between">
                        <div className="prevBtn" onClick={() => navigate("/itemOutlet")}>
                            <div className='prevIcon'><TbPlayerTrackPrev /></div>Previous
                        </div>
                        <div className="nextBtn" onClick={handleSubmit}>
                            Submit <div className='nextIcon'><TbPlayerTrackNext /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemTax;
