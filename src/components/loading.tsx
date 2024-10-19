import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className=" h-[100vh] flex justify-center items-center relative z-[99]">
      <div className=" relative">
        <svg
          className="loading"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 187.3 93.7"
          height="80vh"
          width="80vh"
        >
          <path
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            stroke-miterlimit="10"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="4"
            fill="none"
            id="outline"
            stroke="#05b330"
          ></path>
          <path
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            stroke-miterlimit="10"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="4"
            stroke="#05b330"
            fill="none"
            opacity="0.05"
            id="outline-bg"
          ></path>
        </svg>
        <div className="   w-full   absolute bottom-28  overflow-x-hidden px-10">
          <p className="text-gray-400 text-[10px] md:text-sm text-center ">
            Hello . Please wait, you will be entering the Zone shortly. Thank
            you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
