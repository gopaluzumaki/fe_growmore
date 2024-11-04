import { ReactNode } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";

type OwnerCardProps = {
  name: string;
  contact: string;
  email: string;
  totalProperty: string;
  totalUnit: string;
  location: string;
  img: string | ReactNode;
};

const OwnerCard = ({
  name,
  location,
  img,
  contact,
  email,
  totalProperty,
  totalUnit,
}: OwnerCardProps) => {
  return (
    <main>
      <div className="border border-[#E6EDFF] p-3 px-4 rounded-md">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <img className="rounded-md" src={img as string} alt="propertyImg" />
            <p className="text-[20px] font-semibold">{name}</p>
          </div>
          <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 mr-1.5 rounded cursor-pointer">
            <MdOutlineEdit size={20} className="text-[#D09D4A]" />
          </button>
        </div>
        <div className="text-[15px] flex flex-col mx-2 my-4 mt-2">
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Contact Number :</span>
            <span className="font-semibold">{contact}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Email :</span>
            <span className="font-semibold">{email}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Total Property Number :</span>
            <span className="font-semibold">{totalProperty}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Total Unit Number :</span>
            <span className="font-semibold">{totalUnit}</span>
          </p>
          <p className="flex gap-2 py-3">
            <span className="text-sonicsilver">Location :</span>
            <span className="font-semibold">{location}</span>
          </p>
        </div>
        <div className="flex mx-1 mb-3">
          <Link
            className="w-full text-center py-1.5 rounded-md text-[#0E0F11] bg-[#F7F7F7] border border-burlywood"
            to={``}
          >
            View Details
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OwnerCard;
