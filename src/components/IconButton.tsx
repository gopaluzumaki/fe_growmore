import { ReactNode } from "react";

type IconButtonProps = {
  title: string;
  icon?: ReactNode | string;
  onClick?: () => void;
};

const IconButton = ({ title, icon, onClick }: IconButtonProps) => {
  return (
    <button
      className="flex items-center gap-3 border border-burlywood px-10 py-2.5 rounded-lg text-burlywood"
      onClick={onClick}
    >
      {icon}
      {title}
    </button>
  );
};

export default IconButton;
