import Loader from "@/src/shared/ui/Loader";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default Loading;
