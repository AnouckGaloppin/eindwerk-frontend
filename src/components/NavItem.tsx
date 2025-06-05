import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type NavItemProps = {
  label: string;
  href: string;
  children: ReactNode;
  className?: string;
};

export const NavItem = ({ label, href, children, className }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        className
      )}
    >
      {children}
      <span className="text-[10px] mt-1">{label}</span>
    </Link>
  );
};

export default NavItem;
