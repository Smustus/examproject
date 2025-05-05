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
}: CheckboxWithInputProps) {
  return (
    <div className="mb-1">
      <label className="flex items-center h-10 space-x-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onCheckboxChange}
          className="h-4 w-4"
        />
        <span>{label}</span>
      </label>

      {checked && (
        <div className="">
          <label className="block text-sm font-medium mb-1">{inputLabel}</label>
          {inputType === "textarea" ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded bg-white"
              placeholder={placeholder}
              value={inputValue}
              rows={2}
              onChange={onInputChange}
            />
          ) : (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-white"
              placeholder={placeholder}
              value={inputValue}
              onChange={onInputChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
