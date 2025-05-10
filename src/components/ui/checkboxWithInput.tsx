import React from "react"; // Make sure React is imported if not already
import CustomCheckbox from "./checkbox";

type InputType = "text" | "textarea";

type CheckboxWithInputProps = {
  name: string;
  label: string;
  checked: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  inputType: InputType;
  inputLabel: string;
  description: string;
};

export default function CheckboxWithInput({
  name,
  label,
  checked,
  onCheckboxChange,
  inputValue,
  onInputChange,
  placeholder,
  inputType,
  inputLabel,
  description,
}: CheckboxWithInputProps) {
  return (
    <div className="">
      <section className="flex items-center select-none">
        <CustomCheckbox
          name={name}
          checked={checked}
          onChange={onCheckboxChange}
          label={label}
          description={description}
        />
        {checked && (
          <svg
            className="absolute left-0 top-0 mt-1 ml-1 h-3 w-3 text-white pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </section>
      <section
        className={`transition-all duration-400 ease-out overflow-hidden transform ${
          checked
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <label className="block text-sm font-medium text-gray-600 my-1">
          {inputLabel}
        </label>

        {inputType === "textarea" ? (
          <textarea
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
            placeholder={placeholder}
            value={inputValue}
            rows={2}
            onChange={onInputChange}
          />
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
          />
        )}
      </section>
    </div>
  );
}
