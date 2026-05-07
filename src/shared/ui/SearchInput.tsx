"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full ps-11 pe-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#1a1a6e]/20 focus:border-[#1a1a6e]/40 focus-within:outline-none transition-all"
      />
    </div>
  );
};

export default SearchInput;