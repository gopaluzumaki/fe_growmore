import {
  icon_email,
  icon_fname,
  icon_lname,
  icon_password,
  icon_username,
  signuplogo_light,
} from "../assets";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import IconButton from "../components/IconButton";
import TextInput from "../components/TextInput";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPasswd, setShowPasswd] = useState<boolean>(false);

  return (
    <div className="bg-signup-bg w-full h-full">
      <div className="max-w-[1400px] mx-auto py-5 pb-16 px-4">
        <div className="flex flex-col items-center gap-4 my-8">
          <img src={signuplogo_light} alt="SignupLogoLight" />
          <p className="text-burlywood text-[30px] font-semibold">
            Register to Grow & More
          </p>
        </div>
        <div className="bg-white max-w-[687px] mx-auto p-3 px-8 rounded-2xl">
          <p className="text-burlywood text-center">Register with :</p>
          <div className="flex justify-between py-4">
            <IconButton title="Google" icon={<FaGoogle />} />
            <IconButton title="Facebook" icon={<FaFacebook size={18} />} />
            <IconButton title="Apple" icon={<FaApple size={20} />} />
          </div>
          <div className="flex justify-center items-center gap-2.5">
            <span className="basis-6/12 h-[1px] bg-[#00000014]" />
            <span className="text-burlywood text-sm">or</span>
            <span className="basis-6/12 h-[1px] bg-[#00000014]" />
          </div>
          <div className="flex gap-4 mt-3">
            <div className="basis-6/12">
              <TextInput
                type="text"
                id="fname"
                label="First Name"
                name="fname"
                placeholder="First Name"
                icon={icon_fname}
              />
            </div>
            <div className="basis-6/12">
              <TextInput
                type="text"
                id="lname"
                label="Last Name"
                name="lname"
                placeholder="Last Name"
                icon={icon_lname}
              />
            </div>
          </div>
          <div className="mt-3">
            <TextInput
              type="text"
              id="username"
              label="Username"
              name="username"
              placeholder="Username"
              icon={icon_username}
            />
          </div>
          <div className="mt-3">
            <TextInput
              type="text"
              id="email"
              label="Email"
              name="email"
              placeholder="Email"
              icon={icon_email}
            />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 ml-1 font-medium text-gray-700">
              <label htmlFor="passwd">Password</label>
            </p>
            <div className="flex items-center gap-3 p-2.5 bg-brightgray rounded-md overflow-hidden">
              <img src={icon_password} alt="iconImg" />
              <input
                className="w-full bg-brightgray outline-none"
                type={`${showPasswd ? "text" : "password"}`}
                id="passwd"
                name="password"
                onChange={() => {}}
                placeholder="Password"
              />
              {showPasswd ? (
                <IoEyeOutline
                  onClick={() => setShowPasswd((prev) => !prev)}
                  size={22}
                  className="cursor-pointer"
                />
              ) : (
                <IoEyeOffOutline
                  onClick={() => setShowPasswd((prev) => !prev)}
                  size={22}
                  className="cursor-pointer"
                />
              )}
            </div>
            <p className="mt-1.5 ml-1 font-medium text-sonicsilver text-[12px]">
              Minimum length is 8 characters.
            </p>
          </div>
          <div className="mt-4">
            <PrimaryButton title="Register" />
          </div>
          <div className="my-4">
            <p className="text-sonicsilver text-sm">
              By creating an account, you agree to the
              <span className="text-burlywood border-b border-burlywood pb-0.5 mx-1.5 cursor-pointer">
                Terms of Service.
              </span>
              We'll occasionally send you account-related emails.
            </p>
          </div>
          <div className="my-4 flex justify-center">
            <Link
              to={"/login"}
              className="text-sonicsilver text-sm text-center"
            >
              Already have an account?
              <span className="text-burlywood ml-1.5 cursor-pointer">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
