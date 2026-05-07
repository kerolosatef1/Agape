import React from "react";

interface IProps {
  className?: string;
}

const Loader: React.FC<IProps> = ({ className = "" }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center w-full">
      <span
        className={`loader border-primary! border-b-muted! ${className}`}
      ></span>
    </div>
  );
};

export default Loader;
