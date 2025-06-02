import React, { useEffect, useState, useRef } from 'react';
//import MenuBar from '../../Components/MenuBar';
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineFormatListNumberedRtl } from "react-icons/md";
import { IoFastFoodOutline, IoRestaurantOutline } from "react-icons/io5";
import api from '../../../config/AxiosInterceptor';

const ItemOutlet = () => {
    const location = useLocation();
    const itemFormData = location.state?.formData;
    const navigate = useNavigate();
    const fetchCalled = useRef(false);
    const popupRef = useRef();
    const [popupOutlet, setPopupOutlet] = useState(null);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

    const [formData, setFormData] = useState({});
    const [confirmedOutlets, setConfirmedOutlets] = useState([]);
    const [outletData, setOutletData] = useState([]);

    // useEffect(() => {
    //     setIsHiddenSidebarOpen(true);
    // }, []);

    useEffect(() => {
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            fetchOutletData();
        }
    }, []);

    const fetchOutletData = async () => {
        try {
            const res = await api.get("/outlets");
            const sortedData = res?.data?.list?.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setOutletData(sortedData);
        } catch (error) {
            console.error("Error fetching outlet data", error);
        }
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            if (popupOutlet) {
                handleAutoSave(popupOutlet);
                setPopupOutlet(null);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupOutlet]);

    const handleOutletClick = (outletName, outletId, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopupPos({ top: rect.bottom + window.scrollY, left: rect.left });

        if (popupOutlet && popupOutlet !== outletName) {
            handleAutoSave(popupOutlet);
        }

        setPopupOutlet(outletName);
        setFormData(prev => ({
            ...prev,
            [outletName]: {
                ...prev[outletName],
                outletId
            }
        }));
    };

    const handleAutoSave = (outletName) => {
        if (!confirmedOutlets.includes(outletName)) {
            setConfirmedOutlets(prev => [...prev, outletName]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const actualValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [popupOutlet]: {
                ...prev[popupOutlet],
                [name]: actualValue
            }
        }));
    };

    const outlets = [
        { name: "All", id: "all" },
        ...outletData?.map(outlet => ({
            name: outlet.outletName,
            id: outlet.outletID
        }))
    ];

    const handleNextClick = () => {
        const outletEntries = Object.entries(formData).filter(([_, outletData]) =>
            outletData?.rates && Object.keys(outletData.rates).length > 0
        );

        if (outletEntries.length === 0) {
            alert("Please fill in price data for at least one outlet.");
            return;
        }

        const outletMappedData = outletEntries.map(([outletName, outletData]) => ({
            outletName,
            outletId: outletData.outletId,
            prices: Object.entries(outletData.rates || {}).map(([size, price]) => ({
                itemQuantity: outletData.itemQuantity || 1,
                itemSize: size,
                itemPrice: parseFloat(price),
                isSoldMRP: outletData.isMRP || false,
                isDiscountable: true,
                isVisible: true,
                isActive: true
            }))
        }));

        navigate("/item-tax", {
            state: {
                itemData: itemFormData,
                outletData: outletMappedData
            }
        });
    };

    const isSelected = (name) => confirmedOutlets.includes(name);

    return (
        <div className='d-flex overflow-hidden'>
            {/* <MenuBar /> */}
            <div className="configurationFormContainer">
                <div className='configurationFormWrapper'>
                    <div className='configurationgroupFormHeader'>
                        <h2>Item <span>Outlet Mapping</span></h2>
                    </div>

                    <div className="outlets shadow-sm d-flex align-items-center flex-wrap">
                        {outlets.map((outlet, idx) => (
                            <div
                                key={idx}
                                className={`shadow-sm outlet ${isSelected(outlet.name) ? 'selected' : ''}`}
                                onClick={(e) => handleOutletClick(outlet.name, outlet.id, e)}
                            >
                                {outlet.name}
                            </div>
                        ))}
                    </div>

                    <div className="table-container shadow-sm rounded-2">
                        <table>
                            <thead>
                                <tr>
                                    <th><MdOutlineFormatListNumberedRtl /> Sl No</th>
                                    <th><IoFastFoodOutline /> Item Name</th>
                                    <th><IoRestaurantOutline /> Outlet</th>
                                    <th><IoRestaurantOutline /> Price</th>
                                    <th><IoRestaurantOutline /> MRP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {confirmedOutlets.map((outletName, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{itemFormData?.itemName}</td>
                                        <td>{outletName}</td>
                                        <td>{Object.entries(formData[outletName]?.rates || {}).map(([size, price]) => `${size}: ${price}`).join(', ')}</td>
                                        <td>{formData[outletName]?.isMRP ? 'True' : 'False'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <TbPlayerTrackPrev />
                            <div>Page</div>
                            <TbPlayerTrackNext />
                        </div>
                    </div>

                    <div className="bottomBtn d-flex align-items-center justify-content-between">
                        <div className="prevBtn" onClick={() => navigate("/item")}> <TbPlayerTrackPrev /> Previous </div>
                        <div className="nextBtn" onClick={handleNextClick}> Next <TbPlayerTrackNext /> </div>
                    </div>
                </div>

                {popupOutlet && (
                    <div
                        ref={popupRef}
                        className="popup animated-popup"
                        style={{ top: popupPos.top + 10, left: popupPos.left }}
                    >
                        <div className="toggle-container mb-2">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="isMRP"
                                    checked={formData[popupOutlet]?.isMRP || false}
                                    onChange={handleInputChange}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="toggle-label">isMRP</span>
                        </div>

                        <div className="size-toggle mb-2">
                            {['Small', 'Medium', 'Large'].map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`size-btn ${formData[popupOutlet]?.selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        [popupOutlet]: {
                                            ...prev[popupOutlet],
                                            selectedSize: size
                                        }
                                    }))}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="itemPrice"
                                placeholder={`Rate for ${formData[popupOutlet]?.selectedSize || ''}`}
                                className="form-control"
                                autoComplete='off'
                                value={formData[popupOutlet]?.rates?.[formData[popupOutlet]?.selectedSize] || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        const size = formData[popupOutlet]?.selectedSize;
                                        setFormData(prev => ({
                                            ...prev,
                                            [popupOutlet]: {
                                                ...prev[popupOutlet],
                                                rates: {
                                                    ...prev[popupOutlet]?.rates,
                                                    [size]: value
                                                }
                                            }
                                        }));
                                    }
                                }}
                                
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemOutlet;
