import React, { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | ReactNode;
  bgLight?: boolean;
  borderd?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    id,
    type = "text",
    value,
    onChange,
    name,
    placeholder,
    icon,
    bgLight,
    borderd,
  }) => {
    return (
      <div>
        {label && (
          <p className="mb-1.5 ml-1 font-medium text-gray-700">
            <label htmlFor={id}>{label}</label>
          </p>
        )}
        <div
          className={`flex items-center gap-3 p-2.5 ${
            bgLight ? "bg-white" : "bg-brightgray"
          } ${
            borderd && "border border-[#CCDAFF]"
          }   rounded-md overflow-hidden`}
        >
          {icon && <img src={icon as string} alt="iconImg" />}
          <input
            className={`w-full ${
              bgLight ? "bg-white" : "bg-brightgray"
            } outline-none`}
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }
);

export default Input;
