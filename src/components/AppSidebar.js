import React, { useEffect, useState, useCallback } from 'react';
import {
  CCloseButton,
  CSidebar,
  CSidebarHeader,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { AppSidebarNav } from './AppSidebarNav';
import { useLocation } from 'react-router-dom';

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {
  const location = useLocation();
  const [authChannelsData, setAuthChannelsData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  useEffect(() => {
    const authChannels = JSON.parse(localStorage.getItem('authChannels'));

    if (authChannels && Array.isArray(authChannels) && authChannels.length > 0) {
      setAuthChannelsData(authChannels);

      const storedChannelId = localStorage.getItem('channelId');
      let initialChannel = authChannels[0];

      if (storedChannelId) {
        const foundChannel = authChannels.find(ch => ch.channelId === storedChannelId);
        if (foundChannel) {
          initialChannel = foundChannel;
        }
      }
      setSelectedChannel(initialChannel);
      localStorage.setItem('channelId', initialChannel.channelId);
      if (initialChannel.channelOutlets && initialChannel.channelOutlets.length > 0) {
        const storedOutletId = localStorage.getItem('currentOutletId');
        let initialOutlet = initialChannel.channelOutlets[0];

        if (storedOutletId) {
          const foundOutlet = initialChannel.channelOutlets.find(out => out.outletID === storedOutletId);
          if (foundOutlet) {
            initialOutlet = foundOutlet;
          }
        }
        setSelectedOutlet(initialOutlet);
        localStorage.setItem('currentOutletId', initialOutlet.outletID);
      } else {
        setSelectedOutlet(null);
        localStorage.removeItem('currentOutletId');
      }
    }
  }, []);

  useEffect(() => {
    const hiddenPaths = ['/table-management', '/order-management'];
    if (hiddenPaths.includes(location.pathname)) {
      setSidebarShow(false);
    }
  }, [location.pathname, setSidebarShow]);

  const handleChannelChange = useCallback((channel) => {
    setSelectedChannel(channel);
    localStorage.setItem('channelId', channel.channelId);

    if (channel.channelOutlets && channel.channelOutlets.length > 0) {
      const firstOutletOfNewChannel = channel.channelOutlets[0];
      setSelectedOutlet(firstOutletOfNewChannel);
      localStorage.setItem('currentOutletId', firstOutletOfNewChannel.outletID);
    } else {
      setSelectedOutlet(null);
      localStorage.removeItem('currentOutletId');
    }
  }, []);

  const handleOutletChange = useCallback((outlet) => {
    setSelectedOutlet(outlet);
    localStorage.setItem('currentOutletId', outlet.outletID);
  }, []);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={setSidebarShow}
    >
      <CSidebarHeader className="border-bottom d-flex flex-column align-items-start px-3 py-3">
        {authChannelsData.length > 0 && selectedChannel && (
          <CDropdown className="w-100 mb-2">
            <CDropdownToggle color="transparent" className="text-white w-100 text-start d-flex justify-content-between align-items-center p-0">
              <strong className="text-uppercase" style={{ fontSize: '1rem' }}>
                {selectedChannel.channelName}
              </strong>
            </CDropdownToggle>
            <CDropdownMenu className="w-100">
              {authChannelsData.map((channel) => (
                <CDropdownItem
                  key={channel.channelId}
                  onClick={() => handleChannelChange(channel)}
                  active={selectedChannel.channelId === channel.channelId}
                >
                  {channel.channelName}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        )}

        <CCloseButton
          className="d-lg-none position-absolute top-0 end-0 mt-2 me-2"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>

      {selectedChannel &&
        selectedChannel.channelOutlets &&
        selectedChannel.channelOutlets.length > 0 &&
        selectedOutlet && (
          <CDropdown className="w-100 px-3 pb-3">
            <CDropdownToggle color="transparent" className="text-white w-100 text-start d-flex justify-content-between align-items-center p-0">
              <span className="text-uppercase" style={{ fontSize: '0.9rem', cursor: "pointer" }}>
                {selectedOutlet.outletName}
              </span>
            </CDropdownToggle>
            <CDropdownMenu className="w-100">
              {selectedChannel.channelOutlets.map((outlet) => (
                <CDropdownItem
                  key={outlet.outletID}
                  onClick={() => handleOutletChange(outlet)}
                  active={selectedOutlet.outletID === outlet.outletID}
                  style={{ cursor: "pointer" }}
                >
                  {outlet.outletName}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        )}

      <AppSidebarNav
        modules={selectedChannel?.subscriptionModules || []}
        selectedOutlet={selectedOutlet}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
