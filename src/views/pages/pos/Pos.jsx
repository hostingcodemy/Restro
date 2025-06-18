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
import { PiNotePencilThin } from "react-icons/pi";
import { PiPencilSimpleThin } from "react-icons/pi";
import { RxValueNone } from "react-icons/rx";
import api from '../../../config/AxiosInterceptor';
import "src/views/pages/pos/Pos.css"
import { PiStarLight } from "react-icons/pi";

const PosScreen = () => {

  const fetchCalled = useRef(false);
  const [items, setItems] = useState(null);
  const [subcategory, setSubcategory] = useState([]);
  const [hover, SetHover] = useState(null);
  // const outletId = localStorage.getItem("outletId");

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    // fetchItemsData();
    fetchSubcategory();
  }, []);

  console.log(subcategory);


  // const fetchItemsData = async () => {
  //   try {
  //     const res = await api.get(`/items/outlet/${outletId}`);
  //     setItems(res.data.list);
  //   } catch (error) {
  //     console.error("Error fetching Items data", error);
  //   }
  // };


  const fetchSubcategory = async () => {
    try {
      const res = await api.get(`/itemsubcategory`);
      setSubcategory(res.data.list);
    } catch (error) {
      console.error("Error fetching Items data", error);
    }
  };


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

    <div className='posScreenWrapper'>

      <div className="subcategoryWrapperVerticle">
      <div></div>
        {foodSubcategoryList.map((item) => (
          <div
            key={item.itemId}
            className={`subcategoryItem ${selectedSubcategory === item.itemId ? "selected" : ""}`}
            onClick={() => setSelectedSubcategory(item.itemId)}
          >
           <div className='subcategoryIcon'>
               {item.subcategoryIcon}
              </div>
            <span className='subcategoryName'>{item.subcategoryName}</span>
          </div>
        ))}
      </div>

      <div className="posLeft itemsShowCase">
        {/* <div className="posLeftTop subactegoryList">
          
          {foodSubcategoryList.map((subcategory, index) => {
            return <div key={index} className='subacetgoryWrapper shadow-sm'>

              <div className='subcategoryIcon'>
               {subcategory.subcategoryIcon}
              </div>

              <div className='subcategoryDetails'>
                <div className="subcategoryName">
                  {subcategory.subcategoryName}
                </div>
                <div className="subcategoryQuantity">
                 {subcategory.subcategoryQuantity}
                </div>

              </div>
            </div>
          })}
        </div> */}

        <div className="posLeftTop SearchandBtn">

          {/* <div className="SearchItem shadow-sm">
            <div className="itemsSerarchIcon">
              <CiSearch size={20} />
            </div>
            <input

              type="text"
              placeholder='Search......'
            />
          </div> */}

          <div className="filterItems">
            {filters.map((filterItem, index) => {
              return <div className='tableHeaderButton bg-white' key={index}>
                <div className="filterIcon">
                  {filterItem.filterIcon}
                </div>
                {filterItem.filterName}
              </div>
            })}
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
            {foodItems.map((item, index) => {
              return <div className='itemBox shadow-sm' key={index}>
                <div className="imageWrapper">
                  {/* <img src="src/assets/dimsum.jpeg" alt="" /> */}
                </div>

                <div className="itemDetailsWrapper">
                  <div className="itemName">
                    {item.itemName}
                  </div>
                  <div className="otherDetailsWrapper">
                    <div className={`isvegWrapper ${item.isVeg === true ? "veg" : "Nonveg"}`}>
                      {/* <div className={`isvegWrapper veg`}> */}
                      {item.itemType}
                    </div>
                    <div className='itemPrice'>
                      {/* {item.prices?.map((price) => { */}
                      <div>
                        &#8377; {item.itemPrice}
                      </div>
                      {/* })} */}
                    </div>
                  </div>
                </div>
              </div>
            })}
          </div>

        </div>





      </div>

      <div className="posRight CardandBill shadow-sm">

        <div className="posCart shadow-sm">

          <div className="cartTop shadow-sm">
            <div className=" circleIcon">
              <PiNotePencilThin />
            </div>
            <div className="tabelNameAndKot">
              <div>T55555</div>
              <div className='kotNumber'>#kOTNO1234</div>
            </div>
            <div className=" circleIcon">
              <PiPencilSimpleThin />
            </div>
          </div>

          <div className="cartMiddle shadow-sm">
            <div className="tableDropDown">
              T55555  <div className='DropDownIcon'><RiArrowDownSFill /></div>
            </div>
            <div className="orderTakerDropDown">
              Rahul  <div className='DropDownIcon'><RiArrowDownSFill /></div>
            </div>
            <div className="AnBUtton">
              <RxValueNone style={{ color: "grey" }} size={14} /> AN
            </div>
          </div>

          <div className="cartBtm shadow-sm">
            {foodItems.map((cartItem, index) => {
              return <div className='cartItemFull' key={index}>
                <div className="cartItemImg">
                  <img src={cartItem.img} alt="" />
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
                      <div className="cartItemPrice" style={{ color: `${cartItem.isVeg ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>
                        &#8377; {cartItem.itemPrice}
                      </div>

                    </div>
                    <div className="addonItem">
                      <div>Extra Chessse</div>
                      <div>Extra Chessse</div>
                    </div>
                  </div>

                  <div className="cartQuantityBtns">
                    <div className="cartSize">
                      S
                    </div>
                    <div className="cartQuantityContainer">
                      <div className="plusBtnDecrease">-</div>

                      <div className="plusBtnIncrese" style={{ color: `${cartItem.isVeg ? "rgb(27, 203, 0)" : "rgb(255, 44, 44)"}` }}>10</div>

                      <div className="plusBtnIncrease">+</div>
                    </div>
                  </div>
                </div>
              </div>
            })}
          </div>

        </div>

        <div className="posBill">
          <div className="billWrapper">
            <div className="billRow">
              <div>Subtotal</div>
              <div>500</div>
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


          <div className="billBtn">
            Order Placed
          </div>
        </div>

      </div>

    </div>
  )
}

export default PosScreen;

