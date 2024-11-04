type PrimaryButtonProps = {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
};

const PrimaryButton = ({
  title,
  onClick,
  disabled = false,
  type,
}: PrimaryButtonProps) => {
  return (
    <button
      className="w-full p-2 py-3 bg-gradient-burlywood rounded"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
