"use client";
import React, { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  wrapperClassName?: string;
}

const SearchField: React.FC<IProps> = ({
  inputClassName,
  wrapperClassName,
  ...props
}) => {
  const t = useTranslations("pages.listings");
  return (
    <div
      className={`${wrapperClassName} flex gap-3 justify-between items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:border-transparent focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-primary/50 p-2`}
    >
      <Search className="text-gray-400" size={16} />
      <input
        placeholder={t("searchPlaceholder")}
        {...props}
        className={`w-full text-lg focus-within:outline-0 ${inputClassName}`}
      />
    </div>
  );
};

export default SearchField;
