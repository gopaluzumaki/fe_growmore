import { GoBell } from "react-icons/go";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import { DemoAvtar } from "../assets";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProfileData } from "../api";
interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  contactNo: string;
  Dob: string;
  Address: string;
  city: string;
  country: string;
  imageAttachment?: File;
}
const Header = (props) => {
  const [formData, setFormData] = useState<FormData>();
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
          const getData = async () => {
              const res = await fetchProfileData()
              const item = res?.data?.data[2]
              if (item) {
                  setFormData((prevData) => {
                      return {
                          ...prevData,
                          firstName: item?.first_name,
                          lastName: item?.last_name,
                      };
                  });
                  setImgUrl(item?.image || "");
  
              }
          }
          getData()
      }, [props.load])
  return (
    <main>
      <div className="">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-5">
              <span className="text-burlywood">{props.name}</span>
            </h2>
          </div>
          <div className="flex gap-6 items-center">
            <p>
              <IoIosSearch size={27} className="cursor-pointer" />
            </p>
            <p>
              <GoBell size={26} className="cursor-pointer" />
            </p>
            <Link to={"/profile"}
            >
              <div className="flex gap-2 items-center cursor-pointer">

                <span>
                  <img src={imgUrl
                    ? `https://propms.erpnext.syscort.com/${imgUrl}`
                    : DemoAvtar} alt="DemoAvtar" style={{ height: '32px', width: '32px', borderRadius: '16px' }} />
                </span>
                <span className="text-[18px] font-normal">{formData?.firstName} {formData?.lastName}</span>
                <span>
                  <IoIosArrowDown />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Header;
