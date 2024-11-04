import { ReactNode } from "react";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";

type DataCardProps = {
  amount: string;
  title: string;
  isUp: boolean;
  weeklyAmount: string;
  marginValue: string;
  icon: string | ReactNode;
};

const DataCard = ({
  amount,
  title,
  marginValue,
  weeklyAmount,
  isUp,
  icon,
}: DataCardProps) => {
  return (
    <main>
      <div className="max-w-[200px] mx-auto">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[28px] font-semibold">{amount}</h2>
            <p className="font-medium">{title}</p>
          </div>
          <div>
            <img src={icon as string} alt="icon" />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center text-Weldonblue mt-3">
          <p className="flex gap-2 items-center">
            <span>
              {isUp ? (
                <GoArrowUpRight size={20} color="green" />
              ) : (
                <GoArrowDownLeft size={20} color="red" />
              )}
            </span>
            <span>{marginValue}</span>
          </p>
          <p>{`${isUp ? "+" : "-"} ${weeklyAmount}% this week`}</p>
        </div>
      </div>
    </main>
  );
};

export default DataCard;
