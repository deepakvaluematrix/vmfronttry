import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoEllipse } from "react-icons/io5";
import { blueGrey, grey } from "@mui/material/colors";

const Tabs = ({ setIndex, length0, length1, length2 }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    setIndex(() => index);
  };

  const iconColor = "gray";

  return (
    <div>
      <div className="py-2 px-1  flex ml-2">
        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3 cursor-pointer ${
            activeTab === 0
              ? "border-b-[3px] border-green-400 font-bold"
              : "hover:bg-gray-100 hover:font-bold"
          }`}
          onClick={() => handleTabClick(0)}
        >
          <span className="ml-3">Today</span>
          <div className="ml-3 mr-2 relative icon-container">
            <IoEllipse size={29} color={iconColor} />
            <span
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl"
              style={{ fontSize: "12px" }}
            >
              {length0}
            </span>
          </div>
        </p>

        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3  cursor-pointer ${
            activeTab === 1
              ? "border-b-[3px] border-green-400 font-bold"
              : "hover:bg-gray-100 hover:font-bold"
          }`}
          onClick={() => handleTabClick(1)}
        >
          <span className="ml-3">Upcoming</span>
          <div className="ml-2 mr-2 relative icon-container">
            <IoEllipse size={29} color={iconColor} />
            <span
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl"
              style={{ fontSize: "12px" }}
            >
              {length1}{" "}
            </span>
          </div>
        </p>
        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3  cursor-pointer ${
            activeTab === 2
              ? "border-b-[3px] border-green-400 font-bold"
              : "hover:bg-gray-100 hover:font-bold"
          }`}
          onClick={() => handleTabClick(2)}
        >
          <span className="ml-3">Completed</span>
          <div className="ml-2 mr-2 relative icon-container">
            <IoEllipse size={29} color={iconColor} />
            <span
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl"
              style={{ fontSize: "12px" }}
            >
              {length2}
            </span>
          </div>
        </p>
      </div>
    </div>
  );
};

export default Tabs;
