import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { deleteProperty } from "../api";

type PropertyCardProps = {
  name: string;
  location: string;
  units: string;
  availUnits: string | string[];
  img: string | ReactNode;
  path?: string;
  getData?: any;
  id?: string;
  setError?:any;
};

const PropertyCard = ({
  name,
  location,
  units,
  availUnits,
  img,
  path,
  getData,
  id,
  setError
}: PropertyCardProps) => {
  console.log('asdas', availUnits)
  return (
    <main>
      <div className="overflow-hidden max-w-[330px]">
        <div>
          <img
            className="w-full max-w-full rounded-md"
            src={img as string}
            alt="propertyImg"
          />
        </div>
        <div className="my-3 ml-1">
          <p>
            <span>Property Name : </span>{" "}
            <span className="font-semibold">{`${name}`}</span>
          </p>
          <p>
            <span>Location : </span>{" "}
            <span className="font-semibold">{`${location}`}</span>
          </p>
          <p>
            <span>No of Units : </span>{" "}
            <span className="font-semibold">{`${units}`}</span>
          </p>
          {/* <p>
            <span>Units Available : </span>{" "}
            <span className="font-semibold">{`${
              availUnits === null ? "N/A" : availUnits
            }`}</span>
          </p> */}
        </div>
        <div className="flex mx-1 mb-3">
          <Link
            className="w-full text-center py-1.5 rounded-md text-[#0E0F11] bg-[#F7F7F7] border border-burlywood mr-2"
            to={path as string}
          >
            View Details
          </Link>
          <button
            className="w-full text-center py-1.5 rounded-md text-[#0E0F11] bg-[#F7F7F7] border border-burlywood"
            onClick={async () => {
               try {
                              await deleteProperty(id)
                            }
                            catch (e) {
                              setError(`Cannot delete ${name} because it is linked`)
                              console.log(e?.response?.data?._server_messages)
                            }
                            getData()
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </main>
  );
};

export default PropertyCard;
