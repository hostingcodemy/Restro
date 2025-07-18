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
import CreatableSelect from 'react-select/creatable';
import { PiMicrophoneThin } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import Select from 'react-select';
import { COffcanvas, COffcanvasBody, COffcanvasHeader } from '@coreui/react'
import { IoFastFoodOutline } from "react-icons/io5";
import { useGeneralContext } from '../../../Context/GeneralContext';
import { TbRosetteDiscountCheck } from "react-icons/tb";
import DiscountPanel from './DiscountPanel';

const PosScreen = () => {

  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, increaseAddonQty, decreaseAddonQty, updateRemarks, setCartItems, loadKotItems, confirmKot } = useCart();
  const { normalize } = useGeneralContext();
  const navigateTable = JSON.parse(localStorage.getItem("navigateTable") || "[]");
  const authChannelStr = localStorage.getItem("authChannels");
  const outletId = localStorage.getItem("currentOutletId");
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const authChannel = JSON.parse(localStorage.getItem("authChannels"));
  const currentOutletId = localStorage.getItem("currentOutletId");
  const [searchItem, setSearchItem] = useState("");
  const fetchCalled = useRef(false);
  const [item, setItem] = useState(null);
  const [subcategory, setSubcategory] = useState([]);
  const [hover, SetHover] = useState(null);
  const baseImgUrl = import.meta.env.VITE_IMG_BASE_URL;
  const authChannels = JSON.parse(authChannelStr);
  const userDetails = authChannels[0]?.adminDetails;
  const userId = userDetails?.userID || "";
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    userName: '',
    mobileNumber: '',
    pax: navigateTable.capacity,
    remarks: '',
    isEstimated: false,
    isDefault: true
  });
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddonModalFor, setShowAddonModalFor] = useState(null);
  const [showTaxBreakup, setShowTaxBreakup] = useState(false);
  const [taxBreakup, setTaxBreakup] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [itemAddons, setItemAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [isZeroPrice, setIsZeroPrice] = useState(false);
  const [nonChargeableRemark, setNonChargeableRemark] = useState("");
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [allNonChargableRemarks, setAllNonChargableRemarks] = useState("");
  const [itemZeroPrices, setItemZeroPrices] = useState({});
  const [itemRemarkPopup, setItemRemarkPopup] = useState(null);
  const [itemRemarkInput, setItemRemarkInput] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroupId, setSelectedSubgroupId] = useState(null);
  const [selectedSubgroupName, setSelectedSubgroupName] = useState("");
  const [itemCodeNumber, setItemCodeNumber] = useState("");
  const [itemSize, setItemSize] = useState([]);
  const [selectedItemSize, setSelectedItemSize] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    quantity: 1,
    TaxAfterDiscount: "",
    selectedTaxes: []
  });
  const [taxOptions, setTaxOptions] = useState([]);
  const [kotLoaded, setKotLoaded] = useState(false);
  const [openType, setOpenType] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const itemCode = `O${selectedSubgroupName.charAt(0).toUpperCase()}${itemCodeNumber}`;
  const itemTypes = [
    { value: "Veg", label: "Veg" },
    { value: "NonVeg", label: "Non-Veg" },
    { value: "Jain", label: "Jain" },
  ];
  const [showAddonPanel, setShowAddonPanel] = useState(false);
  const [selectedAddonss, setSelectedAddonss] = useState([]);
  const [addonSearch, setAddonSearch] = useState("");
  const [itemNameExists, setItemNameExists] = useState(false);
  const [isCompulsory, setIsCompulsury] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [Offers, setOffers] = useState([]);
  const offers = [
    {
      id: 1,
      name: "Buy 1 Get 1 Free",
      details: "Applicable on all cold beverages.",
      items: ["Pepsi", "Coke", "Sprite"],
    },
    {
      id: 2,
      name: "Flat 20% Off",
      details: "Only for dine-in orders above ₹500.",
      items: ["Burger", "Fries"],
    },
    {
      id: 3,
      name: "Combo Meal Offer",
      details: "Combo of Pizza + Drink for ₹299",
      items: ["Margherita Pizza", "Soft Drink"],
    },
  ];

  let result = null;

  for (const channel of authChannel) {
    const matchedOutlet = channel.channelOutlets.find(outlet => outlet.outletID === currentOutletId);
    if (matchedOutlet) {
      result = {
        outletID: matchedOutlet.outletID,
        outletName: matchedOutlet.outletName,
        channelId: channel.channelId,
        channelName: channel.channelName
      };
      break;
    }
  }

  useEffect(() => {
    if (navigateTable?.prefix === "O") {
      loadKotItems(navigateTable.runningOrder, navigateTable.tableId);
      setKotLoaded(true);
    }
  }, [navigateTable?.tableId]);

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchItemsData();
    fetchSubcategory();
    fetchSubGroup();
    fetchItemSize();
    fetchOpenType();
  }, []);

  useEffect(() => {
    fetchTax();
  }, [selectedSubgroupId, outletId]);

  const kotGroups = cartItems.reduce((acc, item) => {
    const kot = item.kotNumber || "custom";
    if (!acc[kot]) acc[kot] = [];
    acc[kot].push(item);
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "itemName") {
      newValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

      const exists = item.some(
        i => i.itemName?.trim().toLowerCase() === newValue.trim().toLowerCase()
      );
      setItemNameExists(exists);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  useEffect(() => {
    if (itemNameExists) {
      toast.error("Item name already exists!");
    }
  }, [itemNameExists]);



  const handleTaxChange = (selected) => {
    setFormData(prev => ({ ...prev, selectedTaxes: selected }));
  };

  const fetchTax = async () => {
    try {
      const res = await api.get(`outletsubgrouptax/${outletId}/${selectedSubgroupId}`);
      const list = res.data.list || [];

      if (list.length > 0) {
        const taxList = list[0].taxes || [];

        const formattedTaxes = taxList.map(tax => ({
          value: tax.taxID,
          label: tax.taxName
        }));

        setTaxOptions(formattedTaxes);
      } else {
        setTaxOptions([]);
      }

    } catch (error) {
      console.error(error);
      setTaxOptions([]);
    }
  };

  const getTaxBreakup = () => {
    const taxMap = {};

    cartItems.forEach(item => {
      const isItemFree = isZeroPrice || itemZeroPrices?.[item.itemId]?.isFree;
      const quantity = item.quantity || 1;
      const itemBasePrice = item.prices?.[0]?.itemPrice || 0;


      if (!isItemFree && Array.isArray(item.taxes)) {
        item.taxes.forEach(tax => {
          const taxAmount = ((itemBasePrice * quantity) * tax.taxRate) / 100;
          taxMap[tax.taxName] = (taxMap[tax.taxName] || 0) + taxAmount;
        });
      }

      // Addon-level tax (always included)
      item.addonItems?.items?.forEach(addon => {
        const addonAmount = addon.itemPrice * (addon.itemQuantity || 1);
        addon.taxes?.forEach(tax => {
          const taxAmount = (addonAmount * tax.taxRate) / 100;
          taxMap[tax.taxName] = (taxMap[tax.taxName] || 0) + taxAmount;
        });
      });
    });

    const breakdown = Object.entries(taxMap).map(([name, amount]) => ({
      name,
      amount: amount.toFixed(2)
    }));

    setTaxBreakup(breakdown);
    setShowTaxBreakup((prev) => !prev);
  };

  const fetchSubGroup = async () => {
    try {
      const res = await api.get("/itemsubgroups");

      setSubgroups(res.data.list);

    } catch (error) {
      console.log(error);

    }
  };

  const fetchOpenType = async () => {

    try {
      const res = await api.get("/order/opentype");

      setOpenType(res.data.data);

    } catch (error) {
      console.log(error);

    }
  }

  const createOpenItem = async () => {

    const payload = {

      itemName: formData.itemName,
      itemSubGroupId: selectedSubgroupId,
      itemCategoryId: openType.categoryId,
      itemSubCategoryId: openType.subCategoryId,
      itemCode: itemCode,
      itemQuantity: formData.quantity,
      itemPrice: formData.price,
      outletId: outletId,
      taxId: formData.selectedTaxes?.map(t => t.value) || [],
      itemSize: selectedItemSize.value,
      isActive: true,
      taxAfterDiscount: formData.TaxAfterDiscount || false,
      addonItems: selectedAddonss.map((addon) => {
        return {
          itemId: addon.itemId,
          itemSizeId: addon.sizeId,
          qty: addon.quantity,
          isCompulsory: addon.isCompulsory,
          isActive: true
        }
      })
    }
    console.log(payload);

    try {
      const res = api.post("/items/openitem", payload);
      if (res.data.isValid) {
        toast.success((await res).data.successMessage);
        setSelectedAddonss([]);
        fetchItemsData();
      } else {
        toast.warning("Something went wrong during creating open item");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchItemSize = async () => {
    try {
      const res = await api.get("/itemsize");
      const rawSizes = res.data.list || [];

      const formattedSizes = rawSizes.map(size => ({
        value: size.sizeId,
        label: size.sizeName,
      }));

      setItemSize(formattedSizes);
    } catch (error) {
      console.log(error);
    }
  };

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
        value: c.name,
        label: c.name,
        ...c,
      }));
      setCustomers(customerOptions);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchOffer = async (itemId) => {

    try {
      const res = await api.get(`/offeritemcondition/by-item/${itemId}`);
      setOffers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (selected) => {
    setSelectedCustomer(selected);
    setPopupData((prev) => ({
      ...prev,
      mobileNumber: selected?.mobile
    }))
  };

  const handlePlaceOrder = () => {
    if (navigateTable.prefix === "V") {
      setShowPopup(true);
      fetchCustomerDetails();
    } else if (navigateTable.prefix === "O") {
      updateOrder();
    }
  };

  const placeOrder = async () => {

    const payload = {
      outletId: outletId,
      tableID: navigateTable.tableId,
      kotNumber: null,
      manualKotNumber: null,
      pax: Number(popupData.pax) || Number(navigateTable.capacity),
      customerName: selectedCustomer?.name || "",
      customerPhone: selectedCustomer?.mobile || "",
      customerState: null,
      orderType: "Dine in",
      orderDate: new Date().toISOString(),
      orderTaker: userId,
      orderRemarks: popupData.remarks || null,
      allNonChargeableRemarks: allNonChargableRemarks,
      isActive: true,
      isUpdate: false,
      terminalID: null,
      isEstimated: popupData.isEstimated || false,
      isDefaultCustomer: popupData.isDefault,
      orderDetailsList: cartItems?.map((item, index) => {
        const matchedPrice = item.prices?.find(
          (price) => price.outletId === outletId
        );

        const baseRate = matchedPrice?.itemPrice || 0;
        const isItemFree = itemZeroPrices[item.itemId]?.isFree || false;
        const itemFreeRemarks = itemZeroPrices[item.itemId]?.reason || "";


        const addonList = item.addonItems?.items?.map((addon) => {
          const addonRate = isZeroPrice ? 0 : (addon.itemPrice || 0);
          const addonQty = addon.itemQuantity || 1;

          return {
            addonItemID: addon.itemId,
            qty: addonQty,
            uomId: addon.uomID || null,
            sizeId: addon.itemSizeId || null,
            rate: addonRate,
            total: addonRate * addonQty,
            isNonChargeable: isZeroPrice,
          };
        }) || [];

        return {
          serial: index + 1,
          itemId: item.itemId,
          itemRemarks: item.remarks || null,
          qty: item.quantity,
          uomId: item.uomID || null,
          sizeId: matchedPrice?.itemSizeId || null,
          rate: isItemFree ? 0 : baseRate,
          offerID: item.offerID || null,
          isPrint: item.isPrint ?? true,
          total: isItemFree ? 0 : baseRate * item.quantity,
          isActive: true,
          isRateOrAmount: false,
          discountRemarks: null,
          itemDiscount: null,
          isNonChargeable: isItemFree,
          nonChargeableRemarks: itemFreeRemarks,
          addonList: addonList
        };
      })
    };

    console.log(payload);


    try {
      const res = await api.post("/order", payload);

      if (res.data.isValid) {
        toast.success(res.data.successMessage);
        localStorage.setItem("cartItems", JSON.stringify([]));
        // localStorage.removeItem("cartItems");
        localStorage.removeItem("navigateTable");
        setIsZeroPrice(false);
        setAllNonChargableRemarks("");
        navigate("/table-management");
      } else {
        toast.warning("Something went wrong during order placing");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error while placing order.");
    }

  };

  const updateOrder = async () => {

    const groupedByKot = cartItems.reduce((acc, item) => {
      const kot = item.kotNumber || "NEW";
      if (!acc[kot]) acc[kot] = [];
      acc[kot].push(item);
      return acc;
    }, {});

    // console.log(groupedByKot);


    const payload = Object.entries(groupedByKot)
      .filter(([kotNumber, items]) => {
        if (kotNumber === "NEW") return true;
        return items.some(i => i.isUpdate === true);
      })
      .map(([kotNumber, items], groupIndex) => {
        return {
          outletId,
          tableID: navigateTable.tableId,
          kotNumber: kotNumber === "NEW" ? null : kotNumber,
          manualKotNumber: null,
          pax: Number(popupData.pax) || Number(navigateTable.capacity),
          customerId: navigateTable.customerId,
          customerName: items?.customerName || null,
          customerPhone: items?.customerPhone || null,
          customerState: null,
          terminalID: null,
          orderType: "Dine in",
          orderDate: new Date().toISOString(),
          orderTaker: userId,
          orderRemarks: items.remarks || null,
          allNonChargeableRemarks: allNonChargableRemarks || null,
          isActive: true,
          isEstimated: items.isEstimated || false,
          isUpdate: items.some(i => i.isUpdate === true),

          orderDetailsList: items.map((item, index) => {
            const matchedPrice = item.prices?.[0];
            const baseRate = matchedPrice?.itemPrice || 0;
            const isItemFree = itemZeroPrices[item.itemId]?.isFree || false;
            const itemFreeRemarks = itemZeroPrices[item.itemId]?.reason || "";

            const addonList = item.addonItems?.items?.map((addon) => {
              const addonRate = isItemFree ? 0 : addon.itemPrice || 0;
              const addonQty = addon.itemQuantity || 1;

              return {
                addonItemID: addon.itemId,
                qty: addonQty,
                uomId: addon.uomID || addon.uomId,
                sizeId: addon.itemSizeId || addon.sizeId,
                rate: addonRate,
                total: addonRate * addonQty,
                isNonChargeable: isItemFree,
              };
            }) || [];

            return {
              serial: index + 1,
              itemId: item.itemId,
              itemRemarks: item.remarks || '',
              qty: item.quantity,
              uomId: item?.uomID || null,
              sizeId: matchedPrice?.itemSizeId || '',
              rate: isItemFree ? 0 : baseRate,
              offerID: item.offerID || null,
              isPrint: item.isPrint ?? true,
              total: isItemFree ? 0 : baseRate * item.quantity,
              isActive: true,
              isRateOrAmount: false,
              discountRemarks: null,
              itemDiscount: null,
              isNonChargeable: isItemFree,
              nonChargeableRemarks: item.nonChargeableRemarks || itemFreeRemarks,
              addonList,
            };
          })
        };
      });

    console.log(payload);

    try {
      const res = await api.put("/order", payload);

      if (res.data.isValid) {
        toast.success(res.data.successMessage);
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.removeItem("navigateTable");
        setIsZeroPrice(false);
        setAllNonChargableRemarks("");
        navigate("/table-management");
      } else {
        toast.warning(res.data);
      }
    } catch (error) {
      console.error("Update order error:", error);
      toast.error("Server error while updating order");
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

    fetchItemAddon(cartItem);

    setSelectedItem(cartItem);

    setSelectedSize(cartItem.prices?.[0] || null);

    setQuantity(cartItem.quantity || 1);


    setRemarks(cartItem.remarks || "");

    const selected = {};
    for (const addon of cartItem.addonItems?.items || []) {
      selected[addon.itemId] = {
        ...addon,
        selectedSize: {
          itemPrice: addon.itemPrice,
          itemSizeId: addon.itemSizeId,
          itemSizeName: addon.itemSizeName,
          itemPriceId: addon.itemPriceId || null,
        },
        quantity: addon.itemQuantity || 1,
      };
    }

    setSelectedAddons(selected);

    setEditingItemId(cartItem.uniqueKey);
  };

  const calculateTotalItemPrice = (cartItem, itemZeroPrices, isZeroPrice) => {
    const isItemFree = isZeroPrice || itemZeroPrices?.[cartItem.itemId]?.isFree;

    const baseItemPrice = cartItem.prices?.[0]?.itemPrice || 0;
    const quantity = cartItem.quantity || 1;

    const itemTotal = isItemFree ? 0 : (baseItemPrice * quantity);

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

    return itemTotal + compulsoryPrice + optionalPrice;
  };

  const subtotal = cartItems
    .filter(item => !item.isDisabled)
    .reduce((sum, item) => {
      return sum + calculateTotalItemPrice(item, itemZeroPrices, isZeroPrice);
    }, 0);


  const totalAddons = cartItems
    .filter(item => !item.isDisabled)
    .reduce((total, item) => {
      return (
        total +
        (item.addonItems?.items?.reduce((sum, addon) => sum + (addon.itemQuantity || 0), 0) || 0)
      );
    }, 0);

  const calculateItemTax = (cartItem, itemZeroPrices, isZeroPrice) => {
    const isItemFree = isZeroPrice || itemZeroPrices?.[cartItem.itemId]?.isFree;
    let totalTax = 0;

    if (!isItemFree) {
      const quantity = cartItem.quantity || 1;
      const itemBasePrice = cartItem.prices?.[0]?.itemPrice || 0;
      const itemAmount = itemBasePrice * quantity;

      if (Array.isArray(cartItem.taxes)) {
        cartItem.taxes.forEach((tax) => {
          totalTax += (itemAmount * tax.taxRate) / 100;
        });
      }
    };

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

  const totalTax = cartItems
    .filter(item => !item.isDisabled)
    .reduce((sum, item) => {
      return sum + calculateItemTax(item, itemZeroPrices, isZeroPrice);
    }, 0);

  const handleRestoBill = async () => {

    const payload = {
      tableIDs: [
        navigateTable.tableId
      ],
      customerId: navigateTable.customerId,
      remarks: null,
      isSettle: false,
      settleBy: null,
      businessSourceId: null,
      isActive: true,
      roomInvoiceId: null,
      roomBookingId: null,
      discountTotal: 0,
      specialDiscountTotal: 0,
      referenceId: null,
      packageId: null
    }

    console.log(payload);

    try {
      const res = await api.post("/restrobill", payload)

      if (res.data.isValid) {
        toast.success(res.data.successMessage);
        // localStorage.removeItem("cartItems");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.removeItem("navigateTable");
        setIsZeroPrice(false);
        setAllNonChargableRemarks("");
        navigate("/table-management");
      } else {
        toast.warning("Something went wrong during update order");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const intervalRef = useRef(null);

  const suggestions = [
    "Search item",
    "Try 'Pasta'",
    "Search by item code",
    "Find your favorite dish"
  ];


  const startAnimation = () => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
        setFade(true);
      }, 300);
    }, 3000);
  };

  const stopAnimation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    if (searchItem.trim() === "") {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [searchItem]);

  return (
    <>
      <ToastContainer autoClose={2000} />

      <COffcanvas
        placement="bottom"
        visible={showAddonPanel}
        onHide={() => setShowAddonPanel(false)}
        backdrop={true}
        scroll={true}
        className="addon-offcanvas"
      >
        <COffcanvasHeader className="border-bottom">
          <h5 className="mb-0 fw-bold text-center w-100">Select Addons</h5>
        </COffcanvasHeader>

        <COffcanvasBody>
          <div className='d-flex align-items-center justify-content-between mb-2'>
            <div>Item Name: {formData.itemName}</div>

            <div className='border rounded p-1  shadow-sm d-flex align-items-center gap-2'>
              <CiSearch color='#ffc300' size={23} />
              <input
                type="text"
                className=" "
                placeholder="Search addons..."
                value={addonSearch}
                onChange={(e) => setAddonSearch(e.target.value)}
              />
            </div>

          </div>

          <div className="row g-2">
            {item
              ?.filter(item =>
                item.itemName.toLowerCase().includes(addonSearch.toLowerCase())
              )
              .map((item) => {
                const isSelected = selectedAddonss.some(a => a.itemId === item.itemId);
                const selected = selectedAddonss.find(a => a.itemId === item.itemId) || {};

                return (
                  <div key={item.itemId} className="col-md-12 border rounded p-2 shadow-sm d-flex align-items-center justify-content-between">
                    <div className="form-check fw-semibold ">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAddonss(prev => [
                              ...prev,
                              {
                                itemId: item.itemId,
                                itemName: item.itemName,
                                sizeId: item.prices?.[0]?.itemSizeId || null,
                                quantity: 1,
                                isCompulsory: false
                              }
                            ]);
                          } else {
                            setSelectedAddonss(prev =>
                              prev.filter(a => a.itemId !== item.itemId)
                            );
                          }
                        }}
                        id={`addon-${item.itemId}`}
                      />

                      <label htmlFor={`addon-${item.itemId}`}>{item.itemName}</label>
                    </div>

                    {item.prices && item.prices.length > 0 && (
                      <div className="d-flex align-items-center gap-1">
                        <label className="form-label fw-semibold">Size:</label>
                        <div className="d-flex align-items-center mb-2  gap-2">
                          {item.prices.map((price) => (
                            <div
                              key={price.itemSizeId}
                              className={`size-pill px-2 rounded-pill border fw-semibold ${selected.sizeId === price.itemSizeId ? 'selected' : ''
                                }`}
                              onClick={() =>
                                setSelectedAddonss(prev =>
                                  prev.map(a =>
                                    a.itemId === item.itemId ? { ...a, sizeId: price.itemSizeId } : a
                                  )
                                )
                              }
                              style={{ cursor: 'pointer', fontSize: "0.75rem" }}
                            >
                              {price.itemSizeName} - ₹{price.itemPrice}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex align-items-center gap-2">
                      <label className="mb-0">Qty:</label>
                      <div className="d-flex align-items-center border rounded px-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            setSelectedAddonss(prev =>
                              prev.map(a =>
                                a.itemId === item.itemId
                                  ? { ...a, quantity: Math.max(1, (a.quantity || 1) - 1) }
                                  : a
                              )
                            )
                          }
                          style={{ padding: "0 8px" }}
                        >
                          −
                        </button>
                        <span className="mx-2">{selected.quantity || 1}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            setSelectedAddonss(prev =>
                              prev.map(a =>
                                a.itemId === item.itemId
                                  ? { ...a, quantity: (a.quantity || 1) + 1 }
                                  : a
                              )
                            )
                          }
                          style={{ padding: "0 8px" }}
                        >
                          +
                        </button>
                      </div>
                    </div>


                    <div className="form-check">
                      <Form.Check
                        type="checkbox"
                        id="custom-checkbox"
                        label="IsActive"
                        name="IsActive"
                        className=" mt-2"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '1rem',
                        }}
                        custom="true"
                      >
                        <Form.Check.Input
                          type="checkbox"
                          className='custom-yellow-checkbox'
                          checked={selected.isCompulsory}
                          onChange={(e) => {
                            setSelectedAddonss(prev =>
                              prev.map(a =>
                                a.itemId === item.itemId
                                  ? { ...a, isCompulsory: e.target.checked }
                                  : a
                              )
                            );
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                        />
                        <Form.Check.Label htmlFor="custom-checkbox">
                          Compulsory
                        </Form.Check.Label>
                      </Form.Check>
                      {/* <input
                            className='custom-yellow-checkbox'
                          type="checkbox"
                          id={`compulsory-${item.itemId}`}
                          checked={selected.isCompulsory}
                          onChange={(e) => {
                            setSelectedAddonss(prev =>
                              prev.map(a =>
                                a.itemId === item.itemId
                                  ? { ...a, isCompulsory: e.target.checked }
                                  : a
                              )
                            );
                          }}
                        /> */}
                      {/* <label className="form-check-label" htmlFor={`compulsory-${item.itemId}`}>
                          Compulsory
                        </label> */}
                    </div>

                  </div>
                );
              })}
          </div>

          <div
            className="addon-footer d-flex justify-content-end gap-2 bg-white border-top pt-3 pb-3 px-3"
            style={{
              position: 'sticky',
              bottom: -10,
              zIndex: 10,
            }}
          >
            <button className="btn btn-secondary" onClick={() => setShowAddonPanel(false)}>
              Cancel
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                setShowAddonPanel(false);
                createOpenItem();
              }}
            >
              Save Item
            </button>
          </div>

        </COffcanvasBody>
      </COffcanvas>

      <div className='posScreenWrapper'>

        <Modal show={showPopup} onHide={() => {
          setPopupData({
            userName: '',
            mobileNumber: '',
            pax: navigateTable.capacity,
            remarks: '',
            isEstimated: false,
            isDefault: true
          })
          setShowPopup(false);
        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Extra Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form className='w-100'>
              <div className="row">
                <div className="col-md-6 mb-3">

                  <InputGroup className="w-100">
                    <InputGroup.Text>
                      <GoPerson size={25} color="#ffc800" />
                    </InputGroup.Text>
                    <div style={{ flex: 1 }}>
                      <CreatableSelect
                        classNamePrefix="react-select"
                        options={customers}
                        value={selectedCustomer}
                        onChange={(option) => {
                          setSelectedCustomer(option);
                          setPopupData(prev => ({
                            ...prev,
                            isDefault: false
                          }));
                          handleChange(option);
                        }}

                        styles={{
                          control: (provided, state) => ({
                            ...provided,

                            borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                            boxShadow: state.isFocused
                              ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                              : provided.boxShadow,
                            '&:hover': {
                              borderColor: '#ffc800',
                            },
                            width: "100%"
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? '#ffc800'
                              : state.isFocused
                                ? '#ffe066'
                                : 'white',
                            color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                            cursor: 'pointer',
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: '#fff3cd',
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: '#856404',
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#856404',
                            ':hover': {
                              backgroundColor: '#ffc800',
                              color: 'black',
                            },
                          }),
                        }}
                        isSearchable
                        placeholder=" Name"
                        isClearable
                        onCreateOption={(inputValue) => {
                          const formattedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
                          const newOption = { value: formattedValue, label: formattedValue };
                          setSelectedCustomer(newOption);
                        }}
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
                      onChange={(e) => {
                        const value = e.target.value;
                        setPopupData(prev => ({
                          ...prev,
                          mobileNumber: value,
                          isDefault: false
                        }));
                      }}
                    />
                  </InputGroup>

                </div>


                <div className="col-md-6 mb-3">
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <PiArmchairLight size={25} color="#ffc800" />
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

                  <div className="d-flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`rounded-circle border d-flex align-items-center justify-content-center`}
                        style={{
                          width: "55px",
                          height: "30px",
                          backgroundColor: popupData.pax == num ? "#ffc800" : "white",
                          color: popupData.pax == num ? "white" : "black",
                          fontWeight: "bold",
                        }}
                        onClick={() =>
                          setPopupData((prev) => ({ ...prev, pax: num.toString() }))
                        }
                      >
                        {num}
                      </button>
                    ))}
                  </div>
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

                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="IsActive"
                    name="IsActive"
                    className=" mt-2"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                    }}
                    custom="true"
                  >
                    <Form.Check.Input
                      type="checkbox"
                      className='custom-yellow-checkbox'
                      checked={popupData.isEstimated}

                      onChange={(e) =>
                        setPopupData({ ...popupData, isEstimated: e.target.checked })

                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      Estimated
                    </Form.Check.Label>
                  </Form.Check>
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


          <Modal.Footer className='d-flex align-items-center justify-content-between'>
            <Form.Check
              type="checkbox"
              id="custom-checkbox"
              label="IsActive"
              name="IsActive"
              className=""
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
              }}
              custom="true"
            >
              <Form.Check.Input
                type="checkbox"
                className='custom-yellow-checkbox'
                checked={popupData.isDefault}

                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setPopupData(prev => ({
                    ...prev,
                    isDefault: isChecked,
                    mobileNumber: isChecked ? "" : prev.mobileNumber
                  }));
                  if (isChecked) {
                    setSelectedCustomer(null);
                  }
                }}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              />
              <Form.Check.Label htmlFor="custom-checkbox">
                Default Customer
              </Form.Check.Label>
            </Form.Check>
            <div className='d-flex align-items-center gap-2'>
              <Button variant="secondary" onClick={() => {
                setShowPopup(false);
                placeOrder();
                setPopupData({
                  mobileNumber: "",
                  pax: "",
                  userName: userDetails.userID,
                  remarks: ""
                });
                setSelectedCustomer("");
              }}>
                Skip
              </Button>
              <Button
                variant="warning"
                onClick={() => {
                  const isDefault = popupData?.isDefault;
                  const hasCustomer = selectedCustomer && selectedCustomer?.value;
                  const hasMobile = popupData?.mobileNumber.trim().length > 0;

                  if (!isDefault && (!hasCustomer || !hasMobile)) {
                    alert("Please enter both Customer Name and Mobile Number, or check Default Customer.");
                    return;
                  }

                  setShowPopup(false);
                  placeOrder();

                  setPopupData({
                    mobileNumber: "",
                    pax: "",
                    userName: userDetails.userID,
                    remarks: "",
                    isEstimated: false,
                    isDefault: true
                  });
                  setSelectedCustomer("");
                }}
              >
                Confirm
              </Button>

            </div>
          </Modal.Footer>

        </Modal>

        <Modal show={showRemarkModal} onHide={() => setShowRemarkModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Non-Chargeable Reason</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              autoFocus
              className="form-control"
              rows={4}
              placeholder="Enter reason..."
              value={allNonChargableRemarks}
              onChange={(e) => setAllNonChargableRemarks(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = allNonChargableRemarks.trim();
                  if (value) {
                    setNonChargeableRemark(value);
                    setIsZeroPrice(true);
                    setShowRemarkModal(false);
                  }
                } else if (e.key === "Escape") {
                  setShowRemarkModal(false);
                }
              }}
            />
            <div className="text-muted mt-2"><small>Press Enter to confirm, Esc to cancel</small></div>

            <div className='w-100 d-flex justify-content-end mt-3'>
              <Button
                variant="warning"
                onClick={() => {
                  const value = allNonChargableRemarks.trim();
                  if (value) {
                    setNonChargeableRemark(value);
                    setIsZeroPrice(true);
                    setShowRemarkModal(false);
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={!!itemRemarkPopup} onHide={() => setItemRemarkPopup(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Make This Item Free</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              autoFocus
              className="form-control"
              placeholder="Enter reason..."
              rows={4}
              value={itemRemarkInput}
              onChange={(e) => setItemRemarkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (itemRemarkInput.trim()) {
                    setItemZeroPrices(prev => ({
                      ...prev,
                      [itemRemarkPopup]: {
                        isFree: true,
                        reason: itemRemarkInput.trim(),
                      },
                    }));
                    setItemRemarkPopup(null);
                    setItemRemarkInput("");
                  }
                } else if (e.key === "Escape") {
                  setItemRemarkPopup(null);
                }
              }}
            />
            <div className="text-muted mt-2"><small>Press Enter to confirm, Esc to cancel</small></div>
            <div className='d-flex justify-content-end mt-3'>
              <Button variant="warning" onClick={() => {
                if (itemRemarkInput.trim()) {
                  setItemZeroPrices(prev => ({
                    ...prev,
                    [itemRemarkPopup]: {
                      isFree: true,
                      reason: itemRemarkInput.trim(),
                    },
                  }));
                  setItemRemarkPopup(null);
                  setItemRemarkInput("");
                }
              }}>
                Confirm
              </Button>
            </div>
          </Modal.Body>
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
          {subcategory.map((subcategory, index) => (
            <div
              title={subcategory.itemSubCategoryName}
              key={index}
              className={`subcategoryItem ${selectedSubcategory === subcategory.itemSubCategoryID ? "selected" : ""}`}
              onClick={() => setSelectedSubcategory(subcategory.itemSubCategoryID)}
            >
              <div className="subcategoryIcon">
                <img src="src/assets/images/fooddimage.jpg" className='w-100 h-100' alt="" />
              </div>

              <span className="subcategoryName" >
                {subcategory.itemSubCategoryName.length > 11
                  ? subcategory.itemSubCategoryName.slice(0, 11) + "..."
                  : subcategory.itemSubCategoryName}
              </span>
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
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className={`animated-input ${fade ? "fade-in" : "fade-out"}`}
                placeholder={suggestions[placeholderIndex]}
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
              {item
                ?.filter((item) => {
                  const term = normalize(searchItem);
                  if (term === "") return true;

                  return (
                    normalize(item.itemName).includes(term) ||
                    normalize(item.itemCode).includes(term) ||
                    normalize(item.uomName).includes(term)
                  );
                })
                .map((item) => (
                  <div className="itemBox" key={item.itemId}>
                    <div
                      className="imageWrapper d-flex align-items-center justify-content-center"
                      onClick={async () => {
                        fetchOffer(item.itemId)
                        setSelectedItem(item);
                        const defaultSize = item.prices?.find(p => p.isDefaultSize) || item.prices?.[0];
                        setSelectedSize(defaultSize);
                        setQuantity(1);
                        await fetchItemAddon(item);
                        setSelectedAddons({});
                      }}
                    >
                      {item.itemImage ? (
                        <img src={`${baseImgUrl}${item.itemImage}`} alt="" />
                      ) : (
                        <img src={`src/assets/food.png`} alt="" />
                      )}
                    </div>

                    <div className="itemDetailsWrapper">
                      <div className="itemName">{item.itemName}</div>
                      <div className="otherDetailsWrapper">
                        <div className={`isvegWrapper ${item.itemType === "Veg" ? "veg" : "Nonveg"}`}>
                          {item.itemType}
                        </div>
                        <div className="itemPrice">
                          {(() => {
                            const defaultPrice = item.prices?.find(price => price.isDefaultSize === true);
                            const fallbackPrice = item.prices?.[0];
                            const finalPrice = defaultPrice || fallbackPrice;
                            return finalPrice ? <div>&#8377; {finalPrice.itemPrice}</div> : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

            </div>

            {selectedItem && (
              <div className="bottomPopup">
                <div className="popupHeader ">
                  <strong className='fs-4 mb-3'>{selectedItem.itemName}</strong>
                  <div className='d-flex align-items-center gap-5'>
                    <button onClick={() => setShowOfferModal(true)} className='btn btn-sm btn-warning text-white'>view offers</button>
                    <button onClick={() => setSelectedItem(null)} className="btn btn-light text-danger">×</button>
                  </div>

                  {showOfferModal && (
                    <>
                      <div className="modern-offer-modal">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="fw-bold">Available Offers</h5>
                          <button
                            className="btn-close"
                            onClick={() => {
                              setSelectedOffer(null);
                              setShowOfferModal(false)
                            }}
                          ></button>
                        </div>

                        {offers.map((offer) => {
                          const isOpen = selectedOffer?.id === offer.id;

                          return (
                            <div
                              key={offer.id}
                              className={`offer-card border rounded p-3 mb-3 ${isOpen ? "active" : ""}`}
                              onClick={() =>
                                setSelectedOffer(isOpen ? null : offer)
                              }
                            >
                              <div className="form-check d-flex align-items-start">
                                <input
                                  type="radio"
                                  className="form-check-input mt-1"
                                  checked={isOpen}
                                  readOnly
                                />
                                <label className="form-check-label ms-2">
                                  <div className="fw-semibold">{offer.name}</div>
                                </label>
                              </div>

                              <div
                                className={`offer-details ${isOpen ? "open" : ""}`}
                              >
                                <div className="text-muted small mt-2">{offer.details}</div>
                                <ul className="small mt-2 ps-3">
                                  {offer.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                                <button
                                  onClick={() => {
                                    setSelectedOffer(null);
                                    setShowOfferModal(false)
                                  }}
                                  className="btn btn-outline-warning  btn-sm mt-2 w-100"
                                >
                                  Apply Offer
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}



                </div>

                <div className="popupContent">

                  <div className="sizeOptions">
                    <h5 className='mb-2'>Item Sizes </h5>
                    <div className='d-flex justify-content-between w-100'>
                      <div className='d-flex align-items-center gap-2'>
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

                                  <div className="d-flex justify-content-between align-items-center gap-2">
                                    <div className="d-flex align-items-center gap-3">
                                      <span>Qty:</span>
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                          setSelectedAddons((prev) => {
                                            const existing = prev[addonId];
                                            const selectedSize = addon.prices.find(p => p.isDefaultSize) || addon.prices[0];

                                            if (!existing) {
                                              return {
                                                ...prev,
                                                [addonId]: {
                                                  ...addon,
                                                  selectedSize,
                                                  quantity: 1,
                                                },
                                              };
                                            }

                                            return {
                                              ...prev,
                                              [addonId]: {
                                                ...existing,
                                                quantity: Math.max(1, existing.quantity - 1),
                                              },
                                            };
                                          });
                                        }}
                                      >
                                        -
                                      </button>

                                      <span>{selectedAddons[addonId]?.quantity || 1}</span>
                                      <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                          setSelectedAddons((prev) => {
                                            const existing = prev[addonId];
                                            const selectedSize = addon.prices.find(p => p.isDefaultSize) || addon.prices[0];

                                            if (!existing) {
                                              // Auto-select and set quantity to 2 (since + is pressed first)
                                              return {
                                                ...prev,
                                                [addonId]: {
                                                  ...addon,
                                                  selectedSize,
                                                  quantity: 2,
                                                },
                                              };
                                            }

                                            return {
                                              ...prev,
                                              [addonId]: {
                                                ...existing,
                                                quantity: existing.quantity + 1,
                                              },
                                            };
                                          });
                                        }}
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
                  <div className='d-flex align-items-center justify-content-between'>
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
                          uomID: addon.uomID,
                          taxes: addon.taxes
                        }));

                        const addonKey = addonItems
                          .map(a => `${a.itemId}_${a.itemSizeId}_${a.itemQuantity}`)
                          .join("|");

                        const newUniqueKey = `${selectedItem.itemId}_${selectedSize.itemSizeId}_${addonKey}_${remarks || ""}`;

                        const updatedCartItem = {
                          ...selectedItem,
                          prices: [selectedSize],
                          quantity,
                          remarks,
                          addonItems: {
                            items: addonItems,
                          },
                          uniqueKey: newUniqueKey,
                          prefix: "V",
                          isDisabled: false,
                        };

                        if (editingItemId) {
                          setCartItems((prev) => {
                            const updatedItems = prev.map((item) =>
                              item.uniqueKey === editingItemId ? updatedCartItem : item
                            );
                            localStorage.setItem("cartItems", JSON.stringify(updatedItems));
                            return updatedItems;
                          });
                        } else {
                          addToCart(updatedCartItem);
                        }

                        setSelectedItem(null);
                        setItemAddons([]);
                        setSelectedAddons({});
                        setEditingItemId(null);
                        setQuantity(1);
                        setSelectedSize(null);
                        setRemarks("");
                      }}

                    >
                      {editingItemId ? "Update item" : "Add item"} ₹ {(selectedSize?.itemPrice || 0) * quantity +
                        Object.values(selectedAddons).reduce(
                          (sum, addon) => sum + (addon.selectedSize?.itemPrice || 0) * (addon.quantity || 1),
                          0
                        )}
                    </button>

                    <Form.Check
                      type="checkbox"
                      id="custom-checkbox"
                      label="IsActive"
                      name="IsActive"
                      className=" mt-2"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                      }}
                      custom="true"
                    >
                      <Form.Check.Input
                        type="checkbox"
                        className='custom-yellow-checkbox'
                        checked={isCompulsory}

                        onChange={(e) =>
                          setIsCompulsury(e.target.checked)
                        }
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      />
                      <Form.Check.Label htmlFor="custom-checkbox" className='fw-bold'>
                        Is Complimentory
                      </Form.Check.Label>
                    </Form.Check>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        <div className="posWrapper" style={{ position: 'relative', height: '100vh' }}>

          <div className={`openItemContainer ${showDrawer ? 'visible' : ''}`}>
            <div
              className="drawerToggle"
              onClick={() => setShowDrawer(!showDrawer)}
            >
              {showDrawer ? (
                <MdKeyboardDoubleArrowRight size={30} className="text-warning" />
              ) : (
                <MdKeyboardDoubleArrowLeft size={30} className="text-warning" />
              )}
            </div>

            <div className="drawerContent h-100 p-4 bg-white rounded-4 shadow-lg">
              <h2 className='text-center mb-4'>Create Open Item</h2>
              <div className="mb-4">
                <h5 className="mb-3 fw-semibold text-secondary text-center">Select Subgroup</h5>
                <div className="subgroupBar d-flex gap-2 flex-wrap">
                  {subgroups.map((sub) => (
                    <div
                      key={sub.itemSubGroupId}
                      className={`subgroupTab px-4 py-1 rounded-pill fw-semibold shadow-sm 
                      ${selectedSubgroupId === sub.itemSubGroupId ? 'bg-warning text-dark' : 'bg-light text-muted'}`}
                      onClick={() => {
                        setSelectedSubgroupName(sub.itemSubGroupName)
                        setSelectedSubgroupId(sub.itemSubGroupId)
                      }}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
                    >
                      {sub.itemSubGroupName}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="row g-4">
                  <div className="col-12">
                    <InputGroup hasValidation className="shadow-sm ">
                      <InputGroup.Text>
                        <PiArmchairLight size={25} color='#ffc800' />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className={`form-control ${itemNameExists ? "is-invalid" : ""}`}
                        placeholder="Enter item name"
                        name="itemName"
                        value={formData.itemName}
                        onChange={(e) => handleInputChange(e)}
                      />


                    </InputGroup>

                  </div>
                  <div className="col-12">

                    <InputGroup hasValidation className="shadow-sm">
                      <InputGroup.Text>
                        <span className="text-warning fw-bold">{`O${selectedSubgroupName.charAt(0).toUpperCase()}`}</span>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter item code"
                        value={itemCodeNumber}
                        onChange={(e) => setItemCodeNumber(e.target.value)}
                      />
                    </InputGroup>

                  </div>
                  <div className="col-12">

                    <InputGroup hasValidation className="shadow-sm">
                      <InputGroup.Text>
                        <PiArmchairLight size={25} color='#ffc800' />
                      </InputGroup.Text>
                      <Select
                        options={itemTypes}
                        value={selectedItemType}
                        onChange={(option) => setSelectedItemType(option)}
                        placeholder="Select item type"
                        isClearable
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            width: "20.3vw",
                            borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                            boxShadow: state.isFocused
                              ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                              : provided.boxShadow,
                            '&:hover': {
                              borderColor: '#ffc800',
                            },
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? '#ffc800'
                              : state.isFocused
                                ? '#ffe066'
                                : 'white',
                            color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                            cursor: 'pointer',
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: '#fff3cd',
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: '#856404',
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#856404',
                            ':hover': {
                              backgroundColor: '#ffc800',
                              color: 'black',
                            },
                          }),
                        }}
                      />
                    </InputGroup>

                  </div>



                  <div className="col-12">
                    <InputGroup hasValidation className="shadow-sm">
                      <InputGroup.Text>
                        <PiArmchairLight size={25} color='#ffc800' />
                      </InputGroup.Text>
                      <Select
                        classNamePrefix="react-select"
                        options={itemSize}
                        value={selectedItemSize}
                        onChange={(option) => setSelectedItemSize(option)}
                        placeholder="Select size"
                        isClearable
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            width: "20.3vw",
                            borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                            boxShadow: state.isFocused
                              ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                              : provided.boxShadow,
                            '&:hover': {
                              borderColor: '#ffc800',
                            },
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? '#ffc800'
                              : state.isFocused
                                ? '#ffe066'
                                : 'white',
                            color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                            cursor: 'pointer',
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: '#fff3cd',
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: '#856404',
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#856404',
                            ':hover': {
                              backgroundColor: '#ffc800',
                              color: 'black',
                            },
                          }),
                        }}
                      />
                    </InputGroup>

                  </div>


                  <div className="col-12">
                    <InputGroup hasValidation className="shadow-sm">
                      <InputGroup.Text>
                        <PiArmchairLight size={25} color='#ffc800' />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="form-control rounded-3 shadow-sm"
                        placeholder="Enter price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          const allowed = /[0-9.]/
                          const key = e.key;
                          if (!allowed.test(key) || (key === '.' && formData.price.includes('.'))) {
                            e.preventDefault();
                          }
                        }}
                      />


                      <InputGroup.Text className="bg-light p-0 border-0">
                        <div className="d-flex align-items-center gap-3 px-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                quantity: Math.max(1, (prev.quantity || 1) - 1),
                              }))
                            }
                          >
                            −
                          </button>

                          <span>{formData.quantity || 1}</span>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setFormData(prev => ({
                                ...prev,
                                quantity: (prev.quantity || 1) + 1,
                              }))
                            }
                          >
                            +
                          </button>
                        </div>
                      </InputGroup.Text>
                    </InputGroup>

                  </div>

                  <InputGroup hasValidation className="shadow-sm">
                    <InputGroup.Text>
                      <PiArmchairLight size={25} color='#ffc800' />
                    </InputGroup.Text>
                    <Select
                      options={taxOptions}
                      isMulti
                      value={formData.selectedTaxes}
                      onChange={handleTaxChange}
                      placeholder="Select taxes"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          width: "20.3vw",
                          borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                          boxShadow: state.isFocused
                            ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                            : provided.boxShadow,
                          '&:hover': {
                            borderColor: '#ffc800',
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#ffc800'
                            : state.isFocused
                              ? '#ffe066'
                              : 'white',
                          color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                          cursor: 'pointer',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: '#fff3cd',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: '#856404',
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: '#856404',
                          ':hover': {
                            backgroundColor: '#ffc800',
                            color: 'black',
                          },
                        }),
                      }}
                    />
                  </InputGroup>

                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="IsActive"
                    name="IsActive"

                    className="ms-3"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                    }}
                    custom="true"
                  >
                    <Form.Check.Input
                      type="checkbox"
                      className='custom-yellow-checkbox'
                      checked={formData.TaxAfterDiscount}

                      onChange={(e) =>
                        setFormData({ ...formData, TaxAfterDiscount: e.target.checked })

                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      Tax After Discount
                    </Form.Check.Label>
                  </Form.Check>

                </div>

                <div className="mt-1 d-flex justify-content-end">
                  <button className="btn btn-warning px-5 py-2 shadow fw-bold" onClick={() => {
                    if (itemNameExists) return;
                    setShowAddonPanel(true)
                    setShowDrawer(!showDrawer)
                  }}>Add addons</button>
                </div>
              </div>
            </div>

          </div>


        </div>

        <div className="posRight CardandBill shadow-sm">

          <div className="posCart shadow-sm">

            <div className="cartTop shadow-sm">
              <div className=''>{result.outletName}</div>

              <div className="tabelNameAndKot">
                <div
                  onClick={() => {
                    navigate("/table-management")
                  }}
                >{navigateTable.tableName}</div>
                <div className='tabelDetails d-flex align-items-center gap-2'><div className='tableRunningTime'>44 Minutes</div>
                  <div className='pax d-flex align-items-center gap-1'><IoPersonOutline color='#ffffffff' size={11} />{navigateTable.capacity}</div></div>
              </div>
              <div className='gap-1 d-flex align-items-center justify-content-center'>

                <div className='btn btn-sm shandow-sm d-flex align-items-center justify-content-center' style={{ backgroundColor: "white", color: "#f9b115" }}  onClick={() => setShowDiscountPanel(true)}>
                  <TbRosetteDiscountCheck size={18} />
                </div>
                  <DiscountPanel show={showDiscountPanel}
    onClose={() => setShowDiscountPanel(false)}
  />
                <div className="btn btn-sm shadow-sm d-flex align-items-center justify-content-center fw-bold" style={{ backgroundColor: "white", color: "#f9b115", fontSize: "0.7vw" }}>
                  OFFERS
                </div>
              </div>
            </div>

            <div className="cartMiddle shadow-sm">
              <div className='features d-flex align-items-center justify-content-between w-100'>
                <div className="orderTakerDropDown">
                  {navigateTable.customerName}  <div className='DropDownIcon'><RiArrowDownSFill /></div>
                </div>

                <div className="AnBUtton">
                  <BsRepeat style={{ color: "grey" }} size={14} /> Repeat
                </div>
                <div className="AnBUtton">
                  <GoHistory style={{ color: "grey" }} size={14} /> History
                </div>
                <div className="AnBUtton" onClick={() => {
                  if (cartItems.length === null) {
                    alert("cart empty")
                  } else {
                    setShowRemarkModal(true)
                  }
                }
                }>
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

              {Object.entries(kotGroups).map(([kotNumber, items], groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {kotNumber !== "custom" && (
                    <div className="kotHeader d-flex justify-content-between align-items-center px-3 py-1 bg-light-subtle fw-bold">
                      <div>KOT #{kotNumber}</div>
                      {!items[0]?.isKotConfirmed && (
                        <div
                          className="btn btn-sm btn-warning"
                          onClick={() => confirmKot(kotNumber)}
                        >
                          Active KOT
                        </div>
                      )}
                    </div>
                  )}

                  {
                    items.length === 0 ? (
                      <p className='d-flex align-items-center justify-content-center fs-3 fw-bold h-100 w-100 text-warning'>Cart is empty</p>
                    ) : (
                      items.map((cartItem, index) => {
                        const isDisabled = cartItem.isDisabled;

                        return (
                          <div className='cartItemFull' key={index}>
                            <div className="cartItemImg d-flex align-items-center justify-content-center"
                              onClick={() => !isDisabled && removeFromCart(cartItem.itemId)}>
                              {cartItem.itemImage
                                ? <img src={`${baseImgUrl}${cartItem.itemImage}`} alt="" />
                                : <img src={`src/assets/food.png`} alt="" />}
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
                                  {!isDisabled && (
                                    <div onClick={() => {
                                      removeFromCart(cartItem.uniqueKey);
                                      setIsZeroPrice(false);
                                      setItemZeroPrices({});
                                    }}>
                                      <MdOutlineCancelPresentation color='red' size={23} />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="cartItemPriceamdsize">
                                <div className='prizeAndSize'>
                                  <div className={`cartItemPrice ${isZeroPrice || itemZeroPrices[cartItem.itemId]?.isFree ? "text-decoration-line-through" : ""}`}
                                    style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}
                                    onClick={() => !isDisabled && setItemRemarkPopup(cartItem.itemId)}
                                  >
                                    ₹ {cartItem.prices[0].itemPrice}
                                  </div>

                                  <div className='d-flex gap-2 align-items-center' onClick={() => !isDisabled && handleEditItem(cartItem)}>
                                    <div style={{ fontSize: "0.95rem" }}>Size: </div>
                                    <div className="cartSize" >
                                      {cartItem.prices[0].itemSizeName}
                                    </div>
                                  </div>

                                  <div className="cartQuantityContainer">
                                    <div className="plusBtnDecrease" onClick={() => !isDisabled && decreaseQuantity(cartItem.uniqueKey)}>-</div>
                                    <div className="plusBtnIncrese" style={{ color: `${cartItem.itemType === "Veg" ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>{cartItem.quantity}</div>
                                    <div className="plusBtnIncrease" onClick={() => !isDisabled && increaseQuantity(cartItem.uniqueKey)}>+</div>
                                  </div>
                                </div>
                              </div>

                              <div className="cartQuantityBtns">
                                {cartItem.addonItems?.items?.length > 0 && (
                                  <div className="addonItemList mt-2">
                                    {cartItem.addonItems.items.map((addon, i) => (
                                      <div key={i}
                                        style={{ fontSize: "0.75rem", cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                        onClick={() => !isDisabled && handleEditItem(cartItem)}
                                        className="addonItem text-muted gap-2 d-flex justify-content-between"
                                      >
                                        <div>
                                          + {addon.itemName} ({addon.itemSizeName}) x {addon.itemQuantity}
                                        </div>
                                        <div className={`${isZeroPrice ? "text-decoration-line-through" : ""}`} >
                                          ₹{addon.itemPrice * addon.itemQuantity}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {(cartItem.taxes?.length > 0 || cartItem.addonItems?.items?.length > 0) && (
                                  <div style={{ fontSize: "0.6vw" }} className="text-muted d-flex mt-1 gap-1">
                                    {(cartItem.taxes || []).map((tax, i) => {
                                      const taxAmount = ((cartItem.prices?.[0]?.itemPrice || 0) * cartItem.quantity * tax.taxRate) / 100;
                                      return (
                                        <span key={`item-tax-${i}`}>
                                          {tax.taxName}: ₹{taxAmount.toFixed(2)}
                                        </span>
                                      );
                                    })}

                                    {cartItem.addonItems?.items?.flatMap((addon, i) =>
                                      (addon.taxes || []).map((tax, j) => {
                                        const addonTaxAmount = ((addon.itemPrice || 0) * addon.itemQuantity * tax.taxRate) / 100;
                                        return (
                                          <span key={`addon-tax-${i}-${j}`}>
                                            {tax.taxName}: ₹{addonTaxAmount.toFixed(2)}
                                          </span>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }))

                  }
                </React.Fragment>
              ))}

            </div>

          </div>

          <div className={`tax-slide-panel p-3 ${showTaxBreakup ? "show" : ""}`}>
            <div className="d-flex justify-content-between mb-2">
              <strong>Tax Breakup</strong>
              <button
                className="btn btn-sm text-danger"
                onClick={() => setShowTaxBreakup(false)}
              >
                <MdOutlineClose size={20} />
              </button>
            </div>
            {taxBreakup.map((tax, i) => (
              <div key={i} className="d-flex justify-content-between border-bottom py-1">
                <span>{tax.name}</span>
                <span>₹{tax.amount}</span>
              </div>
            ))}
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

              <div className="arrowUp text-warning" onClick={getTaxBreakup}>
                {showTaxBreakup ? <MdKeyboardDoubleArrowDown size={30} /> : <MdKeyboardDoubleArrowUp size={30} />}
              </div>

              <div className="billRow">
                <div>Total</div>
                <div className='text-warning'>&#8377;{subtotal + totalTax}</div>
              </div>

            </div>

            <div className='d-flex w-100 justify-content-center gap-2'>
              {(navigateTable.prefix === "V" || navigateTable.prefix === "O") && (
                <div
                  className="btn btn-warning fw-bold shadow text-white"
                  onClick={() => {
                    if (!cartItems || cartItems.length === 0) {
                      toast.error("Cannot place order: Cart is empty.");
                      return;
                    }
                    handlePlaceOrder();
                  }}
                >
                  Place Order
                </div>
              )}

              {navigateTable.prefix === "O" || navigateTable.prefix === "U" ? (
                <div className="btn btn-warning fw-bold shadow text-white" onClick={handleRestoBill}>
                  Bill and Print
                </div>
              ) : ""}
              {navigateTable.prefix === "U" ? (
                <div className="btn btn-warning fw-bold shadow text-white" >
                  Bill and Settlement
                </div>
              ) : ""}
              {navigateTable.prefix === "V" ? (
                <div type="button" className="btn btn-outline-warning fw-bold shadow">Hold</div>
              ) : ""}


            </div>
          </div>

        </div>

      </div>

    </>
  )
}

export default PosScreen;

