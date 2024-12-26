import * as React from 'react';

function Card(properties: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" {...properties}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M9 13.4997C6.51472 13.4997 4.5 15.5144 4.5 17.9997V42.7497C4.5 45.235 6.51472 47.2497 9 47.2497H45C47.4853 47.2497 49.5 45.235 49.5 42.7497V17.9997C49.5 15.5144 47.4853 13.4997 45 13.4997H9ZM45 17.9997H9L9 42.7497H45V17.9997Z"
            fill="white" />
      <path
        d="M40.5 26.9994C40.5 25.7568 41.5074 24.7494 42.75 24.7494H47.25C48.4926 24.7494 49.5 25.7568 49.5 26.9994V33.7494C49.5 34.9921 48.4926 35.9994 47.25 35.9994H42.75C41.5074 35.9994 40.5 34.9921 40.5 33.7494V26.9994Z"
        fill="white" />
      <path
        d="M44.5516 11.2497L40.923 3.68273C39.8484 1.44179 37.1606 0.496282 34.9196 1.57089L14.7358 11.2497H25.1431L36.8654 5.62848L39.5609 11.2497H44.5516Z"
        fill="white" />
    </svg>
  );
}

const BalanceSvg = React.memo(Card);
export default BalanceSvg;
