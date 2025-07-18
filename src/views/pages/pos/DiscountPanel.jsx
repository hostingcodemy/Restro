import {
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  COffcanvasTitle,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CButton
} from '@coreui/react';
import { useState } from 'react';
import Switch from 'react-switch'; // Optional: for prettier toggle

const DiscountModal = ({ show, onClose }) => {
  const [activeType, setActiveType] = useState("itemTypes");
  const [discount, setDiscount] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [selected, setSelected] = useState({
    itemTypes: [],
    subGroups: [],
    subCategories: [],
  });




  const data = {
    itemTypes: ['Veg', 'Non-Veg', 'Beverage'],
    subGroups: ['Pizza', 'Burger', 'Drinks'],
    subCategories: ['Soft Drinks', 'Mocktails', 'Juice'],
  };

  const handleCheckbox = (type, value) => {
    setSelected(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
  };

  const handleSave = () => {
    const payload = {
      ...selected,
      discount,
      isPercentage,
      remarks,
    };
    console.log("Saved Payload:", payload);
    onClose();
  };

  return (
    <COffcanvas placement="end" visible={show} onHide={onClose} backdrop={true}>
      <COffcanvasHeader>
        <COffcanvasTitle>Apply Discount</COffcanvasTitle>
      </COffcanvasHeader>
      <COffcanvasBody className="d-flex flex-column gap-3">

        <div className="d-flex justify-content-between mb-3">
          {["itemTypes", "subGroups", "subCategories"].map(type => (
            <button
              key={type}
              className={`btn btn-sm fw-semibold w-100 me-2 ${activeType === type ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              onClick={() => setActiveType(type)}
            >
              {type.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>

        <div className="border rounded p-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
          {data[activeType].map((item, idx) => (
            <CFormCheck
              key={idx}
              label={item}
              checked={selected[activeType].includes(item)}
              onChange={() => handleCheckbox(activeType, item)}
              className="mb-2"
            />
          ))}
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3">
          <CFormInput
            type="text"
            placeholder="Discount"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
          />
          <Switch
            checked={isPercentage}
            onChange={() => setIsPercentage(prev => !prev)}
            onColor="#ffc107"
            offColor="#ccc"
            checkedIcon={<div className="px-1 small text-dark">%</div>}
            uncheckedIcon={<div className="px-1 small text-dark">₹</div>}
            height={24}
            width={48}
          />
        </div>

        <CFormTextarea
          placeholder="Remarks"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          rows={2}
        />

        <div className="text-end">
          <CButton color="warning" onClick={handleSave}>Save</CButton>
        </div>

      </COffcanvasBody>
    </COffcanvas>
  );
};

export default DiscountModal;
