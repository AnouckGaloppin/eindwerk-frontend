"use client";

import { NavItem } from "@/app/layout";
import { Heart, House, /* Search, */ ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Footer = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/", 
      icon: House, 
      label: "Home",
      description: "Go to homepage"
    },
    // { 
    //   href: "/search", 
    //   icon: Search, 
    //   label: "Search",
    //   description: "Search for products"
    // },
    { 
      href: "/shoppinglist", 
      icon: ShoppingCart, 
      label: "Shopping List",
      description: "View your shopping list"
    },
    { 
      href: "/favourites", 
      icon: Heart, 
      label: "Favourites",
      description: "View your favourite products"
    },
    {
      href: user ? "/profile" : "/login",
      icon: User,
      label: user ? "Profile" : "Login",
      description: user ? "View your profile" : "Login to your account"
    },
  ];

  return (
    <footer 
      className="fixed bottom-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-teal-500 text-white"
      role="contentinfo"
      aria-label="Main navigation"
    >
      <nav 
        className="max-w-screen-sm mx-auto flex justify-between items-center px-4 py-3"
        role="navigation"
        aria-label="Primary navigation"
      >
        {navItems.map(({ href, icon: Icon, label, description }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          
          return (
            <NavItem
              key={href}
              href={href}
              className="flex flex-col items-center text-xs transition-all px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
              aria-label={`${label}${isActive ? ' (current page)' : ''}`}
              aria-describedby={`nav-description-${href.replace('/', '')}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div 
                className={clsx(
                  "rounded-full",
                  isActive ? "p-3 border-2 border-white" : "p-1"
                )}
                aria-hidden="true"
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="sr-only">{label}</span>
              <span 
                id={`nav-description-${href.replace('/', '')}`}
                className="sr-only"
              >
                {description}
              </span>
            </NavItem>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;
