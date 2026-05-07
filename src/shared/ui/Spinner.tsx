import React from "react";
interface IProps {
  className?: string;
}

const Spinner: React.FC<IProps> = ({ className = "" }) => {
  return <span className={`loader size-6! ${className}`}></span>;
};

export default Spinner;
