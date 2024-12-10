import { ReactNode } from "react";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { Link } from "react-router-dom";

type DataCardProps = {
  amount: string;
  title: string;
  isUp: boolean;
  weeklyAmount: string;
  marginValue: string;
  icon: string | ReactNode;
  link: string;
};

const DataCard = ({
  amount,
  title,
  marginValue,
  weeklyAmount,
  isUp,
  icon,
  link,
}: DataCardProps) => {
  return (
    <Link to={link} className="max-w-[200px] mx-auto">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[28px] font-semibold">{amount}</h2>
          <p className="font-medium">{title}</p>
        </div>
        <div>
          <img src={icon as string} alt="icon" />
        </div>
      </div>
    </Link>
  );
};

export default DataCard;
