import React from 'react';

interface PortraitPaylineIconProperties {
  payline: [number, number, number, number, number];
}

export const PortraitPaylineIcon: React.FC<PortraitPaylineIconProperties> = (
  properties: PortraitPaylineIconProperties,
) => (
  <svg
    width="167"
    height="267"
    viewBox="0 0 167 267"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: 'auto' }}
  >
    <rect
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="53.6694"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="107.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="160.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="212.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 0 ? '#FFCC18' : '#808080'}
    />

    <rect
      x="56"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="56"
      y="53.6694"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="56"
      y="107.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="56"
      y="160.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="56"
      y="212.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 1 ? '#FFCC18' : '#808080'}
    />

    <rect
      x="112.348"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="112.348"
      y="53.6694"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="112.348"
      y="107.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 2 ? '#FFCC18' : '#808080'}
    />

    <rect
      x="112.348"
      y="160.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="112.348"
      y="212.34"
      width="53.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 2 ? '#FFCC18' : '#808080'}
    />
  </svg>
);
