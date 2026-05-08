"use client";
import React, { ReactNode, useState } from "react";
import FormField from "./FormField";
import { Eye, EyeOff } from "lucide-react";

interface IProps {
  label: string;
  placeholder: string;
  inputClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  labelIcon?: ReactNode;
  iconClassName?: string;
  hasError?: boolean;
  errorMessage?: string;
  [key: string]: any;
}

const PasswordField = React.forwardRef<any, IProps>(
  (
    {
      label,
      placeholder,
      iconClassName,
      wrapperClassName,
      containerClassName,
      inputClassName,
      labelClassName,
      labelIcon,
      hasError,
      errorMessage,
      ...rest
    },
    ref,
  ) => {
    const [isPassHidden, setIsPassHidden] = useState(true);

    const toggleIcon = () => {
      setIsPassHidden((prev) => !prev);
    };

    return (
      <FormField
        type={isPassHidden ? "password" : "text"}
        label={label}
        placeholder={placeholder}
        iconClassName={iconClassName}
        wrapperClassName={wrapperClassName}
        containerClassName={containerClassName}
        inputClassName={inputClassName}
        labelClassName={labelClassName}
        labelIcon={labelIcon}
        onIconClick={toggleIcon}
        hasError={hasError}
        errorMessage={errorMessage}
        icon={isPassHidden ? <Eye size={16} /> : <EyeOff size={16} />}
        ref={ref}
        {...rest}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";

export default PasswordField;