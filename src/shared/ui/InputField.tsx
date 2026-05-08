import React, { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  inputClassName?: string;
}

const InputField: React.FC<IProps> = ({
  placeholder,
  inputClassName,
  ...rest
}) => {
  return (
    <input
      placeholder={placeholder}
      className={`${inputClassName} w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-primary/60   disabled:bg-neutral-200 disabled:text-neutral-600! disabled:focus-within:outline-0 disabled:focus:ring-0 disabled:cursor-default read-only:bg-transparent read-only:focus-within:outline-0 read-only:focus:ring-0 read-only:cursor-default read-only:border-0`}
      {...rest}
    />
  );
};

export default InputField;
