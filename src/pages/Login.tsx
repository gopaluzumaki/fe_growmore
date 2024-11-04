import { icon_password, icon_username, signuplogo_light } from "../assets";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import TextInput from "../components/TextInput";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const [showPasswd, setShowPasswd] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginUser({ usr: username, pwd: password });
    if (res) {
      navigate("/overview");
    }
  };

  return (
    <div className="bg-signup-bg w-full h-screen">
      <div className="max-w-[1400px] mx-auto py-5 pb-16 px-4">
        <div className="flex flex-col items-center gap-4 my-8">
          <img src={signuplogo_light} alt="SignupLogoLight" />
          <p className="text-burlywood text-[30px] font-semibold">
            Login to Grow & More
          </p>
        </div>
        <div className="bg-white max-w-[687px] mx-auto p-3 px-8 rounded-2xl">
          <div className="mt-8">
            <TextInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              label="Username"
              name="username"
              placeholder="Username"
              icon={icon_username}
            />
          </div>
          <div className="mt-8">
            <div className="flex justify-between">
              <p className="mb-1.5 ml-1 font-medium text-gray-700">
                <label htmlFor="passwd">Password</label>
              </p>
              <p className="text-burlywood mr-1">
                <Link to={"/forget-password"}>Forget Password</Link>
              </p>
            </div>
            <div className="flex items-center gap-3 p-2.5 bg-brightgray rounded-md overflow-hidden">
              <img src={icon_password} alt="iconImg" />
              <input
                className="w-full bg-brightgray outline-none"
                type={`${showPasswd ? "text" : "password"}`}
                id="passwd"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="inline-flex items-center my-6 ml-1">
            <label
              className="flex items-center cursor-pointer relative"
              htmlFor="remember"
            >
              <input
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-burlywood checked:border-burlywood"
                id="remember"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            <label
              className="cursor-pointer ml-3 mt-[1px] text-slate-600 text-[15px]"
              htmlFor="remember"
            >
              Remember Me
            </label>
          </div>
          <div className="mt-2">
            <PrimaryButton title="Log In" onClick={handleLogin} />
          </div>
          <div className="my-5">
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
              to={"/signup"}
              className="text-sonicsilver text-sm text-center"
            >
              Do not have an account?
              <span className="text-burlywood ml-1.5 cursor-pointer">
                Register
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
