import { icon_password, signuplogo_light } from "../assets";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";

const ForgetPasswd = () => {
  const [showPasswd, setShowPasswd] = useState<boolean>(false);

  return (
    <div className="bg-signup-bg w-full h-screen">
      <div className="max-w-[1400px] mx-auto py-5 pb-16 px-4">
        <div className="flex flex-col items-center gap-4 my-8">
          <img src={signuplogo_light} alt="SignupLogoLight" />
          <p className="text-burlywood text-[30px] font-semibold">
            Forgot Password to Grow & More
          </p>
        </div>
        <div className="bg-white max-w-[687px] mx-auto p-3 pb-10 px-8 rounded-2xl">
          <div className="mt-8">
            <p className="mb-1.5 ml-1 font-medium text-gray-700">
              <label htmlFor="newPasswd">New Password</label>
            </p>
            <div className="flex items-center gap-3 p-2.5 bg-brightgray rounded-md overflow-hidden">
              <img src={icon_password} alt="iconImg" />
              <input
                className="w-full bg-brightgray outline-none"
                type={`${showPasswd ? "text" : "password"}`}
                id="newPasswd"
                name="newPassword"
                onChange={() => {}}
                placeholder="New Password"
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
          </div>
          <div className="mt-8">
            <p className="mb-1.5 ml-1 font-medium text-gray-700">
              <label htmlFor="confirmPasswd">Confirm Password</label>
            </p>
            <div className="flex items-center gap-3 p-2.5 bg-brightgray rounded-md overflow-hidden">
              <img src={icon_password} alt="iconImg" />
              <input
                className="w-full bg-brightgray outline-none"
                type={`${showPasswd ? "text" : "password"}`}
                id="confirmPasswd"
                name="confirmPassword"
                onChange={() => {}}
                placeholder="Confirm Password"
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
          </div>
          <div className="mt-8">
            <PrimaryButton title="Confirm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswd;
