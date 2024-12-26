import * as React from 'react';

function Menu(properties: React.SVGProps<SVGSVGElement>) {
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
        d="M18.4995 41V38H45.4995V41H18.4995ZM18.4995 33.5V30.5H45.4995V33.5H18.4995ZM18.4995 26V23H45.4995V26H18.4995Z"
        fill="white"
      />
    </svg>
  );
}

const MenuIcon = React.memo(Menu);
export default MenuIcon;
