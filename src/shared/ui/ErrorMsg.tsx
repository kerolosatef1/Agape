import React from "react";

interface IProps {
  message: string;
}

const ErrorMsg: React.FC<IProps> = ({ message }) => {
  return <p className="text-red-800 font-medium text-sm">{message}</p>;
};

export default ErrorMsg;
