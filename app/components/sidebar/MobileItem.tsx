"use client";
import Link from "next/link";
import clsx from "clsx";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}
const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-white hover:text-white hover:bg-orange-600",
        active && "bg-orange-600 text-white"
      )}
    >
      <Icon />
    </Link>
  );
};

export default MobileItem;
