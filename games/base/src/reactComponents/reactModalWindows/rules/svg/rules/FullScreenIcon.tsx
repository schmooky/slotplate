import * as React from 'react';

function FullScreen(properties: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...properties}
    >
      <rect width="64" height="64" rx="4" fill="#111314" />
      <path
        d="M21.5 42.5V35H24.5V39.5H29V42.5H21.5ZM21.5 29V21.5H29V24.5H24.5V29H21.5ZM35 42.5V39.5H39.5V35H42.5V42.5H35ZM39.5 29V24.5H35V21.5H42.5V29H39.5Z"
        fill="white"
      />
    </svg>
  );
}

const FullScreenIcon = React.memo(FullScreen);
export default FullScreenIcon;
