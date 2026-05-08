import React, { SelectHTMLAttributes } from "react";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  inputClassName?: string;
  children: React.ReactNode;
}

const SelectField: React.FC<IProps> = ({
  inputClassName,
  children,
  ...rest
}) => {
  return (
    <select
      className={`${inputClassName} px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black disabled:bg-neutral-200 disabled:text-neutral-600! disabled:focus-within:outline-0 disabled:focus:ring-0 disabled:cursor-default `}
      {...rest}
    >
      {children}
    </select>
  );
};

export default SelectField;
