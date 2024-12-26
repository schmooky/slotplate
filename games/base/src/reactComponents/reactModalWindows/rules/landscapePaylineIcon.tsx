import React from 'react';

interface LandscapePaylineIconProperties {
  payline: [number, number, number, number, number];
}

export const LandscapePaylineIcon: React.FC<LandscapePaylineIconProperties> = (
  properties: LandscapePaylineIconProperties,
) => (
  <svg
    width="267"
    height="160"
    viewBox="0 0 267 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: 'auto' }}
  >
    <rect
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="53.6694"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      y="107.34"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[0] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="53.6719"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="53.6719"
      y="53.6694"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="53.6719"
      y="107.34"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[1] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="107.348"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="107.348"
      y="53.6694"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="107.348"
      y="107.34"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[2] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="161.02"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="161.02"
      y="53.6694"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="161.02"
      y="107.34"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[3] === 2 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="214.695"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 0 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="214.695"
      y="53.6694"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 1 ? '#FFCC18' : '#808080'}
    />
    <rect
      x="214.695"
      y="107.34"
      width="51.8849"
      height="51.8807"
      rx="10"
      fill={properties.payline[4] === 2 ? '#FFCC18' : '#808080'}
    />
  </svg>
);
