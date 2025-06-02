import React, { useEffect, useState, useMemo } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import 'src/views/pages/subscription/SubcriptionPage.css';
import { FiCheck } from "react-icons/fi";
import { Form } from "react-bootstrap";
import api from "../../../config/AxiosInterceptor";
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function SubscriptionPage() {

  const navigate = useNavigate();
  const steps = ['registration', 'subscription', 'login', 'configure'];
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('subscription');
  const currentStepIndex = steps.indexOf(activeTab);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [addonSelections, setAddonSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState({});
  const [userCounts, setUserCounts] = useState({});
  const [promoCodes, setPromoCodes] = useState({});
  const [userCountTotals, setUserCountTotals] = useState({});
  const [userIncreases, setUserIncreases] = useState({});
  const [propertyCounts, setPropertyCounts] = useState({});
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [promo, setPromo] = useState([]);

  const handleIncrease = (subscriptionId, moduleId, addonUserRate) => {
    setUserIncreases(prev => {
      const current = prev[subscriptionId]?.[moduleId] || 0;
      return {
        ...prev,
        [subscriptionId]: {
          ...prev[subscriptionId],
          [moduleId]: current + 1
        }
      };
    });
  };

  const handleDecrease = (subscriptionId, moduleId) => {
    setUserIncreases(prev => {
      const current = prev[subscriptionId]?.[moduleId] || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [subscriptionId]: {
          ...prev[subscriptionId],
          [moduleId]: current - 1
        }
      };
    });
  };




  useEffect(() => {
    fetchSubscriptionData();
  }, [])


  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/subscription");
      const list = response.data.list;

      const totals = {};
      list.forEach(subscription => {
        const total = (subscription.subscriptionModuleList || []).reduce(
          (sum, module) => sum + (module.userCount || 0),
          0
        );
        totals[subscription.subscriptionId] = total;
      });

      setSubscriptionData(list);
      setUserCountTotals(totals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const handleApplyPromo = async (subscriptionId) => {
    try {
      const response = await api.post(`/subscription/checkpromo/${promoCodes[subscriptionId]}`);
      const promoData = response.data.data;

      if (promoData.subscriptionId === subscriptionId) {
        setPromo(promoData);
        toast.success("Promo code applied successfully!");
      } else {
        toast.error("Invalid promo code for this plan.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong applying the promo.");
    }
  };



  const handleAddonToggle = (subscriptionId, moduleName) => {
    setAddonSelections((prev) => {
      const current = prev[subscriptionId] || {};
      const updated = { ...current, [moduleName]: !current[moduleName] };

      return { ...prev, [subscriptionId]: updated };
    });
  };



  useEffect(() => {
    const initialCounts = {};
    subscriptionData.forEach(subscription => {
      subscription.subscriptionModuleList.forEach(module => {
        if (!initialCounts[subscription.subscriptionId]) {
          initialCounts[subscription.subscriptionId] = {};
        }
        initialCounts[subscription.subscriptionId][module.moduleId] = module.userCount;
      });
    });
    setUserCounts(initialCounts);
  }, [subscriptionData]);


  const handleIncrement = (subscriptionId) => {
    setPropertyCounts((prev) => ({
      ...prev,
      [subscriptionId]: (prev[subscriptionId] || 0) + 1,
    }));
  };

  const handleDecrement = (subscriptionId) => {
    setPropertyCounts((prev) => ({
      ...prev,
      [subscriptionId]: Math.max(0, (prev[subscriptionId] || 0) - 1),
    }));
  };


  return (
    <>
      <div className="p-3" style={{ backgroundColor: "#F0F0F0" }}>
        <ToastContainer />
        <div className="row ">
          <div className="col-md-12 w-100">
            <div className="stepper ">
              {steps.map((step, index) => {
                const isActive = activeTab === step;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step} className="step-wrapper">
                    <div
                      className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="step-circle">{index + 1}</div>
                      <div className="step-label">
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </div>
                      {index < steps.length - 1 && <div className="step-line"></div>}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        <div className="subscriptionBanner d-flex align-items-center justify-content-center gap-2">
          <div className="subscriptionHeading">Subscription Plans</div>
          <div className="subscriptionDescription text-center">Upgrade to access, User Roles and permission, Mobile accessibility, integration <br /> with AI Tools and Standard Customer support.</div>
        </div>

        <div className="subscription-container d-flex w-100">

          {selected && (
            <div className="payment-form animate-in">
              <h4 className="form-title">Complete Your Subscription</h4>
              <div className="selected-plan-summary mb-4">
                <p className="plan-name">{selected.name}</p>
                <p className="plan-price-tag">${selected.price}/month</p>
              </div>
              <form className="payment-form-fields">

                <div className="form-group">
                  <label className="floating-label">Card Number</label>
                  <input type="text" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="floating-label">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label className="floating-label">CVV</label>
                    <input type="text" required />
                  </div>
                </div>
                <button type="submit" className="payment-submit-btn">Pay ${selected.price}</button>
              </form>
            </div>
          )}

          <div className={`plansWrapper d-flex w-100 ${selected ? 'with-selection' : ''}`}>
            <div className={`row gap-3 w-100 justify-content-center ${selected ? 'compressed' : ''}`}>

              {loading ? (
                <div className="d-flex justify-content-center " style={{ height: '100vh', marginTop: '10%' }}>
                  <Spinner animation="grow" variant="secondary" size="sm" />
                  <Spinner animation="grow" variant="warning" />
                  <Spinner animation="grow" variant="secondary" size="sm" />
                  <Spinner animation="grow" variant="warning" />
                </div>
              ) : (

                subscriptionData.map((data) => {

                  const propertyCount = propertyCounts[data.subscriptionId] || 1;

                  const addonUserTotal = data.subscriptionModuleList?.reduce((total, module) => {
                    const count = userIncreases[data.subscriptionId]?.[module.moduleId] || 0;
                    return total + (count * module.addonUserRate);
                  }, 0);

                  const sum = (
                    data.subscriptionModuleList?.reduce((total, module) => {
                      const baseRate = Number(module.rate || 0);
                      return total + baseRate;
                    }, 0) +
                    data.addonMenuList?.reduce((total, addon) => {
                      const isSelected = addonSelections[data.subscriptionId]?.[addon.menuName];
                      return total + (isSelected ? Number(addon.addonRate || 0) : 0);
                    }, 0)
                  );

                  const finalAmountWithOutPromo = (sum + addonUserTotal) * propertyCount;

                  let finalAmount = finalAmountWithOutPromo;

                  if (data.subscriptionId === promo.subscriptionId) {
                    const discount = (finalAmountWithOutPromo * promo.discountPercent) / 100;
                    finalAmount = finalAmountWithOutPromo - discount;

                  }


                  return (
                    <div
                      key={data.subscriptionId}

                      className={`col-md-3 rounded bg-white d-flex align-items-start flex-column justify-content-between gap-2 p-3 ${selected?.subscriptionId === data.subscriptionId ? 'selected' : ''}`}
                      style={{ border: "0.01rem solid #FFC300", width: "30%" }}
                    >
                      <div className="d-flex align-items-start flex-column justify-content-between gap-2 w-100">
                        {selected?.subscriptionId === data.subscriptionId && (
                          <div className="tick-icon">
                            <FiCheck />
                          </div>
                        )}

                        <div className="d-flex flex-column  w-100">
                          <span className="plan-price">
                            <div>
                              <span className="price">₹{finalAmount.toFixed(2)}</span>
                              <span className="per-month">/month</span>

                            </div>
                            <div className="fw-bold primaryColor">
                              {selectedOffers[data.subscriptionId] && (
                                selectedOffers[data.subscriptionId]
                              )}
                              {promo.offerName}
                            </div>
                          </span>
                          <div className=" d-flex align-items-end gap-2">
                            <div className="fw-bold fs-1">{data.subscriptionName}</div>
                            <div className="mb-2">Total Users Included in Plan: <span className="text-success fw-bold">{userCountTotals[data.subscriptionId]}</span> </div>
                          </div>
                        </div>

                        <div className="w-100">
                          <div className="fw-bold">This Plan Includes :</div>
                          <table className="tbl w-100">
                            <thead className="primaryColor">
                              <tr>
                                <th>Module</th>
                                <th className="text-center">Menu</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.basicMenuList?.map((module, index) => (
                                <tr key={index}>
                                  <td className="d-flex align-items-center gap-2">

                                    <span className="iconText">{module.modulename}</span>
                                  </td>
                                  <td className="text-center"> {module.menuName}</td>
                                  <td> <div className="icon-wrapper d-flex align-items-center justify-content-center">
                                    <FiCheck color="green" size={20} />
                                  </div></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>



                        <div className="accordion accordion-flush w-100" id="accordionFlushExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingOne">
                              <button
                                className={`accordion-button fw-bold p-1 ${openAccordionId === data.subscriptionId ? 'border-b-1 bg-white outline-0' : 'collapsed outline-0'}`}
                                type="button"
                                onClick={() =>
                                  setOpenAccordionId(prev => prev === data.subscriptionId ? null : data.subscriptionId)
                                }
                              >
                                Add On
                              </button>
                            </h2>

                            <div
                              className={`accordion-collapse collapse ${openAccordionId === data.subscriptionId ? 'show' : ''}`}
                            >
                              <div className="accordion-body px-2 py-3 d-flex flex-column gap-4">

                                <div className="w-100">
                                  <div className="fw-bold">Add Features :</div>
                                  <table className="tbl w-100">
                                    <thead className="primaryColor">
                                      <tr>
                                        <th>Module</th>
                                        <th className="text-center">Menu</th>
                                        <th>Rate</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data.addonMenuList?.map((module, index) => (
                                        <tr key={index}>
                                          <td className="d-flex align-items-center gap-2">
                                            <span className="iconText small">{module.modulename}</span>
                                          </td>
                                          <td className="text-center">{module.menuName}</td>
                                          <td>₹{module.addonRate}</td>
                                          <td className="text-center">

                                            <Form.Check
                                              type="switch"
                                              id={`custom-switch-${data.subscriptionId}-${index}`}
                                              className="custom-switch"
                                              checked={!!addonSelections[data.subscriptionId]?.[module.menuName]}
                                              onChange={() => handleAddonToggle(data.subscriptionId, module.menuName)}
                                            />

                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="w-100">
                                  <div className="fw-bold">Add on User :</div>
                                  <table className="tbl w-100">
                                    <thead className="primaryColor">
                                      <tr>
                                        <th>Module</th>
                                        <th className="text-center">Person Rate</th>
                                        <th className="text-center">Count</th>
                                        <th className="text-center">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data.subscriptionModuleList?.map((module, index) => (
                                        <tr key={index}>
                                          <td className="d-flex align-items-center gap-2">

                                            <span className="iconText small">{module.modulename}</span>
                                          </td>
                                          <td className="text-center">₹{module.addonUserRate}</td>
                                          <td className="text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                              <button
                                                className={`${userIncreases[data.subscriptionId]?.[module.moduleId] <= 0 ? "disable-btn" : "normal-btn"}`}
                                                disabled={userIncreases[data.subscriptionId]?.[module.moduleId] <= 0}
                                                onClick={() => handleDecrease(data.subscriptionId, module.moduleId)}
                                              >-</button>
                                              <input
                                                type="text"
                                                readOnly
                                                value={userIncreases[data.subscriptionId]?.[module.moduleId] || 0}
                                                style={{ width: '2.5rem', textAlign: 'center' }}
                                              />
                                              <button
                                                className="normal-btn"
                                                onClick={() => handleIncrease(data.subscriptionId, module.moduleId, module.addonUserRate)}>+</button>
                                            </div>
                                          </td>
                                          <td className="text-center price">
                                            ₹{(userIncreases[data.subscriptionId]?.[module.moduleId] || 0) * module.addonUserRate}
                                          </td>

                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="w-100">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="fw-bold">Would you like to add more Properties ?</div>
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                      <button
                                        className="normal-btn"
                                        onClick={() => handleDecrement(data.subscriptionId)}
                                      >-</button>
                                      <input
                                        type="text"
                                        readOnly
                                        value={propertyCounts[data.subscriptionId] || 1}
                                        style={{ width: '2.5rem', textAlign: 'center' }}
                                      />
                                      <button
                                        className="normal-btn"
                                        onClick={() => handleIncrement(data.subscriptionId)}
                                      >+</button>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>

                          </div>
                        </div>

                        <div className="w-100">
                          <div className="fw-bold">Offers :</div>
                          <table className="tbl w-100">
                            <thead className="primaryColor">
                              <tr>
                                <th>Offer Name</th>
                                <th>Subscribe Month</th>
                                <th>Free Month</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.offerList
                                ?.filter(offer => offer.couponCode === null)
                                .map((offer, index) => (
                                  <tr key={index}>
                                    <td className="d-flex align-items-center gap-2">
                                      <span className="">{offer.offerName}</span>
                                    </td>
                                    <td className="text-center">{offer.subscribeMonths}</td>
                                    <td className="fw-bold text-center">{offer.freeMonths}</td>
                                    <td>
                                      <button
                                        className={` ${selectedOffers[data.subscriptionId] === offer.offerName ? 'selectedBtn' : 'unSelectedBtn'}`}
                                        onClick={() =>
                                          setSelectedOffers((prev) => ({
                                            ...prev,
                                            [data.subscriptionId]: offer.offerName
                                          }))
                                        }
                                      >
                                        Apply
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="w-100 px-2">
                          <div className="fw-bold">Promo :</div>
                          <div className="promo-code-box  d-flex  gap-2 align-items-center justify-content-between w-100">
                            <div className="primaryColor fw-bold">Enter Promo Code</div>
                            <div className="d-flex">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Promo Code"
                                value={promoCodes[data.subscriptionId] || ""}
                                onChange={(e) =>
                                  setPromoCodes((prev) => ({
                                    ...prev,
                                    [data.subscriptionId]: e.target.value
                                  }))
                                }
                              />
                            </div>
                            <button className="normal-btn mr-3" onClick={() => handleApplyPromo(data.subscriptionId)}>
                              Apply
                            </button>
                          </div>

                        </div>

                      </div>



                      <button className="plan-button">
                        {selected?.subscriptionId === data.subscriptionId ? "Selected" : "Choose Plan"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </>
  );
}
