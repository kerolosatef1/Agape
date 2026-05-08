import { X } from "lucide-react";
import React from "react";

interface IProps {
  children: React.ReactNode;
  handleCloseModal?: () => void;
}

const Modal: React.FC<IProps> = ({ children, handleCloseModal }) => {
  return (
    <section
      className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleCloseModal}
    >
      <div className="px-4 w-full">
        <div
          className="bg-white rounded-lg p-6 shadow-lg w-full sm:w-2/3 md:w-1/2 xl:w-1/3 m-auto  overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="cursor-pointer flex justify-end text-muted-foreground hover:text-muted-foreground/60 transition-colors duration-300"
            onClick={handleCloseModal}
          >
            <X />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Modal;
