import * as React from 'react';

function Turbo(properties: React.SVGProps<SVGSVGElement>) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.0723 15.5H40.7376L35.5947 27.0714H41.041L27.9294 49.5484V33.9286H24.0723V15.5ZM27.0723 18.5V30.9286H30.9294V38.4516L35.8179 30.0714H30.9784L36.1213 18.5H27.0723Z"
        fill="white"
      />
    </svg>
  );
}

const TurboIcon = React.memo(Turbo);
export default TurboIcon;
