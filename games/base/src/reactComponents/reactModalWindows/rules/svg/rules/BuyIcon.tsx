import * as React from 'react';

function Buy(properties: React.SVGProps<SVGSVGElement>) {
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
      <path d="M33.2858 32.0011H30.7144V39.7154H33.2858V32.0011Z" fill="white" />
      <path d="M35.8571 32.0011H38.4285V39.7154H35.8571V32.0011Z" fill="white" />
      <path d="M28.1427 32.0011H25.5713V39.7154H28.1427V32.0011Z" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.1732 18.6367L41.9283 26.8582H47.4284V29.4297H45.988L44.5648 40.5306C44.1535 43.7387 41.4228 46.1417 38.1884 46.1417H25.8111C22.5767 46.1417 19.846 43.7387 19.4347 40.5306L18.0115 29.4297H16.5713V26.8582H22.7146L28.4697 18.6367L30.5763 20.1113L25.8535 26.8582H38.7895L34.0667 20.1113L36.1732 18.6367ZM20.6039 29.4297H43.3955L42.0142 40.2036C41.7675 42.1285 40.129 43.5703 38.1884 43.5703H25.8111C23.8704 43.5703 22.232 42.1285 21.9852 40.2036L20.6039 29.4297Z"
        fill="white"
      />
    </svg>
  );
}

const BuyIcon = React.memo(Buy);
export default BuyIcon;
