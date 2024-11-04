// src/components/CustomTable.tsx
import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { img_group } from "../assets";

// Define a data type for your table data
export interface Property {
  property?: string;
  unit_number?: string;
  location?: string;
  unit_owner?: string;
  tenantName?: string;
  status?: "Rented" | "Available" | "Legal Case";
  image?: string; // URLs or paths to images
}

// Define a type for the props
interface CustomTableProps {
  headers: string[]; // An array of header names
  data: Property[]; // An array of Property objects
}

const CustomTable: React.FC<CustomTableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-sonicsilver text-center">
            {headers.map((header, index) => (
              <th key={index} className="p-2 py-3 font-normal">
                {header}
              </th>
            ))}
            <th className="p-2 py-3 font-normal"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => {
            console.log(item);

            return (
              <tr key={i} className="hover:bg-gray-50 text-center text-[15px]">
                <td className="p-2 py-3">{i + 1}</td>
                <td className="p-2 py-3">{item.property}</td>
                <td className="p-2 py-3">{item.unit_number}</td>
                <td className="p-2 py-3">{item.location}</td>
                <td className="p-2 py-3">{item.unit_owner}</td>
                <td className="p-2 py-3">{item.tenantName}</td>
                <td className="p-2 py-3">
                  <div
                    className={`p-1 rounded ${
                      item.status === "Rented"
                        ? "bg-[#FFEC1C] text-black"
                        : item.status === "Available"
                        ? "bg-[#34A853] text-white"
                        : "bg-[#EB4335] text-white"
                    }`}
                  >
                    {item.status}
                  </div>
                </td>
                <td className="p-2 py-3">
                  <div className="flex justify-center">
                    {/* 
                  {item.images?.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt="property"
                      className="w-10 h-10 object-cover"
                    />
                  ))}
                  */}
                    <img src={img_group} />
                  </div>
                </td>
                <td className="p-2 py-3">
                  <div className="flex gap-3">
                    <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                      <MdOutlineEdit size={20} className="text-[#D09D4A]" />
                    </button>
                    <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                      <MdDeleteForever size={20} className="text-[#EB4335]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
