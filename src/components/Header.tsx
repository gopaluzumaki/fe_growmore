import { GoBell } from "react-icons/go";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import { DemoAvtar } from "../assets";

const Header = () => {
  return (
    <main>
      <div className="my-5 px-2">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl font-semibold">
              Welcome Back, <span className="text-burlywood"> Grow & More</span>
            </h2>
            <p className="text-[#7C8DB5] mt-1.5 ml-1">
              Here is the information about all your Property
            </p>
          </div>
          <div className="flex gap-6 items-center">
            <p>
              <IoIosSearch size={27} className="cursor-pointer" />
            </p>
            <p>
              <GoBell size={26} className="cursor-pointer" />
            </p>
            <div className="flex gap-2 items-center cursor-pointer">
              <span>
                <img src={DemoAvtar} alt="DemoAvtar" />
              </span>
              <span className="text-[18px] font-normal">Marci Fumons</span>
              <span>
                <IoIosArrowDown />
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Header;
