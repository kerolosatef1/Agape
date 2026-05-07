"use client";
import React, { ReactNode } from "react";
import ErrorMsg from "./ErrorMsg";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";

interface IProps {
  label: string;
  placeholder?: string;
  inputClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  icon?: ReactNode;
  labelIcon?: ReactNode;
  iconClassName?: string;
  onIconClick?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  fieldType?: "input" | "textarea" | "select";
  children?: React.ReactNode;
  [key: string]: any;
}

const FormField = React.forwardRef<any, IProps>(
  (
    {
      label,
      placeholder,
      icon,
      iconClassName,
      wrapperClassName,
      containerClassName,
      inputClassName,
      labelClassName,
      labelIcon,
      onIconClick,
      hasError,
      errorMessage,
      isRequired,
      fieldType = "input",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        className={`${containerClassName || ""} w-full flex flex-col gap-2`}
      >
        <label
          htmlFor={rest.id}
          className={`${labelClassName || ""} text-sm font-medium flex gap-1 items-center capitalize`}
        >
          {labelIcon && <span>{labelIcon}</span>}
          <span>{label}</span>
          {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className={`${wrapperClassName ?? "relative"}`}>
          {fieldType === "textarea" ? (
            <TextareaField
              placeholder={placeholder as string}
              inputClassName={`${inputClassName || ""}`}
              ref={ref}
              {...rest}
            />
          ) : fieldType === "select" ? (
            <SelectField
              inputClassName={`${inputClassName || ""} w-full`}
              ref={ref}
              {...rest}
            >
              {children}
            </SelectField>
          ) : (
            <InputField
              placeholder={placeholder as string}
              inputClassName={inputClassName}
              ref={ref}
              {...rest}
            />
          )}
          {icon && (
            <div
              className={`${iconClassName || ""} cursor-pointer absolute end-1 top-1/2 -translate-y-1/2 text-neutral-400 p-3`}
              onClick={onIconClick}
            >
              <span>{icon}</span>
            </div>
          )}
        </div>
        {(hasError || errorMessage) && <ErrorMsg message={errorMessage || ""} />}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;