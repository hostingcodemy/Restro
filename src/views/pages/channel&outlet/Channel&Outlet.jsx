import { useEffect, useState } from 'react';
import { GrChannel } from "react-icons/gr";
import { BsTelephone } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa6";
import { TbTax } from "react-icons/tb";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoIosAperture } from "react-icons/io";
import 'src/index.css';
import { IoLocationOutline } from "react-icons/io5";
import api from '../../../config/AxiosInterceptor';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChannelOutlet = () => {
  const initialValues = {
    channel_name: "",
    channel_address: "",
    channel_phone: "",
    channel_email: "",
    channel_pan: "",
    channel_gstNo: "",
    outlet_name: "",
    outlet_sac: "",
    outlet_phone: "",
    outlet_email: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const banner = ["src/assets/login1.jpeg", "src/assets/logIn3.jpg", "src/assets/login.jpeg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const steps = ['registration', 'subscription', 'login', 'configure'];
  const [activeTab, setActiveTab] = useState('configure');



  useEffect(() => {
    let timeout;
    const cycleImages = () => {
      setFade(false);
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banner.length);
        setFade(true);
        timeout = setTimeout(cycleImages, 4500);
      }, 500);
    };

    cycleImages();

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateStepOne = () => {
    const {
      channel_name,
      channel_address,
      channel_phone,
      channel_email,
      channel_pan,
      channel_gstNo
    } = formValues;

    const newErrors = {};
    let isValid = true;

    const phoneRegex = /^[9876]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!channel_name) {
      isValid = false;
      newErrors.channel_name = "Channel name is required.";
      toast.error(newErrors.channel_name);
    } else if (!/^[a-zA-Z ]+$/.test(channel_name)) {
      isValid = false;
      newErrors.channel_name = "Name must contain only letters.";
      toast.error(newErrors.channel_name);
    }
    if (!channel_address) {
      isValid = false;
      newErrors.channel_address = "Channel Address is required.";
      toast.error(newErrors.channel_address);
    }
    if (!channel_phone) {
      isValid = false;
      newErrors.channel_phone = "Channel Phone is required.";
      toast.error(newErrors.channel_phone);
    } else if (!/^[0-9]{10}$/.test(channel_phone)) {
      isValid = false;
      newErrors.channel_phone = 'Phone must be 10 digits';
      toast.error(newErrors.channel_phone);
    }
    if (!channel_email) {
      isValid = false;
      newErrors.channel_email = "Email is required.";
      toast.error(newErrors.channel_email);
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(channel_email)) {
      isValid = false;
      newErrors.channel_email = "Email is invalid.";
      toast.error(newErrors.channel_email);
    }
    if (!channel_pan) {
      isValid = false;
      newErrors.channel_pan = "PAN is required.";
      toast.error(newErrors.channel_pan);
    } else if (!panRegex.test(channel_pan)) {
      isValid = false;
      newErrors.channel_pan = "Enter a valid PAN (e.g., ABCDE1234F).";
      toast.error(newErrors.channel_pan);
    }
    if (!channel_gstNo) {
      isValid = false;
      newErrors.channel_gstNo = "GST No is required.";
      toast.error(newErrors.channel_gstNo);
    } else if (!gstRegex.test(channel_gstNo)) {
      isValid = false;
      newErrors.channel_gstNo = "Enter a valid GST No (e.g., 22ABCDE1234F1Z5).";
      toast.error(newErrors.channel_gstNo);
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return isValid;
  };

  const validateForm = () => {
    const {
      outlet_name,
      outlet_sac,
      outlet_phone,
      outlet_email
    } = formValues;

    const newErrors = {};
    let isValid = true;

    const phoneRegex = /^[9876]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!outlet_name) {
      isValid = false;
      newErrors.outlet_name = "Outlet name is required.";
      toast.error(newErrors.outlet_name);
    } else if (!/^[a-zA-Z ]+$/.test(outlet_name)) {
      isValid = false;
      newErrors.outlet_name = "Name must contain only letters.";
      toast.error(newErrors.outlet_name);
    }
    if (!outlet_sac) {
      isValid = false;
      newErrors.outlet_sac = "SAC is required.";
      toast.error(newErrors.outlet_sac);
    }
    if (!outlet_phone) {
      isValid = false;
      newErrors.outlet_phone = "Outlet phone is required.";
      toast.error(newErrors.outlet_phone);
    } else if (!/^[0-9]{10}$/.test(outlet_phone)) {
      isValid = false;
      newErrors.outlet_phone = 'Phone must be 10 digits';
      toast.error(newErrors.outlet_phone);
    }
    if (!outlet_email) {
      isValid = false;
      newErrors.outlet_email = "Outlet email is required.";
      toast.error(newErrors.outlet_email);
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(outlet_email)) {
      isValid = false;
      newErrors.outlet_email = "Email is invalid.";
      toast.error(newErrors.outlet_email);
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (!validateStepOne()) return;

    setTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setTransitioning(false);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      channelName: formValues.channel_name,
      address: formValues.channel_address,
      phone: formValues.channel_phone,
      email: formValues.channel_email,
      pan: formValues.channel_pan,
      gstNo: formValues.channel_gstNo,
      outletName: formValues.outlet_name,
      outletPhone: formValues.outlet_phone,
      outletEmail: formValues.outlet_email,
      sac: formValues.outlet_sac
    };
    console.log(payload);

    try {
      const res = await api.post("/channels/addchanneloutlet", payload);

      if (res.data.isValid) {

      } else {
        setErrors({ Password: "Invalid credentials" });
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrors({ Password: "Login failed. Try again." });
    }
  };

  return (

    <div className='p-3'>
      <div className='row mb-3'>
        <div className='col-md-12 w-100'>
          <div className="stepper">
            {steps.map((step, index) => {
              const isActive = activeTab === step;
              const isCompleted = index < steps.indexOf(activeTab);

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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='row main-img-div' >
        <div className="col-md-9 rounded h-100" >
          <img
            style={{
              height: "100%",
              width: "100%",
              transition: "opacity 0.5s ease",
              opacity: fade ? 1 : 0
            }}
            src={banner[currentIndex]}
            alt=""
            className="rounded"
          />
        </div>
        <div className="col-md-3 d-flex align-items-end justify-content-center"
        >
          {step === 1 ? (
            <>
              <form
                className={`bg-white ${transitioning ? 'fade-out' : 'fade-in'} w-100 h-100  rounded p-3 d-flex flex-column align-items-center gap-4`}
                noValidate>
                <h2 className="mb-2 fw-bold fs-3">Create Channel</h2>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <GrChannel size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
         className={`custom-input `}
                    required
                    placeholder="Channel Name"
                    isInvalid={!!errors.channel_name}
                    isValid={formValues.channel_name && !errors.channel_name}

                    name="channel_name"
                    value={formValues.channel_name || ""}
 
                    onChange={(e) =>
                      handleChange("channel_name", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                  />
                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <BsTelephone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="tel"
                    name="channel_phone"
                    value={formValues.channel_phone || ""}

                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) handleChange("channel_phone", e.target.value);
                    }}
                    minLength={10}
                    maxLength={15}
                    autoComplete="off"
                    isInvalid={!!errors.channel_phone}
                    isValid={formValues.channel_phone && !errors.channel_phone}
                    placeholder="Phone Number"


                  />
                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <MdOutlineMailOutline size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="mail"
                    name="channel_email"
                    value={formValues.channel_email || ""}

                    onChange={(e) => handleChange("channel_email", e.target.value)}
                    autoComplete="off"
                    isInvalid={!!errors.channel_email}
                    isValid={formValues.channel_email && !errors.channel_email}
                    placeholder="Email Address"

                  />
                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <IoLocationOutline size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="text"
                    name="channel_address"
                    value={formValues.channel_address || ""}

                    onChange={(e) => handleChange("channel_address", e.target.value)}
                    autoComplete="off"
                    isInvalid={!!errors.channel_address}
                    isValid={formValues.channel_address && !errors.channel_address}
                    placeholder="Address"


                  />
                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <FaRegAddressCard size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="text"

                    name="channel_pan"
                    value={formValues.channel_pan || ""}

                    onChange={(e) =>
                      handleChange("channel_pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                    }
                    maxLength={10}
                    autoComplete="off"
                    isInvalid={!!errors.channel_pan}
                    isValid={formValues.channel_pan && !errors.channel_pan}
                    placeholder="Pan Number"

                  />
                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <TbTax size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="text"

                    name="channel_gstNo"
                    value={formValues.channel_gstNo || ""}

                    onChange={(e) =>
                      handleChange("channel_gstNo", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                    }
                    maxLength={15}
                    isInvalid={!!errors.channel_gstNo}
                    isValid={formValues.channel_gstNo && !errors.channel_gstNo}
                    placeholder="GST Number"
                    autoComplete="off"



                  />
                </InputGroup>

                <button type='button' className='submitBtnStyle' onClick={handleNextStep}>
                  Next
                </button>

              </form>
            </>
          ) : (
            <>
              <form
                className={` ${transitioning ? 'fade-out' : 'fade-in'} bg-white w-100 h-100  rounded p-3 d-flex flex-column align-items-center gap-4`}
                // className="fancy-form" 
                noValidate>
                <h2 className="mb-2 fw-bold fs-3">Create Outlet</h2>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <GrChannel size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}
                    type="text"

                    required
                    name="outlet_name"
                    isInvalid={!!errors.outlet_name}
                    isValid={formValues.outlet_name && !errors.outlet_name}
                    placeholder='Outlet Name'
                    value={formValues.outlet_name || ""}

                    onChange={(e) =>
                      handleChange("outlet_name", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }


                    autoComplete="off"
                  />

                </InputGroup>


                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <GrChannel size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}

                    type="text"
                    placeholder='Outlet Sac Code'
                    required
                    name="outlet_sac"
                    isInvalid={!!errors.outlet_sac}
                    isValid={formValues.outlet_sac && !errors.outlet_sac}

                    value={formValues.outlet_sac || ""}
                    onChange={(e) => handleChange("outlet_sac", e.target.value)}
                    autoComplete="off"

                  />

                </InputGroup>



                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <BsTelephone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}

                    type="phone"
                    placeholder='Outlet Phone Number'
                    required
                    name="outlet_phone"
                    isInvalid={!!errors.outlet_phone}
                    isValid={formValues.outlet_phone && !errors.outlet_phone}
                    value={formValues.outlet_phone || ""}
                    onChange={(e) => handleChange("outlet_phone", e.target.value)}
                    autoComplete="off"


                  />

                </InputGroup>

                <InputGroup hasValidation className="">
                  <InputGroup.Text>
                    <MdOutlineMailOutline size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                           className={`custom-input `}

                    type="email"
                    placeholder='Outlet Email'
                    required
                    name="outlet_email"
                    isInvalid={!!errors.outlet_email}
                    isValid={formValues.outlet_email && !errors.outlet_email}

                    value={formValues.outlet_email || ""}
                    onChange={(e) => handleChange("outlet_email", e.target.value)}
                    autoComplete="off"

                  />

                </InputGroup>

                <button type='button' className='submitBtnStyle' onClick={(e) => handleSubmit(e)}>
                  Submit
                </button>


              </form>

            </>
          )}

        </div>
      </div>
    </div>


  );
};

export default ChannelOutlet;








