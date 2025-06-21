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
import { PiPencilSimpleThin } from "react-icons/pi";
import { RxValueNone } from "react-icons/rx";
import api from '../../../config/AxiosInterceptor';
import "src/views/pages/pos/Pos.css"
import { PiStarLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { useGeneralContext } from '../../../Context/GeneralContext';
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
import { MdOutlineFastfood } from "react-icons/md";
import Select from 'react-select';
import { LiaWindowCloseSolid } from "react-icons/lia";
import { PiMicrophoneThin } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";

const PosScreen = () => {

  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, increaseAddonQty, decreaseAddonQty, updateRemarks } = useCart();
  const navigateTable = JSON.parse(localStorage.getItem("navigateTable") || "[]");
  const fetchCalled = useRef(false);
  const [item, setItem] = useState(null);
  const [subcategory, setSubcategory] = useState([]);
  const [hover, SetHover] = useState(null);
  // const outletId = localStorage.getItem("outletId");
  const baseImgUrl = import.meta.env.VITE_IMG_BASE_URL;
  const authChannelStr = localStorage.getItem("authChannels");
  const authChannels = JSON.parse(authChannelStr);
  const userDetails = authChannels[0]?.adminDetails;
  const userId = userDetails?.userID || "";
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    selectOption: '',
    input1: '',
    input2: '',
    input3: '',
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

  console.log(cartItems);
  

  const useOutsideClick = (callback) => {
    const ref = useRef();

    useEffect(() => {
      const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [ref]);

    return ref;
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchItemsData();
    fetchSubcategory();
  }, []);

  const fetchItemsData = async () => {
    try {
      // const res = await api.get(`/items/outlet/${outletId}`);
      const res = await api.get(`/items/outlet/a546dd1d-9963-47e4-aa92-47ee1d2770f1`);
      setItem(res.data.list);
    } catch (error) {
      console.error("Error fetching Items data", error);
    }
  };

  const fetchSubcategory = async () => {
    try {
      const res = await api.get(`/itemsubcategory/outlet/a546dd1d-9963-47e4-aa92-47ee1d2770f1`);
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
    console.log("Selected customer:", selected);
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

    const payload = {
      outletId: "a546dd1d-9963-47e4-aa92-47ee1d2770f1",
      tableID: navigateTable.tableId,
      kotNumber: null,
      pax: navigateTable.capacity || 1,
      terminalID: null,
      orderType: "Dine in",
      orderDate: new Date().toISOString(),
      orderTaker: userId,
      orderRemarks: null,
      isActive: true,
      orderDetailsList: cartItems.map((item, index) => {
        const matchedPrice = item.prices?.find(
          (price) =>
            price.outletId === "a546dd1d-9963-47e4-aa92-47ee1d2770f1"
        );
        const rate = matchedPrice?.itemPrice || 0;
        return {
          orderID: null,
          serial: index + 1,
          itemId: item.itemId,
          itemRemarks: item.itemRemarks || '',
          qty: item.quantity,
          uomId: item.uomID || '',
          sizeId: matchedPrice?.itemSizeId || '',
          rate: rate,
          offerID: item.offerID || '',
          isPrint: item.isPrint ?? true,
          isNonChargeable: item.isNonChargeable ?? true,
          total: rate * item.quantity,
          isActive: true
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
        navigate("/table-reservations");
      } else {
        toast.warning("Something went wrong during order placing");
      }
    } catch (error) {
      console.log(error);
    }

  }



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
    const baseItemPrice = cartItem.prices?.reduce((sum, price) => sum + price.itemPrice, 0) || 0;
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

    return (baseItemPrice + compulsoryPrice + optionalPrice) * quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + calculateTotalItemPrice(item);
  }, 0);


  const addtoCart = async (item) => {
    try {
      const res = await api.get(`/itemaddon/parent/${item.itemId}`)
      addToCart(item, res.data.data);
      setAddonItem();
    } catch (error) {
      console.log(error);
    }
  };


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
                      value={popupData.input2}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, input2: e.target.value }))
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
                      value={popupData.input3}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, input3: e.target.value }))
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

                        value={popupData.selectOption}
                        onChange={(e) =>
                          setPopupData((prev) => ({ ...prev, selectOption: e.target.value }))
                        }
                      >
                        <option value="">Choose...</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
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
            }}>
              Skip
            </Button>
            <Button variant="warning" onClick={() => {
              setShowPopup(false);
              placeOrder();
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
                  <div className="imageWrapper d-flex align-items-center justify-content-center" onClick={() => {
                    setSelectedItem(item);
                    const defaultSize = item.prices?.find(p => p.isDefaultSize);
                    setSelectedSize(defaultSize);
                    setQuantity(1);
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
                        {item.prices?.map((price, i) => (
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
                <div className="popupHeader">
                  <strong>{selectedItem.itemName}</strong>
                  <button onClick={() => setSelectedItem(null)}  className="btn btn-light">×</button>
                </div>

                <div className="popupContent">
                  <div className="sizeOptions">
                    {selectedItem.prices.map((price) => (
                      <label key={price.itemSizeId} className="d-block">
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

                  <div className="quantitySelector d-flex align-items-center gap-2 mt-3">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                  </div>

                  <div className="totalPrice mt-3">
                    Total: ₹{(selectedSize?.itemPrice || 0) * quantity}
                  </div>

                  <button
                    className="btn btn-warning mt-3"
                    onClick={() => {
                      const cartItem = {
                        ...selectedItem,
                        prices: [selectedSize],
                        quantity,
                      };
                      addToCart(cartItem);
                      setSelectedItem(null);
                    }}
                  >
                    Add to Cart
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
              {/* <div className=" circleIcon">
              <PiNotePencilThin />
            </div> */}
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
                  Rahul  <div className='DropDownIcon'><RiArrowDownSFill /></div>
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
                <div className='cartDetailsItem d-flex align-items-center justify-content-end gap-1'><span className='text-warning'>{3}</span> Add ons</div>
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
                      <div className="rightCartItemDetails position-relative">
                        <div className="cartItemNameAndNote">
                          {cartItem.itemName}
                          <div
                            className="remarks circleIcon"
                            onClick={() =>
                              setOpenRemarksFor((prev) =>
                                prev === cartItem.itemId ? null : cartItem.itemId
                              )
                            }
                          >
                            <PiPencilSimpleThin size={13} />
                          </div>

                          {openRemarksFor === cartItem.itemId && (
                            <div
                              className="remarksBoxWrapper"
                              ref={useOutsideClick(() => setOpenRemarksFor(null))}
                            >
                              <textarea
                                className="remarksTextarea form-control"
                                value={cartItem.remarks || ""}
                                onChange={(e) => updateRemarks(cartItem.itemId, e.target.value)}
                                placeholder="Add your note..."
                                autoFocus
                              />
                            </div>
                          )}

                        </div>
                        {/* <div className='d-flex gap-2'>
                          {cartItem.addonItems?.items?.filter(a => a.isCompulsory).map((addon, i) => (
                            <div className="compulsoryAddonName text-muted " style={{ fontSize: "0.7vw" }} key={i}>
                              + {addon.itemName}
                            </div>
                          ))}

                        </div> */}


                        <div className="cartItemPriceamdsize">
                          <div className='prizeAndSize'>
                            <div className="cartItemPrice" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>
                              {/* {cartItem.prices?.map((price, i) => (
                                <div key={i}>
                                  &#8377; {calculateTotalItemPrice(cartItem)}
                                </div>
                              ))} */}
                              {/* &#8377; {calculateTotalItemPrice(cartItem)} */}
                              &#8377; {cartItem.prices[0].itemPrice}
                            </div>

                          </div>
                          {/* <div className="addonItem">
                            <div>Extra Chessse</div>
                            <div>Extra Chessse</div>
                          </div> */}
                          {/*
                        <div className="addonItem">
                            {cartItem.addonItems?.items?.filter(a => !a.isCompulsory).length > 1 ? (
                              <button
                                className="btn btn-sm"
                                onClick={() => setShowAddonModalFor(cartItem.itemId)}
                              >
                                View Addons
                              </button>
                            ) : (
                              cartItem.addonItems?.items?.filter(a => !a.isCompulsory).map((addon, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                                  <div>+ {addon.itemName}</div>
                                  <div className="d-flex align-items-center gap-2">
                                    <span>₹{addon.itemPrice * (addon.itemQuantity || 1)}</span>
                                    <div className="addonQtyBtns d-flex gap-1">
                                      <button onClick={() => decreaseAddonQty(cartItem.itemId, addon.itemId)}>-</button>
                                      <span>{addon.itemQuantity || 1}</span>
                                      <button onClick={() => increaseAddonQty(cartItem.itemId, addon.itemId)}>+</button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                       */}


                        </div>

                        <div className="cartQuantityBtns">
                          <div className="cartSize">
                            {/* {cartItem.prices?.map((price, i) => (
                              <div key={i}>
                                {price.itemSizeName}
                              </div>
                            ))} */}
                        {    cartItem.prices[0].itemSizeName}
                          </div>
                          <div className="cartQuantityContainer">
                            <div className="plusBtnDecrease" onClick={() => decreaseQuantity(cartItem.itemId)}>-</div>

                            <div className="plusBtnIncrese" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>{cartItem.quantity}</div>

                            <div className="plusBtnIncrease" onClick={() => increaseQuantity(cartItem.itemId)}>+</div>
                          </div>
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
              <div
                onMouseEnter={() => SetHover("tax")}
                onMouseLeave={() => SetHover(null)}
                className="billRow taxRow"
              >
                <div>Tax</div>
                <div>&#8377; 500</div>
              </div>

              {hover === "tax" && (
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
              )}
              <div className="billRow">
                <div>Total</div>
                <div className='text-warning'>&#8377;100</div>
              </div>
              <div className="billRow">
                <div>Advance</div>
                <div className='text-warning'>&#8377;500</div>
              </div>
              <div className="billRow">
                <div>Net</div>
                <div className='text-warning'>&#8377;1000</div>
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

