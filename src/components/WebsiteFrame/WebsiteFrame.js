import React from 'react';
import PercentRadii from 'containers/PercentRadii/PercentRadii';
import './WebsiteFrame.scss';

const WebsiteFrame = (props) => {
  const dotColor = props.dotColor || '#fff';
  const frameColor = props.frameColor || '#D8D8D8';

  return (
    <PercentRadii className="websiteFrame" percent={0.66}>
      <svg viewBox="0 0 632 20" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <path fill={frameColor} d="M0 0h632v20H0z" />
        <circle fill={dotColor} cx="10" cy="10" r="2.75" />
        <circle fill={dotColor} cx="21" cy="10" r="2.75" />
        <circle fill={dotColor} cx="32" cy="10" r="2.75" />
      </svg>
      {props.children}
    </PercentRadii>
  );
};

export default WebsiteFrame;
