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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import { PiNotePencilThin } from "react-icons/pi";
>>>>>>> 68a08561502c7800cb795698f2ffb1011814928d
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
import { PiPencilSimpleThin } from "react-icons/pi";
import { RxValueNone } from "react-icons/rx";
import api from '../../../config/AxiosInterceptor';
import "src/views/pages/pos/Pos.css"
import { PiStarLight } from "react-icons/pi";
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
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
<<<<<<< HEAD
=======

const PosScreen = () => {
  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
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

  const fetchAddonData = async (itemId)=>{

    try {
      const res = api.get(`/itemaddon/parent/${itemId}`)
      console.log(res);
      
    } catch (error) {
      console.log(error);
      
    }

  };

  const handlePlaceOrder = () => {
    if (navigateTable.prefix === "V") {
      setShowPopup(true);
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

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.prices?.[0]?.itemPrice || 0;
    return sum + (item.quantity * price);
  }, 0);


  const filters = [
    { filterId: 1, filterName: "Today's Deal", filterIcon: < PiStarLight /> },
    { filterId: 2, filterName: "Special Offer", filterIcon: < PiStarLight /> },
    { filterId: 3, filterName: "Chef Special", filterIcon: < LuChefHat /> },
    { filterId: 4, filterName: "Veg", filterIcon: <LuLeaf /> },
    { filterId: 5, filterName: "Non Veg", filterIcon: <LuDrumstick /> },
    { filterId: 6, filterName: "Soft Beverage", filterIcon: <LuCupSoda /> },
    { filterId: 7, filterName: "Tobacco", filterIcon: <LuCigarette /> },
    { filterId: 8, filterName: "Hard Beverage", filterIcon: <LuBeer /> },
    { filterId: 9, filterName: "Favourite", filterIcon: <LuHeart /> },
    { filterId: 10, filterName: "Best Seller", filterIcon: <LuBadgeCheck /> }
  ];

  const foodItems = [
    {
      id: 1,
      itemName: 'Margherita Pizza',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 299,
    },
    {
      id: 2,
      itemName: 'Pepperoni Pizza',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 349,
    },
    {
      id: 3,
      itemName: 'Paneer Tikka',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 250,
    },
    {
      id: 4,
      itemName: 'Chicken Biryani',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 320,
    },
    {
      id: 5,
      itemName: 'Veg Burger',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 180,
    },
    {
      id: 6,
      itemName: 'Chicken Burger',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 220,
    },
    {
      id: 7,
      itemName: 'Masala Dosa',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 150,
    },

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


  return (
    <>
      <ToastContainer />

      <div className='posScreenWrapper'>
        <Modal show={showPopup} onHide={() => {
          setShowPopup(false);

        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Extra Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6 mb-3">

                  <InputGroup hasValidation className="">
                    <InputGroup.Text>
                      <GoPerson size={25} color='#ffc800' />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Customer Name"
                      value={popupData.input1}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, input1: e.target.value }))
                      }

                    />
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


          <div className="posLeftTop SearchandBtn">

            {/* <div className="SearchItem shadow-sm">
=======
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9

const PosScreen = () => {
  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
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

  const fetchAddonData = async (itemId)=>{

    try {
      const res = api.get(`/itemaddon/parent/${itemId}`)
      console.log(res);
      
    } catch (error) {
      console.log(error);
      
    }

  };

  const handlePlaceOrder = () => {
    if (navigateTable.prefix === "V") {
      setShowPopup(true);
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

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.prices?.[0]?.itemPrice || 0;
    return sum + (item.quantity * price);
  }, 0);


  const filters = [
    { filterId: 1, filterName: "Today's Deal", filterIcon: < PiStarLight /> },
    { filterId: 2, filterName: "Special Offer", filterIcon: < PiStarLight /> },
    { filterId: 3, filterName: "Chef Special", filterIcon: < LuChefHat /> },
    { filterId: 4, filterName: "Veg", filterIcon: <LuLeaf /> },
    { filterId: 5, filterName: "Non Veg", filterIcon: <LuDrumstick /> },
    { filterId: 6, filterName: "Soft Beverage", filterIcon: <LuCupSoda /> },
    { filterId: 7, filterName: "Tobacco", filterIcon: <LuCigarette /> },
    { filterId: 8, filterName: "Hard Beverage", filterIcon: <LuBeer /> },
    { filterId: 9, filterName: "Favourite", filterIcon: <LuHeart /> },
    { filterId: 10, filterName: "Best Seller", filterIcon: <LuBadgeCheck /> }
  ];

  const foodItems = [
    {
      id: 1,
      itemName: 'Margherita Pizza',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 299,
    },
    {
      id: 2,
      itemName: 'Pepperoni Pizza',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 349,
    },
    {
      id: 3,
      itemName: 'Paneer Tikka',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 250,
    },
    {
      id: 4,
      itemName: 'Chicken Biryani',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 320,
    },
    {
      id: 5,
      itemName: 'Veg Burger',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 180,
    },
    {
      id: 6,
      itemName: 'Chicken Burger',
      img: "src/assets/dimsum.jpeg",
      isVeg: false,
      itemType: "Nonveg",
      itemPrice: 220,
    },
    {
      id: 7,
      itemName: 'Masala Dosa',
      img: "src/assets/dimsum.jpeg",
      isVeg: true,
      itemType: "veg",
      itemPrice: 150,
    },

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


  return (
    <>
      <ToastContainer />

      <div className='posScreenWrapper'>
        <Modal show={showPopup} onHide={() => {
          setShowPopup(false);

        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Extra Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6 mb-3">

                  <InputGroup hasValidation className="">
                    <InputGroup.Text>
                      <GoPerson size={25} color='#ffc800' />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Customer Name"
                      value={popupData.input1}
                      onChange={(e) =>
                        setPopupData((prev) => ({ ...prev, input1: e.target.value }))
                      }

                    />
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

<<<<<<< HEAD

          <div className="posLeftTop SearchandBtn">

            {/* <div className="SearchItem shadow-sm">
=======
          {/* <div className="SearchItem shadow-sm">
>>>>>>> 68a08561502c7800cb795698f2ffb1011814928d
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
            <div className="itemsSerarchIcon">
              <CiSearch size={20} />
            </div>
            <input

              type="text"
              placeholder='Search......'
            />
          </div> */}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
            <div className="filterItems">
              {filters.map((filterItem, index) => {
                return <div className='tableHeaderButton bg-white' key={index}>
                  <div className="filterIcon">
                    {filterItem.filterIcon}
                  </div>
                  {filterItem.filterName}
<<<<<<< HEAD
                </div>
              })}
              <div className='filterIconsetting'><VscSettings size={21} /></div>
=======
                </div>
              })}
              <div className='filterIconsetting'><VscSettings size={21} /></div>
            </div>

          </div>

          <div className="posLeftMiddle SearchandBtn">

            <div className="SearchItem shadow-sm">
              <div className="itemsSerarchIcon">
                <CiSearch size={20} />
              </div>
              <input

                type="text"
                placeholder='Search......'
              />
            </div>



          </div>

          <div className="posLeftBtm SearchandBtn">
            <div className="itemsListing">
              {item?.map((item, index) => {
                return (<div className="itemBox shadow-sm" key={item.itemId}>
                  <div className="imageWrapper d-flex align-items-center justify-content-center" onClick={() => {
                    addToCart(item);
                    fetchAddonData(item.itemId);
                  }}>
                    {item.itemImage ? <img src={`${baseImgUrl}${item.itemImage}`} alt="" /> : <MdOutlineFastfood size={50} color='#ffc300' />}

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
=======
          <div className="filterItems">
            {filters.map((filterItem, index) => {
              return <div className='tableHeaderButton bg-white' key={index}>
                <div className="filterIcon">
                  {filterItem.filterIcon}
                </div>
                {filterItem.filterName}
              </div>
            })}
>>>>>>> 68a08561502c7800cb795698f2ffb1011814928d
          </div>

        </div>

<<<<<<< HEAD
        <div className="posRight CardandBill shadow-sm">

          <div className="posCart shadow-sm">

            <div className="cartTop shadow-sm">
              <div className=''>Frisky Byte</div>
              {/* <div className=" circleIcon">
              <PiNotePencilThin />
            </div> */}
              <div className="tabelNameAndKot">
                <div>{navigateTable.tableName}</div>
                <div className='tabelDetails d-flex align-items-center gap-2'><div className='tableRunningTime'>44 Minutes</div>
                  <div className='pax d-flex align-items-center gap-1'><IoPersonOutline color='#ffc300' size={11} />{navigateTable.capacity}</div></div>
              </div>
              <div className=" ">
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
                        {cartItem.itemImage ? <img src={`${baseImgUrl}${cartItem.itemImage}`} alt="" /> : <MdOutlineFastfood size={50} color='#ffc300' />}

                      </div>
                      <div className="rightCartItemDetails">
                        <div className="cartItemNameAndNote">
                          {cartItem.itemName}
                          <div className=" circleIcon">
                            <PiPencilSimpleThin size={13} />
                          </div>
                        </div>
                        <div className="cartItemPriceamdsize">
                          <div className='prizeAndSize'>
                            <div className="cartItemPrice" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>
                              {cartItem.prices?.map((price, i) => (
                                <div key={i}>
                                  &#8377; {cartItem.quantity * price.itemPrice}
                                </div>
                              ))}
                            </div>

                          </div>
                          <div className="addonItem">
                            <div>Extra Chessse</div>
                            <div>Extra Chessse</div>
                          </div>
                        </div>

                        <div className="cartQuantityBtns">
                          <div className="cartSize">
                            {cartItem.prices?.map((price, i) => (
                              <div key={i}>
                                &#8377; {price.itemSizeName}
                              </div>
                            ))}
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
                <div>500</div>
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
                <div>500</div>
              </div>

              {hover === "discount" && (
                <div className='subRowWrapper'>
                  <div className='subRow'>Sesional Discount</div>
                  <div className='subRow'>Coupon Discount</div>
                  <div className='subRow'>Referral Discount</div>
                </div>
              )}
            </div>


            <div className="btn btn-warning" onClick={handlePlaceOrder}>
              Order Placed
            </div>
          </div>

=======
        <div className="posLeftMiddle SearchandBtn">

          <div className="SearchItem shadow-sm">
            <div className="itemsSerarchIcon">
              <CiSearch size={20} />
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
            </div>

          </div>

          <div className="posLeftMiddle SearchandBtn">

            <div className="SearchItem shadow-sm">
              <div className="itemsSerarchIcon">
                <CiSearch size={20} />
              </div>
              <input

                type="text"
                placeholder='Search......'
              />
            </div>



          </div>

          <div className="posLeftBtm SearchandBtn">
            <div className="itemsListing">
              {item?.map((item, index) => {
                return (<div className="itemBox shadow-sm" key={item.itemId}>
                  <div className="imageWrapper d-flex align-items-center justify-content-center" onClick={() => {
                    addToCart(item);
                    fetchAddonData(item.itemId);
                  }}>
                    {item.itemImage ? <img src={`${baseImgUrl}${item.itemImage}`} alt="" /> : <MdOutlineFastfood size={50} color='#ffc300' />}

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
                <div>{navigateTable.tableName}</div>
                <div className='tabelDetails d-flex align-items-center gap-2'><div className='tableRunningTime'>44 Minutes</div>
                  <div className='pax d-flex align-items-center gap-1'><IoPersonOutline color='#ffc300' size={11} />{navigateTable.capacity}</div></div>
              </div>
              <div className=" ">
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
                        {cartItem.itemImage ? <img src={`${baseImgUrl}${cartItem.itemImage}`} alt="" /> : <MdOutlineFastfood size={50} color='#ffc300' />}

                      </div>
                      <div className="rightCartItemDetails">
                        <div className="cartItemNameAndNote">
                          {cartItem.itemName}
                          <div className=" circleIcon">
                            <PiPencilSimpleThin size={13} />
                          </div>
                        </div>
                        <div className="cartItemPriceamdsize">
                          <div className='prizeAndSize'>
                            <div className="cartItemPrice" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>
                              {cartItem.prices?.map((price, i) => (
                                <div key={i}>
                                  &#8377; {cartItem.quantity * price.itemPrice}
                                </div>
                              ))}
                            </div>

                          </div>
                          <div className="addonItem">
                            <div>Extra Chessse</div>
                            <div>Extra Chessse</div>
                          </div>
                        </div>

                        <div className="cartQuantityBtns">
                          <div className="cartSize">
                            {cartItem.prices?.map((price, i) => (
                              <div key={i}>
                                &#8377; {price.itemSizeName}
                              </div>
                            ))}
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
                <div>500</div>
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
                <div>500</div>
              </div>

              {hover === "discount" && (
                <div className='subRowWrapper'>
                  <div className='subRow'>Sesional Discount</div>
                  <div className='subRow'>Coupon Discount</div>
                  <div className='subRow'>Referral Discount</div>
                </div>
              )}
            </div>


            <div className="btn btn-warning" onClick={handlePlaceOrder}>
              Order Placed
            </div>
          </div>

<<<<<<< HEAD
=======

          <div className="billBtn">
            Order Placed
          </div>
>>>>>>> 68a08561502c7800cb795698f2ffb1011814928d
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
        </div>

      </div>

<<<<<<< HEAD
    </>
=======
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> 68a08561502c7800cb795698f2ffb1011814928d
>>>>>>> 70332d634caef1d128b672c9a859c249f42007b9
  )
}

export default PosScreen;

