import { ReactNode } from "react";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { deleteBooking, deleteOwner } from "../api";

type OwnerCardProps = {
  name: string;
  contact: string;
  email: string;
  totalProperty: string;
  totalUnit: string;
  location: string;
  img: string | ReactNode;
  redirect: string;
  getData?: any;
  setError?: any;
  name1?:string;
  // name1?:string;
};

const OwnerCard = ({
  name,
  name1,
  // location,
  // name1,
  img,
  contact,
  email,
  totalProperty,
  totalUnit,
  redirect,
  getData,
  setError
}: OwnerCardProps) => {
  console.log(name1,"vgh")
  const formatEmail = (email) => {
    if (email?.length > 50) {
      const firstPart = email.slice(0, 5);
      const lastPart = email.slice(-5);
      return `${firstPart}...${lastPart}`;
    }
    return email;
  };
  return (
    <main>
      <div className="border border-[#E6EDFF] p-3 px-4 rounded-md">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            {/* <img className="rounded-md" src={img as string} alt="propertyImg" /> */}

            <p className="text-[20px] font-semibold">{name}</p>
          </div>
          <div>
            <Link to={redirect === "booking"?`/${redirect}/edit/${name}`:`/${redirect}/edit/${name1}`} state={redirect === "booking"?name:name1}>
              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 mr-1 rounded cursor-pointer">
                <MdOutlineEdit size={20} className="text-[#D09D4A]" />
              </button>
            </Link>
            <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
              try {
                setError&&setError("")
                const confirmed = window.confirm(`Are you sure you want to delete this ${name}?`);
                if (confirmed) {
                  redirect === "booking" ? await deleteBooking(name) : await deleteOwner(name1)
                }

              }
              catch (e) {
                setError(`Cannot delete ${name} because it is linked`)
                console.log(e?.response?.data?._server_messages)
              }
              getData()
            }}>
              <MdDeleteForever
                size={20}
                className="text-[#EB4335]"
              />
            </button>
          </div>
        </div>
        <div className="text-[15px] flex flex-col mx-2 my-4 mt-2">
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Contact Number :</span>
            <span className="font-semibold">{contact}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Email :</span>
            <span className="font-semibold">{formatEmail(email)}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Total Property Number :</span>
            <span className="font-semibold">{totalProperty}</span>
          </p>
          <p className="flex gap-2 py-3 border-b border-[#E6EDFF]">
            <span className="text-sonicsilver">Total Unit Number :</span>
            <span className="font-semibold">{totalUnit}</span>
          </p>
          {/* <p className="flex gap-2 py-3">
            <span className="text-sonicsilver">Location :</span>
            <span className="font-semibold">{location}</span>
          </p> */}
        </div>
        {/* <div className="flex mx-1 mb-3">
          <Link
            className="w-full text-center py-1.5 rounded-md text-[#0E0F11] bg-[#F7F7F7] border border-burlywood"
            to={``}
          >
            View Details
          </Link>
        </div> */}
      </div>
    </main>
  );
};

export default OwnerCard;
