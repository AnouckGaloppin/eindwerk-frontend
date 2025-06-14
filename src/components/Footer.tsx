"use client";

import { NavItem } from "@/app/layout";
import { Heart, House, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Footer = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: House },
    { href: "/search", icon: Search },
    { href: "/shoppinglist", icon: ShoppingCart },
    { href: "/favourites", icon: Heart },
    {
      href: user ? "/profile" : "/login",
      icon: User,
    },
  ];

  return (
    <footer className="fixed bottom-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-teal-500 text-white">
      <nav className="max-w-screen-sm mx-auto flex justify-between items-center px-4 py-3">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          
          return (
            <NavItem
              key={href}
              href={href}
              className="flex flex-col items-center text-xs transition-all px-3 py-2 rounded-xl"
            >
              <div className={clsx(
                "rounded-full",
                isActive ? "p-3 border-2 border-white" : "p-1"
              )}>
                <Icon className="w-6 h-6" />
              </div>
            </NavItem>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;
