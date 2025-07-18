import React, { useState } from 'react'
import { COffcanvas } from "@coreui/react";
import LeftPart from './LeftPart';
import RightPart from './RightPart';
import MiddlePart from './MiddlePart';

const AllTransfer = ({ facility }) => {
  const [visible, setVisible] = useState(true);

  return (
    <COffcanvas
      placement="top"
      visible={visible}
      onHide={() => setVisible(false)}
      backdrop={true}
      scroll={true}
      style={{ height: "90vh", marginTop: "3vh", maxWidth: "85vw", margin: "3vh auto" }}
      className="rounded shadow border"
    >
      <LeftPart />
      <MiddlePart />
      <RightPart facility={facility} />
    </COffcanvas>
  )
}

export default AllTransfer;
