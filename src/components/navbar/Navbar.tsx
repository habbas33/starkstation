
import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineLocalGasStation } from "react-icons/md";
// import { AiOutlineClose, AiOutlineLogin, AiOutlineLogout, AiOutlineUser, AiOutlineCopy } from "react-icons/ai";
// import imageToAdd1 from "../../assets/Logos/KP Logo White.png";
// import { ProfileContext } from "../../context/ProfileContext";
// import { menuItems } from "../../constants/menuItems";
import { NavLink } from "react-router-dom";

export default function Navbar() {

  return (
    <nav className="w-full ">
        <div className="flex justify-start items-center">
          <NavLink to={`/`}>
            <div className="flex flex-initial justify-start items-center">
                <MdOutlineLocalGasStation fontSize={28} className="text-3xl text-white cursor-pointer"/>
                <h1 className="text-2xl text-white font-bold px-1">StarkStation</h1>
            </div>
          </NavLink>
      </div>
    </nav>
  );
}
