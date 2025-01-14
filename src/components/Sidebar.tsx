// src/components/Sidebar.js
import {
  FaRegMoneyBillAlt,
  FaRegAddressCard,
  FaRegClipboard,
  FaRegCalendarCheck,
  FaFileContract,
} from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { MdOutlineHomeWork,MdOutlineDriveFileMove, MdOutlineDriveFileMoveRtl,MdOutlineCases } from "react-icons/md";
import { TbHomeSignal } from "react-icons/tb";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiUserPin } from "react-icons/bi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { GMLogo } from "../assets";
import { Link, useLocation } from "react-router-dom";
import { GrHostMaintenance } from "react-icons/gr";
import { SiAuthelia } from "react-icons/si";
const Sidebar = () => {
  let { pathname } = useLocation();

  const sidebarItems = [
    { name: "Overview", icon: <BsBarChart size={22} />, path: "/overview" },
    {
      name: "Property",
      icon: <MdOutlineHomeWork size={25} />,
      path: "/property",
    },
    { name: "Units", icon: <TbHomeSignal size={25} />, path: "/units" },
    {
      name: "Customers",
      icon: <IoDocumentTextOutline size={25} />,
      path: "/tenants",
    },
    { name: "Owners", icon: <BiUserPin size={24} />, path: "/owners" },
    {
      name: "Transactions",
      icon: <FaRegMoneyBillAlt size={22} />,
      path: "/tran",
    },
    { name: "Leads", icon: <FaRegAddressCard size={22} />, path: "/leads" },
    {
      name: "Booking / Reservation",
      icon: <FaRegCalendarCheck size={22} />,
      path: "/booking",
    },
    {
      name: "Tenancy Contracts",
      icon: <FaFileContract size={22} />,
      path: "/contracts",
    },
    {
      name: "Cases",
      icon: <MdOutlineCases size={22} />,
      path: "/cases",
    },
    {
      name: "Move In",
      icon: <MdOutlineDriveFileMove size={22} />,
      path: "/movein",
    },
    {
      name: "Move Out",
      icon: <MdOutlineDriveFileMoveRtl size={22} />,
      path: "/moveout",
    },
    {
      name: "Maintenance",
      icon: <GrHostMaintenance size={22} />,
      path: "/maintenance",
    },
    {
      name: "Legal",
      icon: <SiAuthelia size={22} />,
      path: "/legal",
    },
    { name: "Profile", icon: <FaRegClipboard size={22} />, path: "/profile" },
    {
      name: "Settings",
      icon: <MdOutlineManageAccounts size={24} />,
      path: "/settings",
    },
  ];

  return (
    <main className="relative ">
      <div className="fixed inset-y-0 left-0 bg-white z-50 flex flex-col w-72 h-full overflow-auto">
        <div className="flex items-center justify-center my-10 mb-7">
          <img src={GMLogo} alt="GMLogo" />
        </div>
        <div className="flex-grow">
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center p-4 pl-8 cursor-pointer [&:nth-child(n+7):nth-last-child(n+8)]:ml-4 [&:nth-child(n+7):nth-last-child(n+8)]:py-2  [&:nth-child(n+11):nth-last-child(n+3)]:ml-4 [&:nth-child(n+11):nth-last-child(n+3)]:py-2   [&:nth-child(10)]:mt-2 [&:nth-child(6)]:pointer-events-none [&:nth-child(10)]:pointer-events-none [&:nth-child(16)]:pointer-events-none ${pathname.includes(item.path) ? "text-burlywood" : "text-Weldonblue"
                  } text-Weldonblue`}
              >
                <Link to={item.path} className="flex items-center w-full">
                  <span className="mr-5">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Sidebar;
