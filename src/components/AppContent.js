import React from 'react';
import { Outlet } from 'react-router-dom';

const AppContent = () => {
  return (
    <main >
      <Outlet />
    </main>
  )
}

export default React.memo(AppContent)

