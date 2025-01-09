import React, { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | ReactNode;
  bgLight?: boolean;
  borderd?: boolean;
  warning?: any;
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
    disabled = false,
    min,
    max,
    required = false,
    readOnly = false,
    warning,
  }) => {
    console.log(warning, "nmk");
    return (
      <div>
        {label && (
          <p className="flex  mb-1.5 ml-1 font-medium text-gray-700">
            <label htmlFor={id}>{label}</label>
            {required && (
              <label>
                <span style={{ color: "red" }}>*</span>
              </label>
            )}
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
            readOnly={readOnly}
            required={required}
            disabled={disabled}
            className={`w-full ${
              bgLight ? "bg-white" : "bg-brightgray"
            } outline-none`}
            type={type}
            id={id}
            name={name}
            value={value}
            min={min}
            max={max}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
        {warning && (
          <p className="flex  mb-1.5 ml-1 font-medium text-gray-700">
            <label htmlFor={id} style={{ color: "red" }}>
              {warning}
            </label>
          </p>
        )}
      </div>
    );
  }
);

export default Input;
