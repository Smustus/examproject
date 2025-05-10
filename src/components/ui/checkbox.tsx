import React from "react";

type CustomCheckboxProps = {
  name: string;
  label: string | React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  description?: string;
};

export default function CustomCheckbox({
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  description,
}: CustomCheckboxProps) {
  const checkboxId = `custom-checkbox-${name}`;

  return (
    <div className={`relative flex items-center py-3 ${className || ""}`}>
      {/* <div className="pl-3 flex flex-col"> */}
      <label
        htmlFor={checkboxId}
        className={`
            font-semibold leading-5 flex items-center group
            ${
              disabled
                ? "text-gray-400"
                : `cursor-pointer ${
                    checked
                      ? "text-gray-900"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`
            }
          `}
      >
        <section className="flex items-center h-5 pr-3">
          <input
            id={checkboxId}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`
            absolute h-5.5 w-5.5 opacity-0 z-5
            ${disabled ? "" : "cursor-pointer"}
          `}
          />
          <div
            className={`
            relative h-5.5 w-5.5 rounded-full border flex flex-col items-center justify-center
            transition-all duration-300 ease-in-out
            ${
              disabled
                ? "bg-gray-100 border-gray-300"
                : `bg-white border-gray-300 group-hover:border-gray-400
              ${
                checked
                  ? "!border-none bg-gradient-to-br !from-black/70 via-red-900/90 !to-red-900/20"
                  : ""
              }`
            }`}
          >
            <svg
              className={`
              h-3 w-3 text-white transition-all duration-200
              ${checked ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            `}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </section>
        <section className="flex flex-col">
          {label}
          {description && (
            <p
              className={`text-xs ${
                disabled ? "text-gray-400" : "text-gray-500"
              } mt-1`}
            >
              {description}
            </p>
          )}
        </section>
      </label>

      {!disabled && (
        <span
          className={`
            absolute -left-1 -top-1 h-7 w-7 rounded-full bg-blue-100
            opacity-0 scale-0 transition-all duration-300
            ${
              checked
                ? "!opacity-0"
                : "group-active:opacity-100 group-active:scale-100"
            }
          `}
        />
      )}
    </div>
  );
}
