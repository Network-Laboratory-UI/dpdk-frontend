import React from "react";

const HomeCard = ({ id, name, status, location }) => {
  // Set a threshold for word length before truncating
  const maxWordLength = 31;

  // Truncate long words and add "..." if necessary, considering one newline character
  const truncateString = (str, max) => {
    if (str.length > max) {
      const truncated = str.slice(0, max);
      const lastSpaceIndex = truncated.lastIndexOf(" ");
      const lastNewlineIndex = truncated.lastIndexOf("\n");
      const indexToUse = Math.max(lastSpaceIndex, lastNewlineIndex, 0);
      return truncated.slice(0, indexToUse) + "...";
    }
    return str;
  };

    const maxWordTitleLength = 15;

    const truncateTitleString = (str, max) => {
      if (str.length > max) {
        return str.slice(0, max) + "...";
      }
      return str;
    };

  return (
    <div className="w-[300px] h-[300px] relative">
      <div className="border border-white rounded-[10px] shadow-xl hover:shadow-2xl p-4">
        <div className="w-[300px] h-[300px] bg-transparent rounded-[10px]"></div>
        <div className="mt-5 absolute text-black text-[22px] font-medium font-['Helvetica'] left-[30px] top-4">
          Policy Server
        </div>
        <div className="w-[74px] h-5 left-[30px] top-[280px] absolute">
        <div
            style={{
              backgroundColor: status === "Active" ? "#E2FBD7" : "#FBD7D7", borderRadius:'3px', padding:'5px'
            }}
            className="items-center text-center text-sm font-['Helvetica'] font-normal"
          > {status}</div>
         
        </div>
        {/* Removed the SVG section */}
        <div className="mt-4 text-black text-[32px] font-bold font-['Helvetica'] absolute left-[30px] top-[73px] whitespace-pre-line">
          {truncateTitleString(name, maxWordTitleLength)}
        </div>
        <div className="mt-10 text-gray-700 text-base font-normal font-['Helvetica'] leading-normal absolute left-[30px] top-[170px] italic whitespace-pre-line">
          Location: {truncateString(location, maxWordLength)}
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
