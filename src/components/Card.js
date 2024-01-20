import React from "react";

function Card({hitType, number, packet}) {
  return (
    <div
      className="w-72 h-80 relative"
      style={{
        margin: "auto", // Set the margin to auto to center the card
      }}
    >
      <div className="w-72 h-80 mt-5 absolute bg-white rounded-lg shadow-lg hover:shadow-2xl">
        <div className="mt-5 absolute text-center text-black text-xl font-medium w-full">
          {hitType}
        </div>
        <div className="w-44 h-44 left-14 top-20 absolute flex justify-center items-center">
          <div className="w-44 h-44 relative flex flex-col justify-start items-start">
            <div className="w-44 h-44 relative flex justify-center items-center bg-[#CDDEFF] rounded-full">
              <div className="text-center text-black text-2xl font-normal">
                <span>{number}</span>
                <br />
                <span>{packet}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
