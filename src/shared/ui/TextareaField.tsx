import React, { TextareaHTMLAttributes } from "react";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
  inputClassName?: string;
}

const TextareaField: React.FC<IProps> = ({
  placeholder,
  inputClassName,
  ...rest
}) => {
  return (
    <textarea
      placeholder={placeholder}
      className={`${inputClassName} w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black `}
      {...rest}
    ></textarea>
  );
};

export default TextareaField;
