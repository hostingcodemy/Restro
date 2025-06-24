import React, { useEffect, useRef, useState } from 'react'
import { PiBowlFoodThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { RiArrowDownSFill } from "react-icons/ri";
import {
  LuChefHat,
  LuLeaf,
  LuDrumstick,
  LuCupSoda,
  LuCigarette,
  LuBeer,
  LuHeart,
  LuBadgeCheck
} from "react-icons/lu";
import { RxValueNone } from "react-icons/rx";
import api from '../../../config/AxiosInterceptor';
import "src/views/pages/pos/Pos.css"
import { PiStarLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { IoPersonOutline } from "react-icons/io5";
import { BsRepeat } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { useCart } from '../../../Context/ItemCartContext';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { GoPerson } from "react-icons/go";
import { CiMobile4 } from "react-icons/ci";
import { PiArmchairLight } from "react-icons/pi";
import { LuHandPlatter } from "react-icons/lu";
import Select from 'react-select';
import { PiMicrophoneThin } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";


const PosScreen = () => {

  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, increaseAddonQty, decreaseAddonQty, updateRemarks, setCartItems } = useCart();
  const navigateTable = JSON.parse(localStorage.getItem("navigateTable") || "[]");
  const fetchCalled = useRef(false);
  const [item, setItem] = useState(null);
  const [subcategory, setSubcategory] = useState([]);
  const [hover, SetHover] = useState(null);
  const outletId = localStorage.getItem("currentOutletId");
  const baseImgUrl = import.meta.env.VITE_IMG_BASE_URL;
  const authChannelStr = localStorage.getItem("authChannels");
  const authChannels = JSON.parse(authChannelStr);
  const userDetails = authChannels[0]?.adminDetails;
  const userId = userDetails?.userID || "";
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    userName: '',
    mobileNumber: '',
    pax: '',
    remarks: '',
  });
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddonModalFor, setShowAddonModalFor] = useState(null);
  const [openRemarksFor, setOpenRemarksFor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [itemAddons, setItemAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [remarks, setRemarks] = useState('');


  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchItemsData();
    fetchSubcategory();
  }, []);

  const fetchItemsData = async () => {
    try {
      const res = await api.get(`/items/outlet/${outletId}`);
      setItem(res.data.list);
    } catch (error) {
      console.error("Error fetching Items data", error);
    }
  };

  const fetchSubcategory = async () => {
    try {
      const res = await api.get(`/itemsubcategory/outlet/${outletId}`);
      setSubcategory(res.data.list);
    } catch (error) {
      console.error("Error fetching Items data", error);
    }
  };

  const fetchCustomerDetails = async () => {

    try {
      const res = await api.get("/customers");
      const customerOptions = res.data.list.map((c) => ({
        value: c.customerID,
        label: c.name,
        ...c,
      }));
      setCustomers(customerOptions);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (selected) => {
    setSelectedCustomer(selected);
    setPopupData((prev) => ({
      ...prev,
      mobileNumber: selected.mobile
    }))
  };

  const handlePlaceOrder = () => {
    if (navigateTable.prefix === "V") {
      setShowPopup(true);
      fetchCustomerDetails();
    } else {
      placeOrder();
    };
  }

  const placeOrder = async () => {

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cannot place order: Cart is empty.");
      return;
    }

    const payload = {
      outletId: outletId,
      tableID: navigateTable.tableId,
      manualKotNumber: null,
      pax: popupData.pax || navigateTable.capacity,
      customerName: selectedCustomer.name || null,
      customerPhone: popupData.mobileNumber || null,
      terminalID: null,
      orderType: "Dine in",
      orderDate: new Date().toISOString(),
      orderTaker: userId,
      orderRemarks: popupData.remarks || null,
      isActive: true,
      orderDetailsList: cartItems.map((item, index) => {
        const matchedPrice = item.prices?.find(
          (price) => price.outletId === outletId
        );
        const rate = matchedPrice?.itemPrice || 0;

        const addonList = item.addonItems?.items?.map((addon) => ({
          addonItemID: addon.itemId,
          qty: addon.itemQuantity || 1,
          uomId: addon.uomId || '',
          sizeId: addon.itemSizeId || '',
          rate: addon.itemPrice || 0,
          total: (addon.itemPrice || 0) * (addon.itemQuantity || 1),
          isNonChargeable: false,
        })) || [];

        return {
          serial: index + 1,
          itemId: item.itemId,
          itemRemarks: item.remarks || '',
          qty: item.quantity,
          uomId: item.uomID || '',
          sizeId: matchedPrice?.itemSizeId || '',
          rate: rate,
          offerID: item.offerID || '',
          isPrint: item.isPrint ?? true,
          isNonChargeable: item.isNonChargeable ?? true,
          total: rate * item.quantity,
          isActive: true,
          isRateOrAmount: false,
          discountRemarks: null,
          itemDiscount: null,
          isNonChargeable: false,
          addonList: addonList
        };
      })
    };

    console.log(payload);


    try {
      const res = await api.post("/order", payload);

      if (res.data.isValid) {
        toast.success(res.data.successMessage);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("navigateTable");
        navigate("/table-management");
      } else {
        toast.warning("Something went wrong during order placing");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error while placing order.");
    }

  };




  const filters = [
    { filterId: 1, filterName: "Today's Deal", filterIcon: < PiStarLight /> },
    { filterId: 2, filterName: "Special Offer", filterIcon: < PiStarLight /> },
    // { filterId: 3, filterName: "Chef Special", filterIcon: < LuChefHat /> },
    { filterId: 3, filterName: "Veg", filterIcon: <LuLeaf color='rgb(27, 203, 0)' /> },
    { filterId: 4, filterName: "Non Veg", filterIcon: <LuDrumstick color='rgb(255, 44, 44)' /> },
    { filterId: 5, filterName: "Beverage", filterIcon: <LuCupSoda /> },
    { filterId: 6, filterName: "Tobacco", filterIcon: <LuCigarette /> },
    // { filterId: 8, filterName: "Hard Beverage", filterIcon: <LuBeer /> },
    { filterId: 7, filterName: "Favourite", filterIcon: <FaHeart color='red' /> },
    { filterId: 8, filterName: "Best Seller", filterIcon: <LuBadgeCheck /> }
  ];



  const foodSubcategoryList = [
    {
      itemId: 1,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'All',
      subcategoryQuantity: 300,
    },
    {
      itemId: 2,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Desserts',
      subcategoryQuantity: 50,
    },
    {
      itemId: 3,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Drinks',
      subcategoryQuantity: 35,
    },
    {
      itemId: 4,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Hot & Spicy',
      subcategoryQuantity: 20,
    },
    {
      itemId: 5,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Snacks',
      subcategoryQuantity: 40,
    },
    {
      itemId: 6,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Meal Combos',
      subcategoryQuantity: 18,
    },
    {
      itemId: 7,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Chef Specials',
      subcategoryQuantity: 10,
    },
    {
      itemId: 8,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'Fast Food',
      subcategoryQuantity: 45,
    },
    {
      itemId: 9,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'World Cuisine',
      subcategoryQuantity: 28,
    },
    {
      itemId: 10,
      subcategoryIcon: <PiBowlFoodThin size={17} />,
      subcategoryName: 'World Cuisine',
      subcategoryQuantity: 35,
    },

  ];

  const [selectedSubcategory, setSelectedSubcategory] = useState(foodSubcategoryList[0].itemId);

  const calculateTotalItemPrice = (cartItem) => {
    const baseItemPrice = cartItem.prices?.[0]?.itemPrice || 0;
    const quantity = cartItem.quantity || 1;

    const compulsoryAddons = cartItem.addonItems?.items?.filter(a => a.isCompulsory) || [];
    const optionalAddons = cartItem.addonItems?.items?.filter(a => !a.isCompulsory) || [];

    const compulsoryPrice = compulsoryAddons.reduce(
      (sum, addon) => sum + (addon.itemPrice * (addon.itemQuantity || 1)),
      0
    );

    const optionalPrice = optionalAddons.reduce(
      (sum, addon) => sum + (addon.itemPrice * (addon.itemQuantity || 1)),
      0
    );
    return (baseItemPrice * quantity) + compulsoryPrice + optionalPrice;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + calculateTotalItemPrice(item);
  }, 0);

  const fetchItemAddon = async (item) => {
    try {
      const res = await api.get(`/itemaddon/${outletId}/${item.itemId}`);
      if (res.data?.isValid && res.data.data?.items) {
        setItemAddons(res.data.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditItem = (cartItem) => {
    setSelectedItem(cartItem);
    setSelectedSize(cartItem.prices[0]);
    setQuantity(cartItem.quantity);
    fetchItemAddon(cartItem);
    setEditingItemId(cartItem.itemId);
    const addons = {};
    cartItem.addonItems?.items?.forEach((addon) => {
      addons[addon.itemId] = {
        ...addon,
        selectedSize: {
          itemPriceId: addon.itemPriceId,
          itemPrice: addon.itemPrice,
          itemSizeId: addon.itemSizeId,
          itemSizeName: addon.itemSizeName,
        },
        quantity: addon.itemQuantity,
        isCompulsory: addon.isCompulsory,
      };
    });

    setSelectedAddons(addons);
  };

  const totalAddons = cartItems.reduce((total, item) => {
    return (
      total +
      (item.addonItems?.items?.reduce((sum, addon) => sum + (addon.itemQuantity || 0), 0) || 0)
    );
  }, 0);

  const calculateItemTax = (cartItem) => {
    const quantity = cartItem.quantity || 1;
    const itemBasePrice = cartItem.prices?.[0]?.itemPrice || 0;

    let totalTax = 0;

    const itemAmount = itemBasePrice * quantity;
    if (Array.isArray(cartItem.taxes)) {
      cartItem.taxes.forEach((tax) => {
        totalTax += (itemAmount * tax.taxRate) / 100;
      });
    }

    const addonItems = cartItem.addonItems?.items || [];
    addonItems.forEach((addon) => {
      const addonAmount = addon.itemPrice * (addon.itemQuantity || 1);
      if (Array.isArray(addon.taxes)) {
        addon.taxes.forEach((tax) => {
          totalTax += (addonAmount * tax.taxRate) / 100;
        });
      }
    });

    return totalTax;
  };

  const totalTax = cartItems.reduce((sum, item) => {
    return sum + calculateItemTax(item);
  }, 0);

  return (
    <>
      <ToastContainer />

      <div className='posScreenWrapper'>
        <Modal show={showPopup} onHide={() => {
          setShowPopup(false);
          setSelectedCustomer("");
        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Extra Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6 mb-3">

                  <InputGroup className="w-100">
                    <InputGroup.Text>
                      <GoPerson size={25} color="#ffc800" />
                    </InputGroup.Text>
                    <div style={{ flex: 1 }}>
                      <Select
                        classNamePrefix="react-select"
                        options={customers}
                        value={selectedCustomer}
                        onChange={handleChange}
                        isSearchable
                        placeholder="Customer name"
                      />
                    </div>
                  </InputGroup>


                </div>

                <div className="col-md-6 mb-3">
                  <InputGroup hasValidation className="">
                    <InputGroup.Text>
                      <CiMobile4 size={25} color='#ffc800' />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Mobile Number"
                      value={popupData.mobileNumber}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, mobileNumber: e.target.value }))
                      }

                    />
                  </InputGroup>

                </div>


                <div className="col-md-6 mb-3">
                  <InputGroup hasValidation className="">
                    <InputGroup.Text>
                      <PiArmchairLight size={25} color='#ffc800' />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Pax"
                      value={popupData.pax}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, pax: e.target.value }))
                      }

                    />
                  </InputGroup>

                </div>

                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <InputGroup hasValidation className="">
                      <InputGroup.Text id="">
                        <LuHandPlatter size={25} color="#ffc800" />
                      </InputGroup.Text>
                      <Form.Select

                        value={popupData.userName}
                        onChange={(e) =>
                          setPopupData((prev) => ({ ...prev, userName: e.target.value }))
                        }
                      >
                        <option value={userDetails.userID}>{userDetails.name}</option>

                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </div>

                <div className="col-md-12 mb-3">
                  <InputGroup hasValidation className="">

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter common remarks"
                      value={popupData.remarks}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, remarks: e.target.value }))
                      }

                    />
                  </InputGroup>

                </div>
              </div>
            </Form>
          </Modal.Body>


          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowPopup(false);
              placeOrder();
              setPopupData("");
            }}>
              Skip
            </Button>
            <Button variant="warning" onClick={() => {
              setShowPopup(false);
              placeOrder();
              setPopupData("");
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        {showAddonModalFor && (
          <Modal show onHide={() => setShowAddonModalFor(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Customize Add-ons</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {cartItems
                .find(item => item.itemId === showAddonModalFor)
                ?.addonItems?.items?.filter(a => !a.isCompulsory)
                .map((addon, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                    <div>+ {addon.itemName}</div>
                    <div className="d-flex align-items-center gap-2">
                      <span>₹{addon.itemPrice * (addon.itemQuantity || 1)}</span>
                      <div className="addonQtyBtns d-flex gap-1">
                        <button onClick={() => decreaseAddonQty(showAddonModalFor, addon.itemId)}>-</button>
                        <span>{addon.itemQuantity || 1}</span>
                        <button onClick={() => increaseAddonQty(showAddonModalFor, addon.itemId)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddonModalFor(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        <div className="subcategoryWrapperVerticle">
          <div></div>
          {subcategory.map((subcategory, index) => (
            <div
              key={index}
              className={`subcategoryItem ${selectedSubcategory === subcategory.itemSubCategoryID ? "selected" : ""}`}
              onClick={() => setSelectedSubcategory(subcategory.itemSubCategoryID)}
            >
              <div className='subcategoryIcon'>
                {/* {subcategory.subcategoryIcon} */}
              </div>
              <span className='subcategoryName'>{subcategory.itemSubCategoryName}</span>
            </div>
          ))}
        </div>

        <div className="posLeft itemsShowCase">

          <div className="posLeftTop">

            <div className="SearchItem shadow-sm">
              <div className="itemsSerarchIcon">
                <CiSearch size={20} />
              </div>
              <input

                type="text"
                placeholder='Search item/code'
              />
              <div className="TableSearch"><PiMicrophoneThin size={20} color="#ffc300" /></div>
            </div>
            <div className="filterItems">
              {filters.map((filterItem, index) => {
                return <div className='tableHeaderButton bg-white' key={index}>
                  <div className={`filterIcon`} >
                    {filterItem.filterIcon}
                  </div>
                  {filterItem.filterName}
                </div>
              })}
              <div className='filterIconsetting'><VscSettings size={21} /></div>
            </div>

          </div>

          <div className="posLeftBtm SearchandBtn">
            <div className="itemsListing">

              {item?.map((item) => {
                return (<div className="itemBox" key={item.itemId}>
                  <div className="imageWrapper d-flex align-items-center justify-content-center" onClick={async () => {
                    setSelectedItem(item);
                    const defaultSize = item.prices?.find(p => p.isDefaultSize);
                    setSelectedSize(defaultSize);
                    setQuantity(1);
                    await fetchItemAddon(item);
                    setSelectedAddons({});
                  }}>
                    {item.itemImage ? <img src={`${baseImgUrl}${item.itemImage}`} alt="" /> : <img src={`src/assets/food.png`} alt="" />}
                  </div>

                  <div className="itemDetailsWrapper">
                    <div className="itemName">
                      {item.itemName}
                    </div>
                    <div className="otherDetailsWrapper">
                      <div className={`isvegWrapper ${item.itemType === "Veg" ? "veg" : "Nonveg"}`}>
                        {item.itemType}
                      </div>
                      <div className="itemPrice">
                        {item.prices
                          ?.filter(price => price.isDefaultSize === true)
                          .map((price, i) => (
                            <div key={i}>
                              &#8377; {price.itemPrice}
                            </div>
                          ))}

                      </div>
                    </div>
                  </div>
                </div>)
              }

              )}

            </div>

            {selectedItem && (
              <div className="bottomPopup">
                <div className="popupHeader ">
                  <strong className='fs-4 mb-3'>{selectedItem.itemName}</strong>
                  <button onClick={() => setSelectedItem(null)} className="btn btn-light text-danger">×</button>
                </div>

                <div className="popupContent">

                  <div className="sizeOptions">
                    <h5 className='mb-2'>Item Sizes </h5>
                    <div className='d-flex justify-content-between w-100'>
                      <div>
                        {selectedItem.prices.map((price) => (
                          <label key={price.itemSizeId} className="d-block border px-2 py-1 rounded"
                            style={{ width: "fit-content" }}>
                            <input
                              type="radio"
                              name="size"

                              checked={selectedSize?.itemSizeId === price.itemSizeId}
                              onChange={() => setSelectedSize(price)}
                            />
                            {price.itemSizeName} - ₹{price.itemPrice}
                          </label>
                        ))}

                      </div>
                      <div className="quantitySelector d-flex align-items-center gap-3">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span>{quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>+</button>
                      </div>

                    </div>
                  </div>



                  {itemAddons.length > 0 && (
                    <div className="addonSection mt-3">
                      <h5 className='mb-3'>Add Extra </h5>

                      {itemAddons.map((addon) => {
                        const addonId = addon.itemId;
                        const isSelected = !!selectedAddons[addonId];
                        const defaultSize = addon.prices.find(p => p.isDefaultSize) || addon.prices[0];

                        return (
                          <div key={addonId} className="addonBox border rounded p-2 mb-2 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected || addon.isCompulsory}
                                  disabled={addon.isCompulsory}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;

                                    if (isChecked) {
                                      setSelectedAddons((prev) => ({
                                        ...prev,
                                        [addonId]: {
                                          ...addon,
                                          selectedSize: addon.prices.find(p => p.isDefaultSize) || addon.prices[0],
                                          quantity: 1,
                                        },
                                      }));
                                    } else {
                                      if (!addon.isCompulsory) {
                                        setSelectedAddons((prev) => {
                                          const newObj = { ...prev };
                                          delete newObj[addonId];
                                          return newObj;
                                        });
                                      }
                                    }
                                  }}

                                />
                                <strong>{addon.itemName}</strong>
                              </div>

                              {addon.isCompulsory && (
                                <span className="badge bg-danger text-white">Compulsory</span>
                              )}

                              {(isSelected || !addon.isCompulsory) && (
                                <>

                                  <div className="sizeOptions mt-2 d-flex gap-3 flex-wrap">
                                    {addon.prices.map((price) => (
                                      <label
                                        key={price.itemPriceId}
                                        className="border px-2 py-1 rounded"
                                        style={{ minWidth: '100px' }}
                                      >
                                        <input
                                          type="radio"
                                          name={`size-${addonId}`}
                                          className="me-1"
                                          checked={selectedAddons[addonId]?.selectedSize?.itemPriceId === price.itemPriceId}

                                          onChange={() =>
                                            setSelectedAddons((prev) => ({
                                              ...prev,
                                              [addonId]: {
                                                ...prev[addonId],
                                                selectedSize: price,
                                              },
                                            }))
                                          }
                                        />
                                        {price.itemSizeName} - ₹{price.itemPrice}
                                      </label>
                                    ))}
                                  </div>

                                  {/* Quantity + Price */}
                                  <div className="d-flex justify-content-between align-items-center gap-2">
                                    <div className="d-flex align-items-center gap-3">
                                      <span>Qty:</span>
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                          setSelectedAddons((prev) => ({
                                            ...prev,
                                            [addonId]: {
                                              ...prev[addonId],
                                              quantity: Math.max(1, prev[addonId].quantity - 1),
                                            },
                                          }))
                                        }
                                      >
                                        -
                                      </button>
                                      <span>{selectedAddons[addonId]?.quantity || 0}</span>
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                          setSelectedAddons((prev) => ({
                                            ...prev,
                                            [addonId]: {
                                              ...prev[addonId],
                                              quantity: prev[addonId].quantity + 1,
                                            },
                                          }))
                                        }
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="fw-semibold" style={{ color: "#ffc300" }}>
                                      ₹
                                      {(selectedAddons[addonId]?.selectedSize?.itemPrice || 0) *
                                        (selectedAddons[addonId]?.quantity || 1)}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>



                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div>
                    <textarea
                      className="form-control mt-3"
                      placeholder="Add remarks (optional)..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-warning mt-3 fw-bold text-white"
                    onClick={() => {
                      const addonItems = Object.values(selectedAddons).map((addon) => ({
                        itemId: addon.itemId,
                        itemName: addon.itemName,
                        itemPrice: addon.selectedSize.itemPrice,
                        itemSizeId: addon.selectedSize.itemSizeId,
                        itemSizeName: addon.selectedSize.itemSizeName,
                        itemQuantity: addon.quantity,
                        isCompulsory: addon.isCompulsory,
                        uomId: addon.uomID,
                        taxes: addon.taxes
                      }));

                      const cartItem = {
                        ...selectedItem,
                        prices: [selectedSize],
                        quantity,
                        remarks,
                        addonItems: {
                          items: addonItems,
                        },
                      };

                      if (editingItemId) {

                        setCartItems((prev) =>
                          prev.map((item) =>
                            item.itemId === editingItemId ? cartItem : item
                          )
                        );
                      } else {
                        addToCart(cartItem);
                      }

                      setSelectedItem(null);
                      setItemAddons([]);
                      setSelectedAddons({});
                      setEditingItemId(null);
                    }}
                  >
                    {editingItemId ? "Update item" : "Add item"} ₹ {(selectedSize?.itemPrice || 0) * quantity +
                      Object.values(selectedAddons).reduce(
                        (sum, addon) => sum + (addon.selectedSize?.itemPrice || 0) * (addon.quantity || 1),
                        0
                      )}
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

        <div className="posRight CardandBill shadow-sm">

          <div className="posCart shadow-sm">

            <div className="cartTop shadow-sm">
              <div className=''>Frisky Byte</div>

              <div className="tabelNameAndKot">
                <div onClick={() => navigate("/table-management")}>{navigateTable.tableName}</div>
                <div className='tabelDetails d-flex align-items-center gap-2'><div className='tableRunningTime'>44 Minutes</div>
                  <div className='pax d-flex align-items-center gap-1'><IoPersonOutline color='#ffc300' size={11} />{navigateTable.capacity}</div></div>
              </div>
              <div className="">
                Offer Aplied
              </div>
            </div>

            <div className="cartMiddle shadow-sm">
              <div className='features d-flex align-items-center justify-content-between w-100'>
                <div className="orderTakerDropDown">
                  {userDetails.name}  <div className='DropDownIcon'><RiArrowDownSFill /></div>
                </div>

                <div className="AnBUtton">
                  <BsRepeat style={{ color: "grey" }} size={14} /> Repeat
                </div>
                <div className="AnBUtton">
                  <GoHistory style={{ color: "grey" }} size={14} /> History
                </div>
                <div className="AnBUtton">
                  <RxValueNone style={{ color: "grey" }} size={14} /> AN
                </div>
              </div>
              <div className='cartDetails d-flex align-items-center justify-content-between w-100 py-1 px-2'>
                <div className='cartDetailsItem d-flex align-items-center justify-content-start gap-1'><span className='text-warning'>{cartItems.length}</span> Items</div>
                <div className='cartDetailsItem d-flex align-items-center justify-content-center gap-1'><span className='text-warning'>{totalQty}</span> Quantity</div>
                <div className='cartDetailsItem d-flex align-items-center justify-content-end gap-1'><span className='text-warning'>{totalAddons}</span> Add ons</div>
              </div>
            </div>

            <div className="cartBtm shadow-sm">
              {
                cartItems.length === 0 ? (
                  <p className='d-flex align-items-center justify-content-center fs-3 fw-bold h-100 w-100 text-warning'>Cart is empty</p>
                ) : (
                  cartItems.map((cartItem, index) => {
                    return <div className='cartItemFull' key={index}>
                      <div className="cartItemImg d-flex align-items-center justify-content-center" onClick={() => removeFromCart(cartItem.itemId)}>
                        {cartItem.itemImage ? <img src={`${baseImgUrl}${cartItem.itemImage}`} alt="" /> : <img src={`src/assets/food.png`} alt="" />}

                      </div>
                      <div className="rightCartItemDetails">
                        <div className="cartItemNameAndNote">
                          <div style={{ letterSpacing: "-0.04rem" }}>
                            {cartItem.itemName}
                          </div>
                          <div className='d-flex align-items-center gap-3'>
                            {cartItem.remarks && (
                              <div style={{ borderRadius: "1rem", fontSize: "0.85rem", padding: "0rem 0.5rem", border: "0.01rem solid #e0e0e0", fontWeight: "400" }}>{cartItem.remarks}</div>

                            )}
                            <div onClick={() => removeFromCart(cartItem.itemId)}>

                              <MdOutlineCancelPresentation color='red' size={23} />
                            </div>
                          </div>


                        </div>



                        <div className="cartItemPriceamdsize">
                          <div className='prizeAndSize'>
                            <div className="cartItemPrice" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>

                              &#8377; {cartItem.prices[0].itemPrice}
                            </div>

                            <div className='d-flex gap-2 align-items-center'>
                              <div style={{ fontSize: "0.95rem" }}>Size: </div>
                              <div className="cartSize">
                                {cartItem.prices[0].itemSizeName}
                              </div>
                            </div>


                            <div className="cartQuantityContainer">
                              <div className="plusBtnDecrease" onClick={() => decreaseQuantity(cartItem.itemId)}>-</div>

                              <div className="plusBtnIncrese" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>{cartItem.quantity}</div>

                              <div className="plusBtnIncrease" onClick={() => increaseQuantity(cartItem.itemId)}>+</div>
                            </div>

                          </div>


                        </div>

                        <div className="cartQuantityBtns">


                          {cartItem.addonItems?.items?.length > 0 && (
                            <div className="addonItemList mt-2">
                              {cartItem.addonItems.items.map((addon, i) => (
                                <div key={i} style={{ fontSize: "0.75rem", cursor: 'pointer' }} onClick={() => handleEditItem(cartItem)}
                                  className="addonItem text-muted gap-2 d-flex justify-content-between">
                                  <div>
                                    + {addon.itemName} ( {addon.itemSizeName} ) x {addon.itemQuantity}
                                  </div>
                                  <div>₹{addon.itemPrice * addon.itemQuantity}</div>
                                </div>
                              ))}
                            </div>
                          )}


                        </div>
                      </div>
                    </div>
                  })
                )
              }
            </div>

          </div>

          <div className="posBill">
            <div className="billWrapper">
              <div className="billRow">
                <div>Subtotal</div>
                <div className='text-warning'>&#8377;{subtotal}</div>
              </div>
              <div className="billRow taxRow"
                onMouseEnter={() => SetHover("tax")}
                onMouseLeave={() => SetHover(null)}
              >
                <div>Total Tax</div>
                <div>&#8377; {totalTax}</div>
              </div>

              {/* {hover === "tax" && (
                <div className='subRowWrapper'>
                  <div className='subRow'>IGST</div>
                  <div className='subRow'>CGST</div>
                  <div className='subRow'>SGST</div>
                </div>
              )}

              <div
                onMouseEnter={() => SetHover("discount")}
                onMouseLeave={() => SetHover(null)}
                className="billRow discountRow"
              >
                <div>Discount</div>
                <div>&#8377; 500</div>
              </div>

              {hover === "discount" && (
                <div className='subRowWrapper'>
                  <div className='subRow'>Sesional Discount</div>
                  <div className='subRow'>Coupon Discount</div>
                  <div className='subRow'>Referral Discount</div>
                </div>
              )} */}
              {/* <div className="billRow">
                <div>Total</div>
                <div className='text-warning'>&#8377;100</div>
              </div>
              <div className="billRow">
                <div>Advance</div>
                <div className='text-warning'>&#8377;500</div>
              </div> */}
              <div className="billRow">
                <div>Net Amount</div>
                <div className='text-warning'>&#8377;{subtotal + totalTax}</div>
              </div>

            </div>

            <div className='d-flex w-100 justify-content-center gap-2'>
              <div className="btn btn-warning" onClick={handlePlaceOrder}>
                Placed Order
              </div>
              <button type="button" className="btn btn-outline-warning">Hold</button>
            </div>
          </div>

        </div>

      </div>

    </>
  )
}

export default PosScreen;

